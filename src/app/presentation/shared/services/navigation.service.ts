import { inject, Injectable, DestroyRef, signal } from '@angular/core';
import { GlobalUserService } from '@application/index';
import { Subject } from 'rxjs';
import { fromEvent } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private scrollToSectionSubject = new Subject<string>();
  private userService = inject(GlobalUserService);
  private drawerOpen = false;
  private drawerMode = signal<"side" | "over">("side");
  private device = signal<"mobile" | "desktop">("desktop");
  private destroyRef = inject(DestroyRef);
  refreshHousesNeeded = signal(false);

  constructor() {
    const compute = (w: number) => ({
      mode: w < 660 ? "over" as const : "side" as const,
      device: w < 660 ? "mobile" as const : "desktop" as const,
    });

    // Initial state
    const init = compute(window.innerWidth);
    this.drawerMode.set(init.mode);
    this.device.set(init.device);

    // React to window resize
    fromEvent(window, 'resize')
      .pipe(
        map(() => window.innerWidth),
        startWith(window.innerWidth),
        map(compute),
        distinctUntilChanged((a, b) => a.mode === b.mode && a.device === b.device),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ mode, device }) => {
        this.drawerMode.set(mode);
        this.device.set(device);
      });
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

  isMobile() {
    return this.device() === "mobile";
  }

  isDesktop() {
    return this.device() === "desktop";
  }

  closeDrawer() {
    this.drawerOpen = false;
  }

  refreshHouses() {
    this.refreshHousesNeeded.set(true);
  }

  finishRefresh() {
    this.refreshHousesNeeded.set(false);
  }
}
