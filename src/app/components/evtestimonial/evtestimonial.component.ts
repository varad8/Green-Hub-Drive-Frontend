import { Component } from '@angular/core';

@Component({
  selector: 'app-evtestimonial',
  templateUrl: './evtestimonial.component.html',
  styleUrl: './evtestimonial.component.css',
})
export class EvtestimonialComponent {
  testimonials = [
    {
      text: 'When our designs need an expert opinion or approval, I know I can rely on your agency. Thank you for all your help - I will be recommending you to everyone.',
      name: 'Tom Koch',
      role: 'Developer',
      image: 'https://i.ibb.co/ZgF5Zzz/avatar-1.png',
    },
    {
      text: 'When our designs need an expert opinion or approval, I know I can rely on your agency. Thank you for all your help - I will be recommending you to everyone.',
      name: 'Alan Max',
      role: 'Designer',
      image: 'https://i.ibb.co/8BLjmqz/avatar-2.png',
    },
    {
      text: 'When our designs need an expert opinion or approval, I know I can rely on your agency. Thank you for all your help - I will be recommending you to everyone.',
      name: 'Kera Joo',
      role: 'Support',
      image: 'https://i.ibb.co/y0KCX7p/avatar-3.png',
    },
    {
      text: 'When our designs need an expert opinion or approval, I know I can rely on your agency. Thank you for all your help - I will be recommending you to everyone.',
      name: 'Kera Joo',
      role: 'Support',
      image: 'https://i.ibb.co/y0KCX7p/avatar-3.png',
    },
  ];

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
    return this.testimonials.slice(this.startIndex, this.endIndex);
  }

  // Handle page change
  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
  }
}
