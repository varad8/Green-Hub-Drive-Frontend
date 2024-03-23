import { Component } from '@angular/core';
import { AuthService } from '../../../../shared/auth.service';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-sprofile',
  templateUrl: './sprofile.component.html',
  styleUrl: './sprofile.component.css',
})
export class SprofileComponent {
  private baseUrl = environment.BASE_URL;
  adminProfile: any;
  constructor(private auth: AuthService) {}

  ngOnInit() {
    const sessionUser = this.auth.getAdminSession();
    if (sessionUser) {
      this.auth.getSuperAdminProfileUsingID(sessionUser.adminId).subscribe(
        (data) => {
          this.adminProfile = data.profile;
          this.adminProfile.dob = this.formatDate(this.adminProfile.dob);
          this.adminProfile.dateOfCreation = this.convertTimestampToReadable(
            this.adminProfile.dateOfCreation
          );
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
    }
  }

  //Get Image
  getProfileImageUrl(filename: string): string {
    return `${this.baseUrl}/admin/image/${filename}`;
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
}
