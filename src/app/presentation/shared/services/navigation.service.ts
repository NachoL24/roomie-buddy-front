import { HostListener, inject, Injectable, OnInit, signal } from '@angular/core';
import { GlobalUserService } from '@application/index';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NavigationService implements OnInit {
  private scrollToSectionSubject = new Subject<string>();
  private userService = inject(GlobalUserService);
  private drawerOpen = false;
  private drawerMode = signal<"side" | "over">("side");
  private device = signal<"mobile" | "desktop">("desktop");

  ngOnInit() {
    this.drawerMode.set(window.innerWidth < 660 ? "over" : "side");
    this.device.set(window.innerWidth < 660 ? "mobile" : "desktop");
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.drawerMode.set(window.innerWidth < 660 ? "over" : "side");
    this.device.set(window.innerWidth < 660 ? "mobile" : "desktop");
  }

  scrollToSection$ = this.scrollToSectionSubject.asObservable();

  scrollToSection(sectionId: string) {
    this.scrollToSectionSubject.next(sectionId);
  }

  toggleDrawer() {
    this.drawerOpen = !this.drawerOpen;
  }

  isDrawerOpen() {
    if (this.userService.isLoggedIn()) {
      return this.drawerOpen;
    } else {
      this.drawerOpen = false;
      return false;
    }
  }

  getDrawerMode() {
    return this.drawerMode();
  }

  toggleDrawerMode() {
    this.drawerMode.set(this.drawerMode() === "side" ? "over" : "side");
  }
}
