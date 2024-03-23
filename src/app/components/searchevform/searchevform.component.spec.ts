import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchevformComponent } from './searchevform.component';

describe('SearchevformComponent', () => {
  let component: SearchevformComponent;
  let fixture: ComponentFixture<SearchevformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchevformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchevformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
