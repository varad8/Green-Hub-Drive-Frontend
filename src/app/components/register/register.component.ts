import { Component } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmpassword: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  // userRegister() {
  //   if (this.email == '') {
  //     alert('Please enter email');
  //     return;
  //   }
  //   if (this.password == '') {
  //     alert('Please enter password');
  //     return;
  //   }
  //   if (this.password.length < 6) {
  //     alert('Password at least six character long');
  //     return;
  //   }

  //   //evlogin method call
  //   this.auth.registerUser(this.email, this.password);
  //   this.email = '';
  //   this.password = '';
  // }

  userRegister(): void {
    this.auth
      .registerUser(this.email, this.password, this.confirmpassword)
      .subscribe(
        (response) => {
          console.log('Registration successful of Ev', response);
          alert(response.message);
          // Navigate to the login page
          this.router.navigate(['login/user']);
        },
        (error) => {
          console.error('Registration failed', error.error);
          alert(error.error.error);
          // Handle error, e.g., display an error message
        }
      );
  }
}
