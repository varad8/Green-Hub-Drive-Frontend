import { Component } from '@angular/core';
import { AuthService } from '../../../../shared/auth.service';
import { AdminserviceService } from '../../../../EvDataService/adminservice.service';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css',
})
export class FeedbackComponent {
  private baseUrl = environment.BASE_URL;
  ratingData: any;
  session: any;
  filterRatings: any;
  searchTerm: string = '';
  showModal: boolean = false;
  feedbackMsg: string = '';
  selectedRating: any;

  constructor(
    private auth: AuthService,
    private adminService: AdminserviceService
  ) {}

  ngOnInit() {
    this.session = this.auth.getEvAdminSession();

    this.adminService.getAllRatingByStationId(this.session.userid).subscribe(
      (response: any) => {
        if (response.ratings) {
          this.ratingData = response.ratings;

          // Fetch user profile data for each rating
          this.ratingData.forEach((rating: any) => {
            this.auth.getUserProfileUsingID(rating.userId).subscribe(
              (data) => {
                rating.userProfile = data.profile;
              },
              (error) => {
                console.error('Error fetching user profile data:', error);
              }
            );
          });

          this.filterRatings = this.ratingData;

          console.log(this.filterRatings);
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

  //Get Image
  getProfileImageUrl(filename: string): string {
    return `${this.baseUrl}/admin/image/${filename}`;
  }
}
