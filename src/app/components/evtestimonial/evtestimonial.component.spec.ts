import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvtestimonialComponent } from './evtestimonial.component';

describe('EvtestimonialComponent', () => {
  let component: EvtestimonialComponent;
  let fixture: ComponentFixture<EvtestimonialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvtestimonialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvtestimonialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
