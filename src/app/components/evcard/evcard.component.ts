import { Component } from '@angular/core';
import { UserservicesService } from '../../UserDataService/userservices.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-evcard',
  templateUrl: './evcard.component.html',
  styleUrl: './evcard.component.css',
})
export class EvcardComponent {
  private baseUrl = environment.BASE_URL;
  constructor(private userdata: UserservicesService) {}
  station: any;

  pageSize = 4; // Number of stations to display per page
  currentPage = 1; // Current page
  activeIndex = -1; // Index of the active card

  ngOnInit(): void {
    //Get All Evstations
    this.userdata.getAllEvStations().subscribe(
      (data: any[]) => {
        // Filter active stations based on accountStatus
        this.station = data.filter(
          (station) => station.accountStatus?.status === 'ACTIVE'
        );

        console.log(this.station);

        this.station.forEach((station) => {
          this.getRatings(station);
        });
      },
      (error) => {
        console.log('Error fetching EV stations:', error);
      }
    );
  }

  getRatings(station: any) {
    station.averageRating = 0;
    this.userdata.getRatingsOfStation(station.userid).subscribe(
      (data: any) => {
        station.averageRating = data.averageRating;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  get visiblestation() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.station.slice(startIndex, endIndex);
  }

  totalPages(): number {
    return Math.ceil(this.station.length / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getEvTiming(event: {
    evTimings: { [key: string]: { openingTime: string; closingTime: string } };
  }): string {
    const day = Object.keys(event.evTimings).find(
      (key) => event.evTimings[key].openingTime !== ''
    );
    if (!day) {
      return 'Closed all week';
    }
    const { openingTime, closingTime } = event.evTimings[day];
    return `${day}: ${openingTime} - ${closingTime}`;
  }
  //Get Image
  getProfileImageUrl(filename: string): string {
    return `${this.baseUrl}/user/image/${filename}`;
  }
}
