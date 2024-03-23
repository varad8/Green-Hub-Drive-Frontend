import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingevComponent } from './bookingev.component';

describe('BookingevComponent', () => {
  let component: BookingevComponent;
  let fixture: ComponentFixture<BookingevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookingevComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
