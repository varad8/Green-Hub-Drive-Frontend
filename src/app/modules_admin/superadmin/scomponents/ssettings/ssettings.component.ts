import { Component } from '@angular/core';
import { AuthService } from '../../../../shared/auth.service';
import { AdminservicesService } from '../../../../AdminDataService/adminservices.service';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-ssettings',
  templateUrl: './ssettings.component.html',
  styleUrl: './ssettings.component.css',
})
export class SsettingsComponent {
  private baseUrl = environment.BASE_URL;
  adminProfile: any;
  selectedFile: File | null = null;
  previewImage: string | null = null;

  constructor(private auth: AuthService, private ads: AdminservicesService) {}
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

  //saveAdminDetails
  saveAdminDetails() {
    const adminId = this.adminProfile!.adminId;
    const firstName = this.adminProfile!.firstName;
    const lastName = this.adminProfile!.lastName;
    const dob = this.adminProfile!.dob;
    const mobileNo = this.adminProfile!.mobileNo;
    const address = this.adminProfile!.address;

    const profileDatat = {
      firstname: firstName,
      lastname: lastName,
      dob: dob,
      mobile: mobileNo,
      address: address,
    };

    // Call the service method to update the fields
    this.ads.updateAdminDetails(adminId, profileDatat).subscribe(
      (response) => {
        alert(response.message);
      },
      (error) => {
        alert(error.error.error);
      }
    );
  }

  //update profile image
  async saveProfilePic() {
    if (this.selectedFile) {
      const adminId = this.adminProfile?.adminId || '';

      // Call the service method to upload the profile image
      this.ads.uploadProfileImage(adminId, this.selectedFile).subscribe(
        (response) => {
          alert(response.message);
        },
        (error) => {
          alert(error.error.error);
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
