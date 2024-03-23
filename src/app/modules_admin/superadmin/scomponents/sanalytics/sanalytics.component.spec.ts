import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanalyticsComponent } from './sanalytics.component';

describe('SanalyticsComponent', () => {
  let component: SanalyticsComponent;
  let fixture: ComponentFixture<SanalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SanalyticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SanalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
