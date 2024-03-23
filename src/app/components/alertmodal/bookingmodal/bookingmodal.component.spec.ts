import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingmodalComponent } from './bookingmodal.component';

describe('BookingmodalComponent', () => {
  let component: BookingmodalComponent;
  let fixture: ComponentFixture<BookingmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookingmodalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
