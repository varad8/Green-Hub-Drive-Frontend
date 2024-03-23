import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserservicesService } from '../../../UserDataService/userservices.service';
import { environment } from '../../../../environments/environment.development';

type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

@Component({
  selector: 'app-evdetailspage',
  templateUrl: './evdetailspage.component.html',
  styleUrls: ['./evdetailspage.component.css'], // corrected typo here
})
export class EvdetailspageComponent implements OnInit {
  baseUrl = environment.BASE_URL;
  stationid: any = '';
  evAdminProfile: any;

  constructor(
    private route: ActivatedRoute,
    private evdataservice: UserservicesService
  ) {}

  ngOnInit(): void {
    this.stationid = this.route.snapshot.paramMap.get('stationid');

    if (this.stationid) {
      this.evdataservice.getEvStationByUserId(this.stationid).subscribe(
        (data) => {
          this.evAdminProfile = data[0];
          console.log('Station data:', this.evAdminProfile);
        },
        (error) => {
          console.error('Error fetching station data:', error);
          // Handle error as needed
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
    return `${this.baseUrl}/user/image/${filename}`;
  }
}
