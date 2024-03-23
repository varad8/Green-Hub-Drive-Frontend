import { Component } from '@angular/core';

import { AdminserviceService } from '../../../../EvDataService/adminservice.service';
import { AuthService } from '../../../../shared/auth.service';
import { AngularFireUploadTask } from '@angular/fire/compat/storage';
import { Time } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';

type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  private baseUrl = environment.BASE_URL;
  evAdminProfile: any | undefined;
  selectedFile: File | null = null;
  selectedEvFile: File | null = null;
  previewImage: string | null = null;
  evpreviewImage: string | null = null;
  citiesapiData: any;

  selectedCityName: string = '';
  selectedCityState: string = '';

  onCityChange(event: any): void {
    this.selectedCityName = event.target.value;
    this.selectedCityState = this.getState(this.selectedCityName);

    this.evAdminProfile.location = {
      city: this.selectedCityName,
      state: this.selectedCityState,
    };
  }

  getState(cityName: string): string {
    const selectedCity = this.citiesapiData.find(
      (city: any) => city.name === cityName
    );
    return selectedCity ? selectedCity.state : '';
  }

  constructor(
    private auth: AuthService,
    private adminService: AdminserviceService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Fetch AdminProfile data
    // Check if there is an existing session with the admin or superadmin accountType

    // Fetch EvAdminProfile data
    const sessionUser = this.auth.getEvAdminSession();
    if (sessionUser) {
      this.auth.getAdminProfileUsingId(sessionUser.userid).subscribe(
        (data) => {
          console.log(data);
          this.evAdminProfile = data[0];

          this.selectedCityName = this.evAdminProfile.location.city;
          this.selectedCityState = this.evAdminProfile.location.state;

          // this.userProfile.dob = this.formatDate(this.userProfile.dob);
          this.evAdminProfile.updatedAt = this.convertTimestampToReadable(
            this.evAdminProfile.updatedAt
          );
          this.evAdminProfile.profile.dateofjoining =
            this.convertTimestampToReadable(
              this.evAdminProfile.profile.dateofjoining
            );
        },
        (error) => {
          console.error('Error fetching user data:', error);
          // Handle error
        }
      );
    }

    this.adminService.getAllCity().subscribe(
      (data) => {
        this.citiesapiData = data;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  getDayOfWeek(): DayOfWeek[] {
    return [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
  }

  //save profile basic information
  saveProfileDetails() {
    const userId = this.evAdminProfile!.userid;
    const fieldsToUpdate = {
      firstname: this.evAdminProfile!.profile.firstname,
      lastname: this.evAdminProfile!.profile.lastname,
      dob: this.evAdminProfile!.profile.dob,
      mobile: this.evAdminProfile!.profile.mobile,
      address: this.evAdminProfile!.address,
    };

    this.adminService
      .updateEvAdminProfileFields(userId, fieldsToUpdate)
      .subscribe(
        (response) => {
          console.log('Ev User profile updated successfully:', response);
          alert(response.message);
        },
        (error) => {
          console.error('Error updating Ev user profile:', error);
          alert(error.error.error);
        }
      );
  }

  //select file for profile
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Show preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // select file for ev image landscape

  onEvImageFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedEvFile = file;

      // Show preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.evpreviewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // update that evimage
  async saveEvImage() {
    if (this.selectedEvFile) {
      const userId = this.evAdminProfile?.userid || '';

      // Call the service method to upload the profile image
      this.adminService.updateCoverImage(userId, this.selectedEvFile).subscribe(
        (response) => {
          console.log('File uploaded successfully:', response);
          alert(response.message);
        },
        (error) => {
          console.error('Error uploading file:', error);
          alert(error.error.error);
        }
      );
    }
  }

  //update profile pic of user

  async saveProfilePic() {
    if (this.selectedFile) {
      const userId = this.evAdminProfile?.userid || '';

      // Call the service method to upload the profile image
      this.adminService
        .updateAdminProfilePic(userId, this.selectedFile)
        .subscribe(
          (response) => {
            console.log('File uploaded successfully:', response);
            alert(response.message);
          },
          (error) => {
            console.error('Error uploading file:', error);
            alert(error.error.error);
          }
        );
    }
  }

  //Update Evdetails timing / rate /description / title /coordinates

  saveEvDetails() {
    const userId = this.evAdminProfile!.userid;
    const updatedEvTimings = this.transformEvTimings(
      this.evAdminProfile!.evTimings
    ); // Update evTimings
    const updatedRate = this.evAdminProfile!.rate; // Update rate
    const updatedTitle = this.evAdminProfile!.title; // Update title
    const updatedDescription = this.evAdminProfile!.description; // Update description
    const updateLocation = this.evAdminProfile!.location; //update locatiopn
    const updateCoordinates = this.evAdminProfile!.coordinates; //update coordinates

    const evDetails = {
      evTimings: updatedEvTimings,
      rate: updatedRate,
      title: updatedTitle,
      description: updatedDescription,
      location: updateLocation,
      coordinates: updateCoordinates,
    };

    console.log(evDetails);

    this.adminService.updateEvDetails(userId, evDetails).subscribe(
      (response) => {
        console.log('Ev User profile updated successfully:', response);
        alert(response.message);
      },
      (error) => {
        console.error('Error updating Ev user profile:', error);
        alert(error.error.error);
      }
    );
  }

  // onchange date on set on that evTimings object

  updateOpeningTime(day: string, event: any) {
    const newValue = (event.target as HTMLInputElement).value;

    // Ensure that day is a valid key
    if (this.isValidDay(day)) {
      const dayTimings = this.evAdminProfile?.evTimings[day] as
        | {
            openingTime: Time;
            closingTime: Time;
          }
        | undefined;

      if (dayTimings) {
        dayTimings.openingTime = this.convertTimeStringToTime(newValue);
        console.log(this.evAdminProfile?.evTimings);
      } else {
        console.error(`Invalid day timings for: ${day}`);
      }
    } else {
      console.error(`Invalid day: ${day}`);
    }
  }

  updateClosingTime(day: string, event: any) {
    const newValue = (event.target as HTMLInputElement).value;

    // Ensure that day is a valid key
    if (this.isValidDay(day)) {
      const dayTimings = this.evAdminProfile?.evTimings[day] as
        | {
            openingTime: Time;
            closingTime: Time;
          }
        | undefined;

      if (dayTimings) {
        dayTimings.closingTime = this.convertTimeStringToTime(newValue);
        console.log(this.evAdminProfile?.evTimings);
      } else {
        console.error(`Invalid day timings for: ${day}`);
      }
    } else {
      console.error(`Invalid day: ${day}`);
    }
  }

  isValidDay(day: string): day is DayOfWeek {
    return [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ].includes(day);
  }

  convertTimeStringToTime(timeString: string): Time {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
  }

  //format date to show on input
  formatTime(time: { hours: number; minutes: number }): string {
    // Format hours and minutes to ensure they have leading zeros if necessary
    const formattedHours = ('0' + time.hours).slice(-2); // Ensure 2 digits
    const formattedMinutes = ('0' + time.minutes).slice(-2); // Ensure 2 digits

    // Return the time string in 'HH:mm' format
    return `${formattedHours}:${formattedMinutes}`;
  }

  formatTime2(hours: number, minutes: number): string {
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${formattedHours}:${formattedMinutes}`;
  }

  transformEvTimings(evTimings: any): any {
    const transformedEvTimings: any = {};

    Object.keys(evTimings).forEach((day) => {
      const openingTime = this.formatTime2(
        evTimings[day].openingTime.hours,
        evTimings[day].openingTime.minutes
      );
      const closingTime = this.formatTime2(
        evTimings[day].closingTime.hours,
        evTimings[day].closingTime.minutes
      );
      transformedEvTimings[day] = { openingTime, closingTime };
    });

    return transformedEvTimings;
  }

  //Get Image
  getProfileImageUrl(filename: string): string {
    return `${this.baseUrl}/admin/image/${filename}`;
  }

  convertTimestampToReadable(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { timeZone: 'UTC' });
  }
}
