import { TestBed } from '@angular/core/testing';
import { SauthGuard } from './sauth.guard';

describe('SauthGuard', () => {
  let guard: SauthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SauthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
