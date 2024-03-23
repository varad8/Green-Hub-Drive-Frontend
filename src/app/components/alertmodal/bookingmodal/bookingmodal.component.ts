import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-bookingmodal',
  templateUrl: './bookingmodal.component.html',
  styleUrl: './bookingmodal.component.css',
})
export class BookingmodalComponent {
  @Output() closeModalEvent = new EventEmitter<void>();

  // Method to emit close modal event
  closeModal() {
    this.closeModalEvent.emit();
  }
}
