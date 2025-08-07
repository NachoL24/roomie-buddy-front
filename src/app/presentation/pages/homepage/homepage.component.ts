import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router } from '@angular/router';
import { AuthenticationService } from '@application/use-cases';
import { ThemeService } from '@presentation/shared/services';

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
export class HomepageComponent {

  theme = inject(ThemeService);

  constructor(private router: Router, private auth: AuthenticationService) { }

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

}
