import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvcardComponent } from './evcard.component';

describe('EvcardComponent', () => {
  let component: EvcardComponent;
  let fixture: ComponentFixture<EvcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvcardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
