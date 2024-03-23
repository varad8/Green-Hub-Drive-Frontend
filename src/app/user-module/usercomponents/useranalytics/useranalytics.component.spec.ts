import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseranalyticsComponent } from './useranalytics.component';

describe('UseranalyticsComponent', () => {
  let component: UseranalyticsComponent;
  let fixture: ComponentFixture<UseranalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UseranalyticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UseranalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
