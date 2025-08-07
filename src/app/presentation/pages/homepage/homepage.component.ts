import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router } from '@angular/router';
import { AuthenticationService } from '@application/use-cases';
import { ThemeService, NavigationService, LoadingService } from '@presentation/shared/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule
  ],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {
  private loadingService = inject(LoadingService);
  theme = inject(ThemeService);
  navigationService = inject(NavigationService);
  private subscription = new Subscription();

  constructor(private router: Router, private auth: AuthenticationService) { }

  ngOnInit() {
    this.subscription.add(
      this.navigationService.scrollToSection$.subscribe(sectionId => {
        this.scrollToSection(sectionId);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onGetStarted() {
    this.auth.login();
  }

  onSignIn() {
    this.auth.login();
  }

  onContactSales() {
    // Handle contact sales
    console.log('Contact sales clicked');
  }

  onUpgrade() {
    // Handle upgrade
    console.log('Upgrade clicked');
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

}
