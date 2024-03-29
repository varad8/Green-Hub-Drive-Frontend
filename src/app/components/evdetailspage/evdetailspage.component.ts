import { Component, NgZone, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ActivatedRoute } from '@angular/router';
import { UserservicesService } from '../../UserDataService/userservices.service';
import { AuthService } from '../../shared/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AdminserviceService } from '../../EvDataService/adminservice.service';

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
  styleUrl: './evdetailspage.component.css',
})
export class EvdetailspageComponent {
  private baseUrl = environment.BASE_URL;
  userLogged: any;
  selecteddata: any;
  openBookingModal: boolean = false;
  stationid: any = '';
  userLoggedStatus: boolean = false;
  station: any;
  session: any;
  ratingdata: any;

  //Booking fields
  selectedSlot: string = '';
  selectedDate: string = '';
  selectedTime: string = '';
  selectedDuration: string = '';

  //payment modal
  isLoading: boolean = false;
  paymentSuccess: boolean = false;
  bookingSuccessModalVisible: boolean = false;

  countries: any[] = [];
  selectedCountry: any = {};

  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
  center: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0,
  };
  markerPositions: google.maps.LatLngLiteral[] = [];
  zoom = 13;

  handler: any = null;

  constructor(
    private route: ActivatedRoute,
    private evdata: UserservicesService,
    private adminservice: AdminserviceService,
    private userAuth: AuthService
  ) {}

  ngOnInit(): void {
    this.userLoggedStatus = this.userAuth.checkUserLoggedIn();
    this.session = this.userAuth.getWebUserSession();
    this.userLogged = this.userAuth.getWebUserSession();
    this.stationid = this.route.snapshot.paramMap.get('stationid');
    this.populateMarkers();

    //Get the query params
    // Retrieve query parameters and log them
    this.route.queryParams.subscribe((params) => {
      const timing = params['timing'];
      const slot = params['slot'];
      const hours = params['hours'];
      const date = params['date'];

      this.selectedSlot = slot;
      this.selectedTime = this.timeFormat(timing);
      console.log('Formated Timing:', this.selectedTime);
      this.selectedDate = date;
      this.selectedDuration = hours;

      console.log('Query parameters:', timing, slot, hours, date);
    });

    //Get Ev Station by userid
    this.evdata.getEvStationByUserId(this.stationid).subscribe(
      (data: any) => {
        this.station = data[0];
        this.getRatings(this.station);
        this.getAllFeedBack(this.station);

        const { latitude, longitude } = this.station.coordinates;
        this.center = { lat: +latitude, lng: +longitude };
      },
      (error) => {
        console.error('Error fetching EV stations by userid:', error);
      }
    );
  }

  populateMarkers(): void {
    if (this.station) {
      const { latitude, longitude } = this.station.coordinates;
      this.markerPositions.push({ lat: +latitude, lng: +longitude });
    }
  }

  getRatings(station: any) {
    station.averageRating = 0;
    this.evdata.getRatingsOfStation(station.userid).subscribe(
      (data: any) => {
        station.averageRating = data.averageRating;
      },
      (error) => {
        station.averageRating = 0;
      }
    );
  }

  getAllFeedBack(station: any) {
    this.adminservice.getAllRatingByStationId(station.userid).subscribe(
      (data: any) => {
        this.ratingdata = data.ratings;
        this.ratingdata.forEach((ratings) => {
          this.getUserDetails(ratings);
        });
      },
      (error) => {
        console.error('Error fetching EV stations by userid:', error);
      }
    );
  }

  getUserDetails(ratings: any) {
    this.userAuth.getUserProfileUsingID(ratings.userId).subscribe(
      (profileDetails: any) => {
        console.log(profileDetails.profile);

        // Assign the profile details to the corresponding rating
        ratings.profileDetails = profileDetails.profile;
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );
  }

  openInfoWindow(marker: MapMarker) {
    if (this.infoWindow != undefined) this.infoWindow.open(marker);
  }

  // Book Slot Logic here
  bookSlot(stationdata: any) {
    if (!this.userLoggedStatus) {
      return alert('Please Logged In First');
    }

    if (this.userLoggedStatus && this.session?.accountType !== 'user') {
      return alert('This feature for only user');
    }
    this.selecteddata = stationdata;
    this.openBookingModal = true;
  }

  makePayment() {
    console.log(
      this.selectedDate,
      this.selectedDuration,
      this.selectedSlot,
      this.selectedTime
    );

    const formData = {
      amount: this.calculateAmount(),
      email: this.session.email,
      name: `${this.session.firstname} ${this.session.lastname}`,
      mobile: this.session.mobile,
      userid: this.session.userid,
      stationid: this.selecteddata.userid,
      totalHoursEvBooking: this.selectedDuration,
      timeForBooked: this.selectedTime,
      bookingSlot: this.selectedSlot,
      bookedForDate: this.selectedDate,
      evid: this.selecteddata.evid,
    };

    const requestData = {
      date: this.selectedDate,
      slot: this.selectedSlot,
      slothours: this.selectedDuration,
      time: this.selectedTime,
    };

    this.evdata
      .checkSlotAvailability(this.selecteddata.userid, requestData)
      .subscribe(
        (response) => {
          console.log('Slot availability response:', response);

          console.log(response);

          // Handle response here
          this.evdata.initiatePayment(formData);
        },
        (error) => {
          console.error('Error checking slot availability:', error);
          alert(error.error.error);
        }
      );
  }

  calculateAmount(): number {
    if (this.selecteddata && this.selectedDuration) {
      const rate = Number(this.selecteddata.rate);
      const duration = Number(this.selectedDuration);
      return rate * duration;
    }
    return 0;
  }

  closeModal() {
    this.selectedDate = '';
    this.selectedDuration = '';
    this.selectedSlot = '';
    this.selectedTime = '';
    this.openBookingModal = false;
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

  // Function to format time to HH:mm format
  private timeFormat(timeString: string): string {
    // Split the time string into hours, minutes, and AM/PM
    const timeParts = timeString.split(':');
    let hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1].split(' ')[0], 10);
    const period = timeParts[1].split(' ')[1];

    // Adjust hours based on AM/PM
    if (period === 'AM' && hours === 12) {
      hours = 0;
    } else if (period === 'PM' && hours < 12) {
      hours += 12;
    }

    // Format hours and minutes to HH:mm format
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    // Return formatted time
    return `${formattedHours}:${formattedMinutes}`;
  }

  // Method to close the booking success modal
  closeBookingSuccessModal() {
    this.bookingSuccessModalVisible = false;
  }

  // Method to show the booking success modal
  showBookingSuccessModal() {
    this.bookingSuccessModalVisible = true;
  }

  //Get Image of EvStation
  //Get Image
  getProfileImageUrl(filename: string): string {
    return `${this.baseUrl}/user/image/${filename}`;
  }

  getStars(rating: number): number[] {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(i);
    }
    return stars;
  }

  convertTimestampToReadable(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { timeZone: 'UTC' });
  }

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 3;

  // Calculate start and end indices for testimonials based on pagination
  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get endIndex(): number {
    return this.currentPage * this.itemsPerPage;
  }

  // Get paginated testimonials
  get paginatedTestimonials(): any[] {
    return this.ratingdata.slice(this.startIndex, this.endIndex);
  }

  // Handle page change
  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
  }
}
