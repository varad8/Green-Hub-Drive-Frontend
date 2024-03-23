import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminservicesService {
  constructor(private http: HttpClient) {}

  /** New Code used of REST Api */
  private baseUrl = environment.BASE_URL;

  //Update Admin Profile Details
  updateAdminDetails(adminId: string, profileData: any): Observable<any> {
    const url = `${this.baseUrl}/superadmin/${adminId}/profile/update`;
    return this.http.put(url, profileData);
  }

  //update profile pic of admin
  uploadProfileImage(adminId: string, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    return this.http.put<any>(
      `${this.baseUrl}/superadmin/${adminId}/profilepic/update`,
      formData,
      {
        headers: headers,
      }
    );
  }

  //Get Booking Count Data
  getBookingChartData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/superadmin/chart/booking`);
  }

  //Get Payment Chart Data
  getPaymentChartData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/superadmin/chart/payment`);
  }

  //Get All time booking counts
  getBookingCount(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/superadmin/chart/counts`);
  }

  //Update Account Status -> Approved
  approveEvAdmin(adminId: string, stationId: string): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/superadmin/approve/${adminId}/${stationId}`,
      {}
    );
  }

  //Update Account Status -> Not Approved
  disapproveEvAdmin(adminId: string, stationId: string): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/superadmin/disapprove/${adminId}/${stationId}`,
      {}
    );
  }
}
