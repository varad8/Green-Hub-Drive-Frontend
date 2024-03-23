import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import {
  Component,
  HostBinding,
  HostListener,
  Inject,
  Renderer2,
  effect,
  signal,
} from '@angular/core';
import { AuthService } from '../../../../shared/auth.service';
import { AdminserviceService } from '../../../../EvDataService/adminservice.service';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  private baseUrl = environment.BASE_URL;
  evAdminProfile: any | undefined;
  isMobile: boolean = false;
  isSidebarOpen: boolean = false;

  darkMode = signal<boolean>(false);

  @HostBinding('class.dark') get mode() {
    return this.darkMode();
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private adminService: AdminserviceService
  ) {
    // Check initial screen size
    this.checkScreenSize();
    const localStorage = this.document.defaultView?.localStorage;

    if (localStorage) {
      this.darkMode.set(
        JSON.parse(localStorage.getItem('darkMode') ?? 'false')
      );

      effect(() => {
        localStorage.setItem('darkMode', JSON.stringify(this.darkMode()));
        this.updateBodyClass(); // Update body class when dark mode changes
      });
    }
  }

  // Updating dark mode
  private updateBodyClass() {
    const body = this.document.body;

    if (this.darkMode()) {
      this.renderer.addClass(body, 'dark');
    } else {
      this.renderer.removeClass(body, 'dark');
    }
  }

  logOut() {
    this.authService.logOutEvAdmin();
  }

  ngOnInit() {
    // Fetch EvAdminProfile data
    const sessionUser = this.authService.getEvAdminSession();
    if (sessionUser) {
      this.authService.getAdminProfileUsingId(sessionUser.userid).subscribe(
        (data) => {
          this.evAdminProfile = data[0];
        },
        (error) => {
          console.error('Error fetching user data:', error);
          // Handle error
        }
      );
    }
  }

  // Listen to window resize events
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Check screen size on resize
    this.checkScreenSize();
  }

  // Method to check screen size and set isMobile accordingly
  checkScreenSize() {
    this.isMobile = window.innerWidth < 768; // Adjust this value as per your mobile breakpoint
    // Close the sidebar by default on mobile devices
    if (this.isMobile) {
      this.isSidebarOpen = false;
    }
  }

  // Method to toggle the sidebar
  toggleSidebar() {
    if (this.isMobile) {
      // If mobile, toggle the sidebar open/close
      this.isSidebarOpen = !this.isSidebarOpen;
    }
  }

  // Method to close the sidebar
  toggleClose() {
    if (this.isMobile) {
      this.isSidebarOpen = false;
    }
  }

  //Get Image
  getProfileImageUrl(filename: string): string {
    return `${this.baseUrl}/admin/image/${filename}`;
  }
}
