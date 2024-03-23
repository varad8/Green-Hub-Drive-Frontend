import { Component } from '@angular/core';
import { AuthService } from '../../../shared/auth.service';
import { UserservicesService } from '../../../UserDataService/userservices.service';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent {
  private baseUrl = environment.BASE_URL;
  session: any;
  notificationdata: any;
  constructor(
    private auth: AuthService,
    private userservice: UserservicesService
  ) {}

  ngOnInit(): void {
    this.session = this.auth.getWebUserSession();
    this.getNotification(this.session.userid);
  }

  getNotification(userid: string) {
    this.userservice.getNotificationById(userid).subscribe(
      (notifications: any[]) => {
        this.notificationdata = notifications;
        // Iterate through notifications to get EV station details for each stationuserid
        this.notificationdata.forEach((notification) => {
          this.getEvStationDetails(notification);
        });
      },
      (error) => {
        console.error('Error fetching notifications:', error);
      }
    );
  }

  getEvStationDetails(notification: any) {
    this.userservice
      .getEvStationByUserId(notification.stationuserid)
      .subscribe((evStationDetails: any) => {
        // Assign the EV station details to the corresponding notification
        notification.evStationDetails = evStationDetails[0];
      });
  }

  //Get Image
  getProfileImageUrl(filename: string): string {
    return `${this.baseUrl}/user/image/${filename}`;
  }
}
