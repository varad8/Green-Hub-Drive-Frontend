import { Component } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { HttpClient } from '@angular/common/http';
import { UserservicesService } from '../../UserDataService/userservices.service';
import { forkJoin } from 'rxjs';
import { Route, Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-searchevform',
  templateUrl: './searchevform.component.html',
  styleUrl: './searchevform.component.css',
})
export class SearchevformComponent {
  private baseUrl = environment.BASE_URL;
  selectedCityName: string = '';
  selectedCityState: string = '';
  selectedSlot: string;
  selectedDate: string;
  selectedTime: string;
  selectedHours: string;
  session: any;
  showModal: boolean = false;
  timeSuggestion: any;
  citiesapiData: any;

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private userservice: UserservicesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.session = this.auth.getWebUserSession();

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

  //get selected city and state
  onCityChange(event: any): void {
    this.selectedCityName = event.target.value;
    this.selectedCityState = this.getState(this.selectedCityName);
  }

  //get Selected state
  getState(cityName: string): string {
    const selectedCity = this.citiesapiData.find(
      (city: any) => city.name === cityName
    );
    return selectedCity ? selectedCity.state : '';
  }

  onSearch(city: string, state: string) {
    // Prepare data to send to the server
    const requestData = {
      date: this.selectedDate,
      slot: this.selectedSlot,
      slothours: this.selectedHours,
      time: this.selectedTime,
      city: city,
      state: state,
    };

    // Call the checkAvailability method from your service
    this.userservice.checkAvailability(requestData).subscribe(
      (response) => {
        this.timeSuggestion = response;
        this.showModal = true;
      },
      (error) => {
        alert(error.error.error);
      }
    );
  }

  closeModal() {
    this.showModal = false;
  }

  selectedSlotByUser(
    startTime: string,
    endTime: string,
    stationId: string,
    slot: string,
    hours: string,
    date: string
  ) {
    // Implement your logic here to handle the selected slot
    console.log(
      `Selected slot: ${startTime} - ${endTime}, Station ID: ${stationId}`
    );
    // Example: Navigate to the details page with the selected slot and station ID
    this.router.navigate(['/evstation', stationId], {
      queryParams: {
        timing: `${this.convertTo24HourFormat(startTime)}`,
        slot: slot,
        hours: hours,
        date: date,
      },
    });
  }

  convertTo24HourFormat(time12Hour: string): string {
    const [timePart, periodPart] = time12Hour.split(' ');
    const [hoursPart, minutesPart] = timePart.split(':');

    let hours = parseInt(hoursPart, 10);
    const minutes = parseInt(minutesPart, 10);

    if (periodPart.toLowerCase() === 'pm' && hours < 12) {
      hours += 12;
    } else if (periodPart.toLowerCase() === 'am' && hours === 12) {
      hours = 0;
    }

    const hoursString = String(hours).padStart(2, '0');
    const minutesString = String(minutes).padStart(2, '0');

    return `${hoursString}:${minutesString}`;
  }

  //Get Image
  getProfileImageUrl(filename: string): string {
    return `${this.baseUrl}/user/image/${filename}`;
  }
}
