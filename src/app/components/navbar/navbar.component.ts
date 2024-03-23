import {
  Component,
  HostBinding,
  Inject,
  effect,
  signal,
  Renderer2,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from '../../shared/auth.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  darkMode = signal<boolean>(false);
  session: any;
  isOpenMenu: boolean = false;

  @HostBinding('class.dark') get mode() {
    return this.darkMode();
  }

  isNavbarOpen = false;
  isMobileDevice: boolean = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private breakpointObserver: BreakpointObserver,
    private auth: AuthService
  ) {
    const localStorage = this.document.defaultView?.localStorage;

    if (localStorage) {
      this.darkMode.set(
        JSON.parse(localStorage.getItem('darkMode') ?? 'false')
      );

      effect(() => {
        localStorage.setItem('darkMode', JSON.stringify(this.darkMode()));
        this.updateMobileStatus(); // Update mobile status when dark mode changes
        this.updateBodyClass(); // Update body class when dark mode changes
      });
    }
  }

  toggleNav() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  toggleClose() {
    this.isNavbarOpen = false;
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

  // Updating mobile status
  private updateMobileStatus() {
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe((result) => {
        this.isMobileDevice = result.matches;

        // Use isMobileDevice boolean as needed, without modifying body class
        console.log('Is Mobile Device:', this.isMobileDevice);
      });
  }

  ngOnInit(): void {
    // Check for an existing session when the component is initialized
    this.session = this.auth.getWebUserSession();
  }

  toggleMenuOption() {
    if (this.isOpenMenu) {
      this.isOpenMenu = false;
    } else {
      this.isOpenMenu = true;
    }
  }
}
