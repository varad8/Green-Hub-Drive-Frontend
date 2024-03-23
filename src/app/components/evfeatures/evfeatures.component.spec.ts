import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvfeaturesComponent } from './evfeatures.component';

describe('EvfeaturesComponent', () => {
  let component: EvfeaturesComponent;
  let fixture: ComponentFixture<EvfeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvfeaturesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvfeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
