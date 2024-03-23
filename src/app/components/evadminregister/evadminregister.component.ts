import { Component } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evadminregister',
  templateUrl: './evadminregister.component.html',
  styleUrl: './evadminregister.component.css',
})
export class EvadminregisterComponent {
  email: string = '';
  password: string = '';
  cpassword: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  evregister() {
    this.auth
      .registerEvAdmin(this.email, this.password, this.cpassword)
      .subscribe(
        (response) => {
          console.log('Registration successful', response);
          alert(response.message);
          // Navigate to the login page
          this.router.navigate(['login/evadmin']);
        },
        (error) => {
          console.error('Registration failed', error.error);
          alert(error.error.error);
          // Handle error, e.g., display an error message
        }
      );
  }
}
