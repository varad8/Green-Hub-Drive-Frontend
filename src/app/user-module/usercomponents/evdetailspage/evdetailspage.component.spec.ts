import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvdetailspageComponent } from './evdetailspage.component';

describe('EvdetailspageComponent', () => {
  let component: EvdetailspageComponent;
  let fixture: ComponentFixture<EvdetailspageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvdetailspageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvdetailspageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
