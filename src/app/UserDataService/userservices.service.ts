import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

declare var Razorpay: any;

@Injectable({
  providedIn: 'root',
})
export class UserservicesService {
  constructor(private http: HttpClient) {}

  /** New Code used of REST Api */
  private baseUrl = environment.BASE_URL;

  //Get All Cities
  getAllCity(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/cities`);
  }

  //Update User Profile Details
  updateUserProfileDetails(userId: string, profileData: any): Observable<any> {
    const url = `${this.baseUrl}/user/${userId}`;
    return this.http.put(url, profileData);
  }

  // Get All Evstations
  getAllEvStations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/user/evstations/all`);
  }

  //Get station by userid
  getEvStationByUserId(userid: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user/evstation/${userid}`);
  }

  //Check Slot Availability
  checkAvailability(data: any) {
    return this.http.post<any>(`${this.baseUrl}/user/checkAvailability`, data);
  }

  //Check Slot Availability using date slo time and station id

  checkSlotAvailability(userId: string, requestData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(
      `${this.baseUrl}/user/checkAvailability/${userId}`,
      requestData,
      { headers: headers }
    );
  }

  //Make Payment
  initiatePayment(formData: any) {
    this.http.post<any>(`${this.baseUrl}/user/payments`, formData).subscribe(
      (res) => {
        console.log(res);
        if (res.success) {
          const options = {
            key: res.key_id,
            amount: res.amount,
            currency: 'INR',
            name: res.product_name,
            description: res.description,
            image: 'https://cdn-icons-png.flaticon.com/512/9922/9922081.png',
            order_id: res.order_id,
            prefill: {
              contact: res.contact,
              name: res.name,
              email: res.email,
            },
            notes: {
              description: res.description,
            },
            theme: {
              color: '#22C55E',
            },
            handler: (response: any) => {
              // Handle payment response here
              this.savePaymentDetails(res.order_id, response, res);
            },
          };

          const razorpayObject = new Razorpay(options);
          razorpayObject.open();
        } else {
          alert(res.msg);
          // Handle error from server
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  savePaymentDetails(orderId: string, response: any, res: any) {
    this.http.get<any>(`${this.baseUrl}/user/payments/${orderId}`).subscribe(
      (paymentRes) => {
        console.log('Payment details:', paymentRes);
        if (paymentRes) {
          const payment = paymentRes.payments[0]; // Get the first payment object
          console.log('Payment details:', payment);
          const payData = {
            userId: res.userId,
            evid: res.evid,
            stationId: res.stationid,
            bookingSlot: res.bookingSlot,
            timeForBooked: res.timeForBooked,
            totalHoursEvBooking: res.totalHoursEvBooking,
            bookedForDate: res.bookForDate,
            totalPayable: this.formatCurrency(res.amount),
            bookingStatus: 'booked',
            remark: 'booked',
            visitingStatus: 'Not Visited',
            bookingRefId: res.order_id,
            paymentDetails: {
              transactionid: payment.id,
              paymentType: payment.method,
              paymentStatus: payment.status === 'captured',
              amount: this.formatCurrency(payment.amount),
              createdDate: payment.created_at,
            },
          };
          console.log('Payment Data', payData);
          //save that booking
          this.saveBooking(payData, res);
        }
      },
      (error) => {
        console.error('Error fetching payment details:', error);
      }
    );
  }

  //save booking data in [booking] table
  saveBooking(bookingData: any, response: any) {
    this.http
      .post<any>(`${this.baseUrl}/user/savebooking`, bookingData)
      .subscribe(
        (res) => {
          this.sendInvoiceToUser(bookingData.bookingRefId, response.email);
          console.log('Booking saved successfully:', res);
          alert('Booking and ' + res.message);
        },
        (error) => {
          console.error('Error saving booking:', error);
          // Handle error response if needed
          alert(error.error.error);
        }
      );
  }

  //send Invoice to user
  sendInvoiceToUser(bookingRefId: string, response: any) {
    this.http
      .get<any>(`${this.baseUrl}/user/bookings/bid/${bookingRefId}`, {})
      .subscribe(
        (res) => {
          this.sendInvoiceToUserEmail(res, response);
          console.log('Get Booking data', response);
        },
        (error) => {
          alert('Failed to send invoice: ' + error.error.error);
        }
      );
  }

  //Send Invoice to User
  sendInvoiceToUserEmail(bookingDetails: any, email: string) {
    bookingDetails.email = email;

    console.log(bookingDetails, email);
    this.http
      .post<any>(
        `${this.baseUrl}/user/invoice/sendinvoice/${bookingDetails.userId}`,
        { bookingDetails }
      )
      .subscribe(
        (res) => {
          alert(res.message);
        },
        (error) => {
          alert('Failed to send invoice: ' + error.error.error);
        }
      );
  }

  // Get Booking data by userid
  getBookingByUserId(userid: string): Observable<any> {
    const url = `${this.baseUrl}/user/bookings/u/${userid}`;
    return this.http.get<any>(url);
  }

  //Get rating by ratingId by orderId
  getRatingByOrderId(orderId: string): Observable<any> {
    const url = `${this.baseUrl}/user/ratings/get/single/${orderId}`;
    return this.http.get<any>(url);
  }

  //Get all rating by userid
  getAllRatingsByUserid(userid: string): Observable<any> {
    const url = `${this.baseUrl}/user/ratings/get/all/${userid}`;
    return this.http.get<any>(url);
  }

  getRatingsOfStation(stationid: string): Observable<any> {
    const url = `${this.baseUrl}/user/ratings/get/${stationid}`;
    return this.http.get<any>(url);
  }

  // Save rating
  saveRating(ratingData: any): Observable<any> {
    const url = `${this.baseUrl}/user/ratings/save`;
    return this.http.post<any>(url, ratingData);
  }

  // Update rating
  updateRating(ratingData: any): Observable<any> {
    const url = `${this.baseUrl}/user/ratings/updateRating`;
    return this.http.put<any>(url, ratingData);
  }

  //Get Payment Data
  getPaymentDataByOrderId(orderid: string): Observable<any> {
    const url = `${this.baseUrl}/user/payments/${orderid}`;
    return this.http.get<any>(url);
  }

  //Format amount
  formatCurrency(value: number): number {
    // Divide by 100 to get the rupees
    const rupees = value / 100;

    // Return the formatted value with two decimal places
    return parseFloat(rupees.toFixed(2));
  }

  // Forgot Password Email
  forgotPassword(email: string): Observable<any> {
    const url = `${this.baseUrl}/user/forgot-password`;
    return this.http.post<any>(url, { email });
  }

  // Get Chart Booking Data
  getChartBookingData(userid: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/user/chart/${userid}/getbooking`
    );
  }

  //Get Chart Payment Data
  getChartPaymentData(userid: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/user/chart/${userid}/getpayment`
    );
  }

  //Get Counting Booking data

  getCountDatat(userid: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/user/chart/${userid}/getcount`
    );
  }

  // Get Notitification by userid
  getNotificationById(userid: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/user/notifications/${userid}`);
  }

  //send emaul contact us
  sendEmail(contactdata: any): Observable<any> {
    const url = `${this.baseUrl}/user/contact`;
    return this.http.post<any>(url, contactdata);
  }
}
