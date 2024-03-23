import { Component } from '@angular/core';
import { AdminserviceService } from '../../../../EvDataService/adminservice.service';
import { AuthService } from '../../../../shared/auth.service';
import { UserservicesService } from '../../../../UserDataService/userservices.service';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent {
  private baseUrl = environment.BASE_URL;
  notificationTitle: string;
  notificationDescription: string;
  notificationModal: boolean = false;
  session: any;
  notificationAlldata: any;
  selectedNotification: any;
  filterType: string;
  searchTerm: string;
  filterDate: string;
  filteredNotificationAlldata: any;

  constructor(
    private evdata: AdminserviceService,
    private auth: AuthService,
    private userservice: UserservicesService
  ) {}

  openModal(notification: any) {
    this.notificationModal = true;
    this.selectedNotification = notification;
    this.retriveNotificationById(notification);
  }
  closeModal() {
    this.notificationModal = false;
  }

  ngOnInit(): void {
    this.session = this.auth.getEvAdminSession();
    this.getAllNotification(this.session.userid);
  }

  getAllNotification(userid: string) {
    this.evdata.getNotificationByEvUserId(userid).subscribe(
      (notifications: any[]) => {
        this.notificationAlldata = notifications;
        this.filteredNotificationAlldata = [...this.notificationAlldata]; // Initialize filtered data with all notifications
        // Iterate through notifications to get EV station details for each stationuserid
        this.notificationAlldata.forEach((notification) => {
          this.getUserDetails(notification);
        });

        console.log(this.notificationAlldata);
      },
      (error) => {
        console.error('Error fetching notifications:', error);
      }
    );
  }

  getUserDetails(notification: any) {
    this.auth
      .getUserProfileUsingID(notification.userid)
      .subscribe((profileDetails: any) => {
        console.log(profileDetails.profile);

        // Assign the EV station details to the corresponding notification
        notification.profileDetails = profileDetails.profile;
      });
  }

  filterNotification() {
    // Create a copy of the original notificationAlldata array
    this.filteredNotificationAlldata = [...this.notificationAlldata];

    if (this.filterType === 'Today') {
      const today = new Date().toISOString().split('T')[0];
      this.filteredNotificationAlldata =
        this.filteredNotificationAlldata.filter(
          (notification) =>
            this.getFormattedDate(notification.createdAt) === today
        );
    } else if (this.filterType === 'Yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayFormatted = yesterday.toISOString().split('T')[0];
      this.filteredNotificationAlldata =
        this.filteredNotificationAlldata.filter(
          (notification) =>
            this.getFormattedDate(notification.createdAt) === yesterdayFormatted
        );
    } else if (this.filterType === 'All') {
      // Show all notifications without filtering
      return;
    }

    // Filtering by email
    if (this.searchTerm) {
      this.filteredNotificationAlldata =
        this.filteredNotificationAlldata.filter((notification) =>
          notification.profileDetails.email
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
        );
    }

    // Filtering by date
    if (this.filterDate) {
      const filterDateFormatted = new Date(this.filterDate)
        .toISOString()
        .split('T')[0];
      this.filteredNotificationAlldata =
        this.filteredNotificationAlldata.filter(
          (notification) =>
            this.getFormattedDate(notification.createdAt) ===
            filterDateFormatted
        );
    }
  }

  getFormattedDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0];
  }
  //Get Image
  getProfileImageUrl(filename: string): string {
    return `${this.baseUrl}/admin/image/${filename}`;
  }

  //Get Notification by notification id
  retriveNotificationById(notification: any) {
    this.evdata
      .getNotificationByStationNNotId(
        notification.id,
        notification.stationuserid
      )
      .subscribe(
        (notifications: any[]) => {
          this.notificationTitle = notification.notificationTitle;
          this.notificationDescription = notification.notificationMessage;
        },
        (error) => {
          console.error('Error fetching notifications:', error);
        }
      );
  }

  updateNotification() {
    const notificationData = {
      id: this.selectedNotification.id,
      stationuserid: this.selectedNotification.stationuserid,
      notificationTitle: this.notificationTitle,
      notificationMessage: this.notificationDescription,
    };
    this.evdata.updateNotification(notificationData).subscribe(
      (response) => {
        this.closeModal();
        alert(response.message);
      },
      (error) => {
        alert(error.error.error);
      }
    );
  }

  convertTimestampToReadable(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { timeZone: 'UTC' });
  }
}
