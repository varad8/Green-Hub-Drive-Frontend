import { Component, Pipe, PipeTransform } from '@angular/core';
import { AdminserviceService } from '../../../../EvDataService/adminservice.service';
import { AuthService } from '../../../../shared/auth.service';
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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  evAdminProfile: any | undefined;
  private baseUrl = environment.BASE_URL;

  constructor(
    private evdataservice: AdminserviceService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    // Fetch EvAdminProfile data
    const sessionUser = this.auth.getEvAdminSession();
    if (sessionUser) {
      this.auth.getAdminProfileUsingId(sessionUser.userid).subscribe(
        (data) => {
          this.evAdminProfile = data[0];
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

  //format date to show on input
  formatTime(time: { hours: number; minutes: number }): string {
    // Format hours and minutes to ensure they have leading zeros if necessary
    const formattedHours = ('0' + time.hours).slice(-2); // Ensure 2 digits
    const formattedMinutes = ('0' + time.minutes).slice(-2); // Ensure 2 digits

    // Return the time string in 'HH:mm' format
    return `${formattedHours}:${formattedMinutes}`;
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
