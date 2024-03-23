import { Component } from '@angular/core';
import { UserservicesService } from '../../../UserDataService/userservices.service';
import { AuthService } from '../../../shared/auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-userbooking',
  templateUrl: './userbooking.component.html',
  styleUrl: './userbooking.component.css',
})
export class UserbookingComponent {
  bookings: any;
  userProfiles: any;
  filteredBookings: any;
  filterType: string = 'All';
  searchTerm: string = '';
  filterDate: string = '';
  stationid: string = '';
  session: any;
  showModal: boolean = false;
  selectedBooking: any;
  feedbackMsg: string = '';
  selectedratingdata: any | undefined;
  paymentData: any;
  isPaymentModal: boolean = false;

  constructor(
    private userservice: UserservicesService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.session = this.auth.getWebUserSession();
    this.getBookings(this.session.userid);
  }

  //Get Booking
  getBookings(userid: string) {
    this.userservice.getBookingByUserId(userid).subscribe(
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

    if (this.filterDate) {
      tempBookings = tempBookings.filter(
        (booking) =>
          new Date(booking.bookedForDate).toDateString() ===
          new Date(this.filterDate).toDateString()
      );
    }

    if (this.stationid.trim() !== '') {
      tempBookings = tempBookings.filter((booking) =>
        booking.stationId.toLowerCase().includes(this.stationid.toLowerCase())
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

    // Call the method to get rating data for the selected booking

    this.userservice.getRatingByOrderId(dataofbooking.bookingRefId).subscribe(
      (response) => {
        console.log('Rating data:', response.rating);
        if (response.rating) {
          this.filledStars = response.rating.rating;
          this.selectedratingdata = response.rating;
          console.log(response.rating.rating);
        } else {
          this.filledStars = 0;
        }
        this.feedbackMsg = response.rating.feedbackMsg || '';
        this.updateStars();
      },
      (error) => {
        this.selectedratingdata = undefined;
        console.error('Error fetching rating data:', error);
      }
    );
  }

  toggleClose() {
    this.showModal = false;
    this.filledStars = 0;
    this.updateStars();
    this.feedbackMsg = '';
    this.selectedBooking = undefined;
    this.showModal = false;
  }

  filledStars: number = 0;
  stars: { class: string }[] = [
    { class: 'w-12 h-12 text-gray-500' },
    { class: 'w-12 h-12 text-gray-500' },
    { class: 'w-12 h-12 text-gray-500' },
    { class: 'w-12 h-12 text-gray-500' },
    { class: 'w-12 h-12 text-gray-500' },
  ];

  rate(index: number): void {
    if (index === this.filledStars - 1) {
      // If the user clicks on the currently filled star, deselect it
      this.filledStars = Math.max(0, this.filledStars - 1); // Ensure it doesn't go below 0
    } else {
      // Otherwise, update the filled stars count
      this.filledStars = Math.min(index + 1, 5); // Ensure it doesn't exceed 5
    }
    this.updateStars();
  }

  updateStars(): void {
    this.stars.forEach((star, i) => {
      star.class =
        i < this.filledStars
          ? 'w-12 h-12 text-yellow-500'
          : 'w-12 h-12 text-gray-500';
    });
  }

  rateNow(bookingData: any): void {
    // Create a Ratingmodel object with the necessary data

    if (this.selectedratingdata != undefined) {
      const ratingData = {
        ratingId: this.selectedratingdata.ratingId,
        stationId: bookingData.stationId,
        userId: bookingData.userId,
        rating: this.filledStars,
        feedbackMsg: this.feedbackMsg,
        orderId: bookingData.bookingRefId,
      };

      // If ratingId exists, call updateRating
      this.userservice.updateRating(ratingData).subscribe(
        (response) => {
          this.toggleClose();
          alert(response.message);
          console.log('Rating updated successfully:', response);
        },
        (error) => {
          console.error('Error updating rating:', error);
        }
      );
    } else {
      const ratingData = {
        stationId: bookingData.stationId,
        userId: bookingData.userId,
        rating: this.filledStars,
        feedbackMsg: this.feedbackMsg,
        orderId: bookingData.bookingRefId,
      };

      // If ratingId doesn't exist, call saveRating
      this.userservice.saveRating(ratingData).subscribe(
        (response) => {
          alert(response.message);
          console.log('Rating saved successfully:', response);
        },
        (error) => {
          alert(error.error.error);
          console.error('Error saving rating:', error);
        }
      );
    }
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
    this.userservice.getPaymentDataByOrderId(orderid).subscribe(
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
  downloadInvoice(orderid: string) {
    this.userservice.sendInvoiceToUser(orderid, this.session.email);
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
}
