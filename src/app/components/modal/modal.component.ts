import { HttpClient } from '@angular/common/http';
import { Component, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  enteredCardNumber: string = '';
  enteredExp: string = '';
  enteredCvv: number = null;
  isCardNumberValid: boolean = false;
  isMonthYearValid: boolean = false;
  isCVCValid: boolean = false;
  isLoading: boolean = false;
  paymentSuccess: boolean = false;
  isModalOpen: boolean = false;

  cards: any[] = [
    {
      number: '4141 4141 4141 4141',
      image: 'https://cdn-icons-png.flaticon.com/512/196/196578.png',
      cvv: 414,
      exp: '12/26',
    },
    {
      number: '4242 4242 4242 4242',
      image: 'https://cdn-icons-png.flaticon.com/512/196/196578.png',
      cvv: 424,
      exp: '12/26',
    },
    {
      number: '4343 4343 4343 4343',
      image: 'https://cdn-icons-png.flaticon.com/512/196/196578.png',
      cvv: 434,
      exp: '12/26',
    },
    {
      number: '4444 4444 4444 4444',
      image: 'https://cdn-icons-png.flaticon.com/512/196/196578.png',
      cvv: 444,
      exp: '12/26',
    },
    {
      number: '4545 4545 4545 4545',
      image: 'https://cdn-icons-png.flaticon.com/512/196/196578.png',
      cvv: 454,
      exp: '12/26',
    },
    {
      number: '4646 4646 4646 4646',
      image: 'https://cdn-icons-png.flaticon.com/512/196/196578.png',
      cvv: 464,
      exp: '12/26',
    },
    {
      number: '4747 4747 4747 4747',
      image: 'https://cdn-icons-png.flaticon.com/512/196/196578.png',
      cvv: 474,
      exp: '12/26',
    },
    {
      number: '4848 4848 4848 4848',
      image: 'https://cdn-icons-png.flaticon.com/512/196/196578.png',
      cvv: 484,
      exp: '12/26',
    },
    {
      number: '4949 4949 4949 4949',
      image: 'https://cdn-icons-png.flaticon.com/512/196/196578.png',
      cvv: 494,
      exp: '12/26',
    },
    {
      number: '5050 5050 5050 5050',
      image: 'https://cdn-icons-png.flaticon.com/512/14062/14062982.png',
      cvv: 505,
      exp: '12/26',
    },

    {
      number: '5050 5050 5050 5050',
      image: 'https://cdn-icons-png.flaticon.com/512/14062/14062982.png',
      cvv: 505,
      exp: '12/26',
    },

    {
      number: '5151 5151 5151 5151',
      image: 'https://cdn-icons-png.flaticon.com/512/14062/14062982.png',
      cvv: 515,
      exp: '12/26',
    },
    {
      number: '5252 5252 5252 5252',
      image: 'https://cdn-icons-png.flaticon.com/512/14062/14062982.png',
      cvv: 525,
      exp: '12/26',
    },
    {
      number: '5353 5353 5353 5353',
      image: 'https://cdn-icons-png.flaticon.com/512/14062/14062982.png',
      cvv: 535,
      exp: '12/26',
    },
    {
      number: '5454 5454 5454 5454',
      image: 'https://cdn-icons-png.flaticon.com/512/14062/14062982.png',
      cvv: 545,
      exp: '12/26',
    },
    {
      number: '5555 5555 5555 5555',
      image: 'https://cdn-icons-png.flaticon.com/512/14062/14062982.png',
      cvv: 555,
      exp: '12/26',
    },
    {
      number: '5656 5656 5656 5656',
      image: 'https://cdn-icons-png.flaticon.com/512/14062/14062982.png',
      cvv: 565,
      exp: '12/26',
    },
    {
      number: '5757 5757 5757 5757',
      image: 'https://cdn-icons-png.flaticon.com/512/14062/14062982.png',
      cvv: 575,
      exp: '12/26',
    },
    {
      number: '5858 5858 5858 5858',
      image: 'https://cdn-icons-png.flaticon.com/512/14062/14062982.png',
      cvv: 585,
      exp: '12/26',
    },
    {
      number: '5959 5959 5959 5959',
      image: 'https://cdn-icons-png.flaticon.com/512/14062/14062982.png',
      cvv: 595,
      exp: '12/26',
    },
    {
      number: '6060 6060 6060 6060',
      image: 'https://cdn-icons-png.flaticon.com/512/14062/14062982.png',
      cvv: 606,
      exp: '12/26',
    },
  ];

  countries: any[] = [];
  selectedCountry: any = {};

  constructor(private http: HttpClient, private zone: NgZone) {}

  ngOnInit(): void {
    this.getCountries().subscribe(
      (data: any) => {
        this.countries = data;
      },
      (error: any) => {
        console.error('Error fetching countries:', error);
      }
    );
  }

  getCountries(): Observable<any[]> {
    const apiUrl = 'https://mocki.io/v1/db2533fd-fc54-4a1d-a4ba-542b83a6c0d3';
    return this.http.get<any[]>(apiUrl);
  }

  onCountrySelected(event: Event): void {
    const countryCode = (event.target as HTMLSelectElement).value;
    this.selectedCountry =
      this.countries.find((country) => country.code === countryCode) || {};
  }

  getCardImage(): string {
    const matchedCard = this.cards.find(
      (card) =>
        card.number.replace(/\s/g, '') ===
        this.enteredCardNumber.replace(/\s/g, '')
    );

    return matchedCard ? matchedCard.image : '../../../assets/cardgrey.png';
  }

  onCardNumberInput(): void {
    this.enteredCardNumber = this.enteredCardNumber.replace(/\D/g, '');

    this.enteredCvv = null;
    this.enteredExp = '';
    this.isCVCValid = false;
    this.isMonthYearValid = false;

    // Add space after every 4 digits
    this.enteredCardNumber = this.enteredCardNumber.replace(/(\d{4})/g, '$1 ');

    // Trim any extra spaces at the end
    this.enteredCardNumber = this.enteredCardNumber.trim();

    // Limit the length to 19 characters (16 digits + 3 spaces)
    if (this.enteredCardNumber.length > 19) {
      this.enteredCardNumber = this.enteredCardNumber.slice(0, 19);
    }

    // Validate the card number
    this.isCardNumberValid = this.validateCardNumber(this.enteredCardNumber);
  }

  validateCardNumber(cardNumber: string): boolean {
    return this.cards.some(
      (card) => card.number.replace(/\s/g, '') === cardNumber.replace(/\s/g, '')
    );
  }

  onMonthYearInput(event: Event): void {
    // Get the input value
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove non-digit characters
    value = value.replace(/\D/g, '');

    // Add a slash between MM and YY if not already there
    if (value.length > 2 && value.indexOf('/') === -1) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }

    // Set the formatted value back to the input
    input.value = value;

    // Update the ngModel property
    this.enteredExp = value;
    this.isMonthYearValid = this.validateExpiry(this.enteredExp);
  }

  validateExpiry(enteredExp: string): boolean {
    return this.cards.some((card) => {
      return (
        card.number.replace(/\s/g, '') ===
          this.enteredCardNumber.replace(/\s/g, '') && card.exp === enteredExp
      );
    });
  }

  OnCvvInput(): void {
    this.isCVCValid = this.validateCvv(this.enteredCvv);
    console.log(this.isCVCValid);
  }

  validateCvv(enteredCvv: number): boolean {
    return this.cards.some((card) => {
      return (
        card.number.replace(/\s/g, '') ===
          this.enteredCardNumber.replace(/\s/g, '') && card.cvv === enteredCvv
      );
    });
  }

  payAmount(): void {
    this.zone.run(() => {
      this.isLoading = true;
      // Hide Pay and amount content

      setTimeout(() => {
        this.isLoading = false;
        this.paymentSuccess = true;
      }, 2000);
    });
  }

  closeModal() {
    this.isModalOpen = false;
  }
  openModal() {
    this.isModalOpen = true;
  }
}
