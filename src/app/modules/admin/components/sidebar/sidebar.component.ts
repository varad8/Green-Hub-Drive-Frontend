import {
  Component,
  HostBinding,
  Inject,
  effect,
  signal,
  Renderer2,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  isSlideBarOpen = false;
  isMobileDevice: boolean = false;

  darkMode = signal<boolean>(false);

  @HostBinding('class.dark') get mode() {
    return this.darkMode();
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private breakpointObserver: BreakpointObserver
  ) {
    this.isSlideBarOpen = this.isMobileDevice;
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

  toggleSideBar() {
    this.isSlideBarOpen = !this.isSlideBarOpen;
    this.updateSidebarVisibility();
  }

  updateSidebarVisibility() {
    const sidebar = this.document.getElementById('sidebar');

    if (this.isMobileDevice && !this.isSlideBarOpen) {
      this.renderer.addClass(
        sidebar,
        'xl:-translate-x-full lg:-translate-x-full'
      );
    } else {
      this.renderer.removeClass(
        sidebar,
        'xl:-translate-x-full lg:-translate-x-full'
      );
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

  // Updating mobile status
  private updateMobileStatus() {
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe((result) => {
        this.isMobileDevice = result.matches;
        this.updateSidebarVisibility();
        console.log('Is Mobile Device:', this.isMobileDevice);
      });
  }

  toggleClose() {
    this.isSlideBarOpen = false;
    this.updateSidebarVisibility();
  }
}
