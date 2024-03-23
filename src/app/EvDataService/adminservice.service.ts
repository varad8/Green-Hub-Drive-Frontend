import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AdminserviceService {
  private baseUrl = environment.BASE_URL;
  constructor(private http: HttpClient) {}

  //Update Admin Profile Details
  updateEvAdminProfileFields(
    userId: string,
    fieldsToUpdate: any
  ): Observable<any> {
    const url = `${this.baseUrl}/admin/${userId}`;
    return this.http.put(url, fieldsToUpdate);
  }

  //Update Ev Details
  updateEvDetails(userId: string, evDetailsData: any): Observable<any> {
    const url = `${this.baseUrl}/admin/evdetails/${userId}`;
    return this.http.put(url, evDetailsData);
  }

  //Update Admin Profile Pic Profile Image
  updateAdminProfilePic(userId: string, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    return this.http.post<any>(
      `${this.baseUrl}/admin/upload/${userId}`,
      formData,
      {
        headers: headers,
      }
    );
  }

  //Update Cover Image of Ev Admin
  updateCoverImage(userId: string, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    return this.http.post<any>(
      `${this.baseUrl}/admin/uploadImageUrl/${userId}`,
      formData,
      {
        headers: headers,
      }
    );
  }

  //Get Booking Data by stationid
  getBookingDataByStationId(userid: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/admin/booking/${userid}`);
  }

  //update booking status
  updateBookingStatusByOrderId(orderid: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/admin/booking/${orderid}`, {});
  }

  //Get Ratings
  getAllRatingByStationId(stationId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/admin/ratings/${stationId}`);
  }

  //Send Notification
  sendNotificationToUser(
    userid: string,
    stationuserid: string,
    notificationTitle: string,
    notificationMessage: string
  ): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/admin/sendnotification/${userid}`,
      { stationuserid, notificationTitle, notificationMessage }
    );
  }

  //Get Notification by userid
  getNotificationByEvUserId(userid: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/admin/notifications/${userid}`);
  }
  //Get Notification By StationId and notification id
  getNotificationByStationNNotId(
    notificationid: string,
    stationid: string
  ): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/admin/notifications/${stationid}/${notificationid}`
    );
  }

  //Update Notification By StationId and Notification Id
  updateNotification(notificationdata: any): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/admin/notification/${notificationdata.id}/${notificationdata.stationuserid}`,
      notificationdata
    );
  }

  // Get Chart Booking Data
  getChartBookingData(userid: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/admin/chart/${userid}/getbooking`
    );
  }

  //Get Chart Payment Data
  getChartPaymentData(userid: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/admin/chart/${userid}/getpayment`
    );
  }

  getCountDatat(userid: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/admin/chart/${userid}/getcount`
    );
  }

  // Forgot Password Email
  forgotPassword(email: string): Observable<any> {
    const url = `${this.baseUrl}/admin/forgot-password`;
    return this.http.post<any>(url, { email });
  }

  //Get All Cities
  getAllCity(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/cities`);
  }

  /******************************************************************* */
}
