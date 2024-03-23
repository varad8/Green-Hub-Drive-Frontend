import { Component } from '@angular/core';
import { AuthService } from '../../../shared/auth.service';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrl: './userprofile.component.css',
})
export class UserprofileComponent {
  private baseUrl = environment.BASE_URL;
  userProfile: any;
  constructor(private auth: AuthService) {}
  ngOnInit() {
    const sessionUser = this.auth.getWebUserSession();
    if (sessionUser?.accountType === 'user') {
      this.auth.getUserProfileUsingID(sessionUser.userid).subscribe(
        (data) => {
          this.userProfile = data.profile;
          this.userProfile.dob = this.formatDate(this.userProfile.dob);
          this.userProfile.updatedDate = this.convertTimestampToReadable(
            this.userProfile.updatedDate
          );

          this.userProfile.createdDate = this.convertTimestampToReadable(
            this.userProfile.createdDate
          );

          // Handle the received user data here
        },
        (error) => {
          console.error('Error fetching user data:', error);
          // Handle error
        }
      );
    }
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

  convertTimestampToReadable(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { timeZone: 'UTC' });
  }

  //Get Image
  getProfileImageUrl(filename: string): string {
    return `${this.baseUrl}/user/image/${filename}`;
  }
}
