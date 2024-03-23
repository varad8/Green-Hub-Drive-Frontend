import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../shared/auth.service';
import { AdminserviceService } from '../../../../EvDataService/adminservice.service';
import { environment } from '../../../../../environments/environment.development';
import { UserservicesService } from '../../../../UserDataService/userservices.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-bookingev',
  templateUrl: './bookingev.component.html',
  styleUrl: './bookingev.component.css',
})
export class BookingevComponent {
  private baseUrl = environment.BASE_URL;
  bookings: any;
  sid: string | undefined;
  profiles: any;
  userProfiles: any;
  filteredBookings: any;
  filterType: string = 'All';
  searchTerm: string = '';
  filterDate: string = '';
  mobile: string = '';
  session: any;
  showModal: boolean = false;
  selectedBooking: any;
  feedbackMsg: string = '';
  selectedratingdata: any;
  paymentData: any;
  isPaymentModal: boolean = false;
  isProfileModal: boolean = false;
  selectedProfile: any;

  constructor(
    private evdata: UserservicesService,
    private evowner: AdminserviceService,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    //Getting All profiles data
    this.evdata.getAllEvStations().subscribe(
      (profiles) => {
        this.profiles = profiles;
      },
      (error) => {
        console.error('Error getting profiles:', error);
      }
    );

    //Getting QueryParams from URL
    this.route.queryParams.subscribe((params) => {
      this.sid = params['sid'];
      this.getBookings(this.sid);
    });
  }

  //Get Booking
  getBookings(userid: string) {
    this.evowner.getBookingDataByStationId(userid).subscribe(
      (bookings: any) => {
        this.bookings = bookings;
        this.userProfiles = []; // Initialize userProfiles array

        const profileObservables = this.bookings
          .filter((booking: any) => !!booking.userId)
          .map((booking: any) =>
            this.auth.getUserProfileUsingID(booking.userId)
          );

        forkJoin(profileObservables).subscribe(
          (profiles: any[]) => {
            this.userProfiles = profiles.map((data) => data.profile);
            this.filteredBookings = this.bookings;
            this.filterBookings();
          },
          (error) => {
            console.error('Error fetching user data:', error);
            // Handle error
          }
        );
      },
      (error) => {
        console.error('Error fetching booking data:', error);
        // Handle error
      }
    );
  }

  filterBookings(): void {
    let tempBookings = [...this.bookings];

    if (this.filterType === 'Today') {
      const currentDate = new Date();
      tempBookings = tempBookings.filter(
        (booking) =>
          new Date(booking.bookedForDate).toDateString() ===
          currentDate.toDateString()
      );
    } else if (this.filterType === 'Upcoming') {
      const currentDate = new Date();
      tempBookings = tempBookings.filter(
        (booking) => new Date(booking.bookedForDate) > currentDate
      );
    } else if (this.filterType === 'Yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      tempBookings = tempBookings.filter(
        (booking) =>
          new Date(booking.bookedForDate).toDateString() ===
          yesterday.toDateString()
      );
    } else if (this.filterType === 'Visited') {
      tempBookings = tempBookings.filter(
        (booking) => booking.visitingStatus === 'Visited'
      );
    } else if (this.filterType === 'NotVisited') {
      tempBookings = tempBookings.filter(
        (booking) => booking.visitingStatus === 'Not Visited'
      );
    }

    if (this.searchTerm.trim() !== '') {
      tempBookings = tempBookings.filter((booking) =>
        this.userProfiles.some((userProfile) =>
          userProfile.email
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
        )
      );
    }

    if (this.mobile.trim() !== '') {
      tempBookings = tempBookings.filter((booking) =>
        this.userProfiles.some((userProfile) =>
          userProfile.mobile.toLowerCase().includes(this.mobile.toLowerCase())
        )
      );
    }

    if (this.filterDate) {
      tempBookings = tempBookings.filter(
        (booking) =>
          new Date(booking.bookedForDate).toDateString() ===
          new Date(this.filterDate).toDateString()
      );
    }

    // Sort bookings
    tempBookings = tempBookings.sort((a, b) => {
      const currentDate = new Date();
      const aBookingDate = new Date(a.bookedForDate);
      const bBookingDate = new Date(b.bookedForDate);

      if (a.visitingStatus === 'Visited' && b.visitingStatus !== 'Visited') {
        return 1; // Move 'visited' records to the end
      } else if (
        a.visitingStatus !== 'Visited' &&
        b.visitingStatus === 'Visited'
      ) {
        return -1; // Keep 'not visited' records before 'visited' records
      } else if (aBookingDate < currentDate && bBookingDate < currentDate) {
        // If both booking dates are in the past, sort by booking date in ascending order
        return aBookingDate.getTime() - bBookingDate.getTime();
      } else if (aBookingDate < currentDate) {
        // If only aBookingDate is in the past, move it to the end
        return 1;
      } else if (bBookingDate < currentDate) {
        // If only bBookingDate is in the past, move it to the end
        return -1;
      } else {
        // Both booking dates are in the future, sort by booking date in ascending order
        return aBookingDate.getTime() - bBookingDate.getTime();
      }
    });

    this.filteredBookings = tempBookings;
  }

  //calculating the end time
  calculateExpectedEndTime(startTime: string, durationHours: string): string {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const durationHoursNumber = parseFloat(durationHours);
    let endHour = startHour + Math.floor(durationHoursNumber);
    let endMinute =
      startMinute +
      Math.round((durationHoursNumber - Math.floor(durationHoursNumber)) * 60);
    if (endMinute >= 60) {
      endHour += Math.floor(endMinute / 60);
      endMinute %= 60;
    }
    if (endHour >= 24) {
      endHour %= 24;
    }
    const endHourString = String(endHour).padStart(2, '0');
    const endMinuteString = String(endMinute).padStart(2, '0');

    return `${endHourString}:${endMinuteString}`;
  }

  isFutureTime(bookedForDate: string, endTime: string): boolean {
    const currentDate = new Date();
    const bookingDate = new Date(bookedForDate);

    const [hours, minutes] = endTime.split(':').map(Number);
    bookingDate.setHours(hours, minutes, 0);

    return bookingDate.getTime() > currentDate.getTime();
  }

  // Function to toggle the modal visibility
  toggleModal(dataofbooking: any) {
    this.selectedBooking = dataofbooking;
    this.showModal = !this.showModal;
  }

  toggleClose() {
    this.showModal = false;
    this.feedbackMsg = '';
    this.selectedBooking = undefined;
    this.showModal = false;
  }

  openPaymentModal() {
    this.isPaymentModal = true;
  }
  closeModal() {
    this.paymentData = null;
    this.isPaymentModal = false;
  }

  //View Payment Details
  paymentDetails(orderid: string) {
    this.evdata.getPaymentDataByOrderId(orderid).subscribe(
      (response: any) => {
        this.paymentData = response.payments[0];
        console.log(response.payments[0]);
        this.openPaymentModal();
      },
      (error) => {
        console.error('Error fetching booking data:', error);
        // Handle error
      }
    );
  }

  //Download Invoice
  downloadInvoice(orderid: string, useremail: string) {
    this.evdata.sendInvoiceToUser(orderid, useremail);
  }

  //Format amount
  formatCurrency(value: number): string {
    // Divide by 100 to get the rupees
    const rupees = value / 100;

    // Convert rupees to a string with two decimal places
    const formattedValue = rupees.toFixed(2);

    // Return the formatted value
    return formattedValue;
  }

  //Update to Visiting status
  updateStatusToVisited(bookingData: any) {
    this.evowner
      .updateBookingStatusByOrderId(bookingData.bookingRefId)
      .subscribe(
        (response) => {
          alert(response.message);
        },
        (error) => {
          alert(error.error.error);
        }
      );
  }

  viewUserProfile(userProfile: any) {
    this.selectedProfile = userProfile;
    this.isProfileModal = true;
  }

  closeProfileModal() {
    this.isProfileModal = false;
  }

  //Get Image
  getProfileImageUrl(filename: string): string {
    return `${this.baseUrl}/admin/image/${filename}`;
  }

  convertTimestampToReadable(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { timeZone: 'UTC' });
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
}
