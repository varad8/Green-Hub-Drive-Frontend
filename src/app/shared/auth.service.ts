import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { Time } from '@angular/common';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private router: Router,
    private sst: SessionStorageService,
    private http: HttpClient
  ) {}

  /***************************[User Authentication]*************************** */
  /** New Code used of REST Api */
  private baseUrl = environment.BASE_URL;

  //register new user using email and password
  registerUser(
    email: string,
    password: string,
    confirmpassword: string
  ): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/user/register`, {
      email,
      password,
      confirmpassword,
    });
  }

  // login to the user account and save session
  loginUser(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/user/login`, {
      email,
      password,
    });
  }

  //Get User Profile using userid [/:userid]
  getUserProfileUsingID(userId: string): Observable<any> {
    const url = `${this.baseUrl}/user/${userId}`;
    return this.http.get<any>(url);
  }

  //Upload Profile Image
  uploadProfileImage(userId: string, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    return this.http.post<any>(
      `${this.baseUrl}/user/upload/${userId}`,
      formData,
      {
        headers: headers,
      }
    );
  }

  //Get User Session
  // Retrieve user session from sessionStorage
  getWebUserSession(): any {
    const userSession = this.sst.retrieve('webuser');
    return userSession || null;
  }

  //Check User Session to check user Logged in or not
  //check that user is already logged in
  checkExistingUserSession(): void {
    // Check if there is an existing session with the evadmin accountType
    const existingSessionUser = this.sst.retrieve('webuser');

    if (existingSessionUser && existingSessionUser.accountType === 'user') {
      // Redirect to dashboard since a valid session is already present
      this.router.navigate(['user']);
    }
  }

  //for authguard user
  checkUserLoggedIn(): boolean {
    // Check if there is an existing session with the admin accountType
    const existingSessionUser = this.sst.retrieve('webuser');
    console.log(existingSessionUser);

    // Return true if there is an existing session with superadmin or admin accountType, otherwise return false
    return !!(
      existingSessionUser && existingSessionUser.accountType === 'user'
    );
  }

  //SignOut User
  logOutUser() {
    this.sst.clear();
    // Redirect to the login page
    this.router.navigate(['login/user']);
  }

  getTestimonials(): Observable<any> {
    const url = `${this.baseUrl}/user/ratings/all`;
    return this.http.get<any>(url);
  }

  /***************************[EV Admin Authentication]*************************** */

  //register new ev admin  using email and password
  registerEvAdmin(
    email: string,
    password: string,
    confirmpassword: string
  ): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/admin/register`, {
      email,
      password,
      confirmpassword,
    });
  }

  // login to the user account and save session
  loginEvAdmin(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/admin/login`, {
      email,
      password,
    });
  }

  //Check EvAdmin Session to check Ev admin Logged in or not
  //check that evadmin is already logged in
  checkinExistingEvAdminSession(): void {
    // Check if there is an existing session with the evadmin accountType
    const existingSessionUser = this.sst.retrieve('evadmin');

    if (existingSessionUser && existingSessionUser.accountType === 'EV Admin') {
      // Redirect to dashboard since a valid session is already present
      this.router.navigate(['admin']);
    }
  }

  //Check ev admin Login
  //for authguard evadmin
  checkEvAdminLoggedIn(): boolean {
    // Check if there is an existing session with the evadmin accountType
    const existingSessionUser = this.sst.retrieve('evadmin');

    // Return true if there is an existing session with evadmin accountType, otherwise return false
    return !!(
      existingSessionUser && existingSessionUser.accountType === 'EV Admin'
    );
  }

  //Get EvAdmin Profile using userid [/:userid]
  getAdminProfileUsingId(userId: string): Observable<any> {
    const url = `${this.baseUrl}/admin/${userId}`;
    return this.http.get<any>(url);
  }

  //Get EvAdmin Session
  // Retrieve evadmin session from sessionStorage
  getEvAdminSession(): any {
    const userSession = this.sst.retrieve('evadmin');
    return userSession || null;
  }

  //signout
  logOutAdmin() {
    // Clear the session storage
    this.sst.clear();

    // Redirect to the login page
    this.router.navigate(['login/admin']);
  }

  logOutEvAdmin() {
    // Clear the session storage
    this.sst.clear();

    // Redirect to the login page
    this.router.navigate(['login/evadmin']);
  }

  /*******************************************************[Super Admin Authentication]***********************************************************/

  adminLogin(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/superadmin/login`, {
      email,
      password,
    });
  }

  //Get Admin Session
  getAdminSession(): any | null {
    const userSession = this.sst.retrieve('admin');
    return userSession || null;
  }

  //for authguard superadmin
  checkSuperAdminLoggedIn(): boolean {
    const existingSessionUser = this.sst.retrieve('admin');
    return !!(
      (existingSessionUser &&
        (existingSessionUser.accountType === 'superadmin' ||
          existingSessionUser.accountType === 'admin')) ||
      existingSessionUser.accountType === 'Owner'
    );
  }

  //Get Admin Profile
  getSuperAdminProfileUsingID(adminId: string): Observable<any> {
    const url = `${this.baseUrl}/superadmin/${adminId}/profile`;
    return this.http.get<any>(url);
  }

  //check that user is already logged in
  checkExistingAdminSession(): void {
    // Check if there is an existing session with the evadmin accountType
    const existingSessionUser = this.sst.retrieve('admin');

    if (
      (existingSessionUser &&
        existingSessionUser.accountType === 'superadmin') ||
      existingSessionUser.accountType == 'admin' ||
      existingSessionUser.accountType === 'Owner'
    ) {
      // Redirect to dashboard since a valid session is already present
      this.router.navigate(['sadmin']);
    } else {
      this.router.navigate(['login/admin']);
    }
  }

  /*******************************************************[End Super Admin]***********************************************************/
}
