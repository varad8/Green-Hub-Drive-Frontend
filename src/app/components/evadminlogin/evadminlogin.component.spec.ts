import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvadminloginComponent } from './evadminlogin.component';

describe('EvadminloginComponent', () => {
  let component: EvadminloginComponent;
  let fixture: ComponentFixture<EvadminloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvadminloginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvadminloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
