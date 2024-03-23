import { Component } from '@angular/core';
import { AuthService } from '../../../shared/auth.service';
import { UserservicesService } from '../../../UserDataService/userservices.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-usersetting',
  templateUrl: './usersetting.component.html',
  styleUrl: './usersetting.component.css',
})
export class UsersettingComponent {
  private baseUrl = environment.BASE_URL;
  profileData: any;
  userProfile: any;
  selectedFile: File | null = null;
  previewImage: string | null = null;

  citiesapiData: any;

  selectedCityName: string = '';
  selectedCityState: string = '';

  onCityChange(event: any): void {
    this.selectedCityName = event.target.value;
    this.selectedCityState = this.getState(this.selectedCityName);

    this.userProfile!.city = this.selectedCityName;
    this.userProfile!.state = this.selectedCityState;
  }

  getState(cityName: string): string {
    const selectedCity = this.citiesapiData.find(
      (city: any) => city.name === cityName
    );
    return selectedCity ? selectedCity.state : '';
  }

  constructor(
    private auth: AuthService,
    private userservice: UserservicesService,
    private http: HttpClient
  ) {}
  ngOnInit() {
    const sessionUser = this.auth.getWebUserSession();
    if (sessionUser?.accountType === 'user') {
      this.auth.getUserProfileUsingID(sessionUser.userid).subscribe(
        (data) => {
          this.userProfile = data.profile;
          this.userProfile.createdDate = this.convertTimestampToReadable(
            this.userProfile.createdDate
          );
          this.userProfile.dob = this.formatDate(this.userProfile.dob);
          this.selectedCityName = this.userProfile.city;
          this.selectedCityState = this.userProfile.state;
          console.log(this.formatDate(this.userProfile.dob));
        },
        (error) => {
          console.error('Error fetching user data:', error);
          // Handle error
        }
      );
    }

    // Make an HTTP GET request to the API
    this.userservice.getAllCity().subscribe(
      (data) => {
        this.citiesapiData = data;
      },
      (error) => {
        console.error('Error fetching data:', error);
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

  //saveUserDetails

  updateUserProfileDetails() {
    const userid = this.userProfile!.userid;
    const gender = this.userProfile!.gender;
    const firstname = this.userProfile!.firstname;
    const lastname = this.userProfile!.lastname;
    const dob = this.userProfile!.dob;
    const mobile = this.userProfile!.mobile;
    const address = this.userProfile!.address;
    const city = this.userProfile!.city;
    const state = this.userProfile!.state;

    this.profileData = {
      firstname: firstname,
      lastname: lastname,
      mobile: mobile,
      dob: dob,
      address: address,
      city: city,
      state: state,
      gender: gender,
    };

    this.userservice
      .updateUserProfileDetails(userid, this.profileData)
      .subscribe(
        (response) => {
          console.log('User profile updated successfully:', response);
          alert(response.message);
        },
        (error) => {
          console.error('Error updating user profile:', error);
          alert(error.error.error);
        }
      );
  }

  formatDate(dateString: string): string {
    // Parse the ISO 8601 date string into a Date object
    const date = new Date(dateString);
    // Extract year, month, and day from the Date object
    const year = date.getFullYear();
    // Months are zero-based in JavaScript Date objects, so add 1 to get the correct month
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    // Construct the formatted date string in yyyy-mm-dd format
    return `${year}-${month}-${day}`;
  }

  //update profile image
  async saveProfilePic() {
    if (this.selectedFile) {
      const userId = this.userProfile?.userid || '';

      // Call the service method to upload the profile image
      this.auth.uploadProfileImage(userId, this.selectedFile).subscribe(
        (response) => {
          console.log('File uploaded successfully:', response);
          alert(response.message);
          // Handle success, if needed
        },
        (error) => {
          console.error('Error uploading file:', error);
          alert(error.error.error);
          // Handle error, if needed
        }
      );
    }
  }

  //Get Image
  getProfileImageUrl(filename: string): string {
    return `${this.baseUrl}/user/image/${filename}`;
  }

  convertTimestampToReadable(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { timeZone: 'UTC' });
  }
}
