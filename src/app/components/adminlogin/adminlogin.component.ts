import { Component } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { SessionStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrl: './adminlogin.component.css',
})
export class AdminloginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private auth: AuthService,
    private sst: SessionStorageService,
    private router: Router
  ) {}

  adminLogin(): void {
    this.auth.adminLogin(this.email, this.password).subscribe(
      (response) => {
        console.log('Registration successful', response);
        alert(response.message);
        // Save user information in session storage
        this.sst.store('admin', response.profile);
        // // Navigate to the dashboard
        this.router.navigate(['/sadmin']);
      },
      (error) => {
        console.error('Registration failed', error.error);
        alert(error.error.error);
      }
    );
  }

  ngOnInit(): void {
    // Check for an existing session when the component is initialized
    this.auth.checkExistingAdminSession();
  }
}
