import { Component } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { SessionStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { AdminserviceService } from '../../EvDataService/adminservice.service';

@Component({
  selector: 'app-evadminlogin',
  templateUrl: './evadminlogin.component.html',
  styleUrl: './evadminlogin.component.css',
})
export class EvadminloginComponent {
  showForgotPasswordModal: boolean = false;
  femail: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private sst: SessionStorageService,
    private evdata: AdminserviceService
  ) {}

  evLogin(): void {
    this.auth.loginEvAdmin(this.email, this.password).subscribe(
      (response) => {
        console.log('Registration successful', response);
        alert(response.message);
        // Save user information in session storage
        this.sst.store('evadmin', response.profile);
        // // Navigate to the dashboard
        this.router.navigate(['/admin']);
      },
      (error) => {
        console.error('Registration failed', error.error);
        alert(error.error.error);
      }
    );
  }

  ngOnInit(): void {
    // Check for an existing session when the component is initialized
    this.auth.checkinExistingEvAdminSession();
  }

  //forgot password
  forgotPasswordUsingEmail(): void {
    console.log(this.femail);
    this.evdata.forgotPassword(this.femail).subscribe(
      (response) => {
        alert(response.message);
        this.showForgotPasswordModal = false;
        this.femail = '';
        this.router.navigate(['/login/evadmin']);
      },
      (error) => {
        alert(error.error.error);
      }
    );
  }

  openForgotPasswordModal() {
    this.showForgotPasswordModal = true;
  }
}
