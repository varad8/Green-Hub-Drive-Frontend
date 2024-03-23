import { Component } from '@angular/core';
import { UserservicesService } from '../../UserDataService/userservices.service';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrl: './contactus.component.css',
})
export class ContactusComponent {
  username: string;
  mobileno: string;
  email: string;
  message: string;

  constructor(private userservice: UserservicesService) {}

  sendMessage() {
    const emaildata = {
      username: this.username,
      mobileno: this.mobileno,
      email: this.email,
      message: this.message,
    };

    this.userservice.sendEmail(emaildata).subscribe(
      (response) => {
        alert(response.message);
      },
      (error) => {
        console.error('Registration failed', error.error);
        alert(error.error.error);
      }
    );
  }
}
