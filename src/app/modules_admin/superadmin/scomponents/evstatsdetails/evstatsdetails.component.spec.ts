import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvstatsdetailsComponent } from './evstatsdetails.component';

describe('EvstatsdetailsComponent', () => {
  let component: EvstatsdetailsComponent;
  let fixture: ComponentFixture<EvstatsdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvstatsdetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvstatsdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
