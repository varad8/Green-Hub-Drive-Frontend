import { Component } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { UserservicesService } from '../../UserDataService/userservices.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  showForgotPasswordModal: boolean = false;
  femail: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private sst: SessionStorageService,
    private userservice: UserservicesService
  ) {}

  userLogin(): void {
    this.auth.loginUser(this.email, this.password).subscribe(
      (response) => {
        console.log('Registration successful', response);
        alert(response.message);

        console.log(response.profile);

        // Save user information in session storage
        this.sst.store('webuser', response.profile);

        // // Navigate to the dashboard
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Registration failed', error.error);
        alert(error.error.error);
        // Handle error, e.g., display an error message
      }
    );
  }

  ngOnInit(): void {
    // Check for an existing session when the component is initialized
    this.auth.checkExistingUserSession();
  }

  //forgot password
  forgotPasswordUsingEmail(): void {
    // Check if the email is not empty and is in a valid format
    this.userservice.forgotPassword(this.femail).subscribe(
      (response) => {
        alert(response.message);
        this.showForgotPasswordModal = false;
        this.femail = '';
        this.router.navigate(['/login/user']);
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
