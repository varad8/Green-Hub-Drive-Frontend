import { Component } from '@angular/core';
import { AuthService } from '../../../shared/auth.service';
import { UserservicesService } from '../../../UserDataService/userservices.service';

@Component({
  selector: 'app-userfeedback',
  templateUrl: './userfeedback.component.html',
  styleUrls: ['./userfeedback.component.css'],
})
export class UserfeedbackComponent {
  ratingData: any;
  session: any;
  filterRatings: any;
  searchTerm: string = '';
  showModal: boolean = false;
  feedbackMsg: string = '';
  selectedRating: any;

  constructor(
    private auth: AuthService,
    private userservice: UserservicesService
  ) {}

  ngOnInit() {
    this.session = this.auth.getWebUserSession();

    this.userservice.getAllRatingsByUserid(this.session.userid).subscribe(
      (response: any) => {
        if (response.ratings) {
          this.ratingData = response.ratings;
          this.filterRatings = response.ratings;

          console.log('Rating data:', this.ratingData, this.filledStars);
        }
      },
      (error) => {
        console.error('Error fetching rating data:', error);
      }
    );
  }

  onFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;
    // Filter ratings based on selected option
    if (selectedValue === 'all') {
      this.filterRatings = this.ratingData;
    } else if (selectedValue === 'highest') {
      this.filterRatings = this.ratingData.filter(
        (rating) => rating.rating >= 4
      );
    } else if (selectedValue === 'lowest') {
      this.filterRatings = this.ratingData.filter(
        (rating) => rating.rating <= 3
      );
    }
  }

  filterRating(): void {
    // Filter ratings based on search term
    this.filterRatings = this.ratingData.filter((rating) =>
      rating.stationId.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Function to toggle the modal visibility
  toggleModal(ratingdata: any) {
    this.selectedRating = ratingdata;
    this.showModal = !this.showModal;

    // Call the method to get rating data for the selected booking

    this.userservice.getRatingByOrderId(this.selectedRating.orderid).subscribe(
      (response) => {
        console.log('Rating data:', response.rating);
        if (response.rating) {
          this.filledStars = response.rating.rating;
        } else {
          this.filledStars = 0;
        }
        this.feedbackMsg = response.rating.feedbackMsg || '';
        this.updateStars();
      },
      (error) => {
        console.error('Error fetching rating data:', error);
      }
    );
  }

  toggleClose() {
    this.showModal = false;
    this.filledStars = 0;
    this.updateStars();
    this.feedbackMsg = '';
    this.selectedRating = undefined;
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

  rateNow(ratingsdata: any): void {
    // Create a Ratingmodel object with the necessary data
    const ratingData = {
      ratingId: ratingsdata.ratingId,
      stationId: ratingsdata.stationId,
      userId: ratingsdata.userId,
      rating: this.filledStars,
      feedbackMsg: this.feedbackMsg,
      orderId: ratingsdata.orderid,
    };

    // If ratingId exists, call updateRating
    this.userservice.updateRating(ratingData).subscribe(
      (response) => {
        this.toggleClose();
        alert(response.message);
        console.log('Rating updated successfully:', response);
      },
      (error) => {
        alert(error.error.error);
        console.error('Error updating rating:', error);
      }
    );
  }
}
