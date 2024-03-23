import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SevstationsComponent } from './sevstations.component';

describe('SevstationsComponent', () => {
  let component: SevstationsComponent;
  let fixture: ComponentFixture<SevstationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SevstationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SevstationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
