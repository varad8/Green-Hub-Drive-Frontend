import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvadminregisterComponent } from './evadminregister.component';

describe('EvadminregisterComponent', () => {
  let component: EvadminregisterComponent;
  let fixture: ComponentFixture<EvadminregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvadminregisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvadminregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
