import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule
  ],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {

  constructor(private router: Router) { }

  onGetStarted() {
    // Navigate to the main app or authentication
    console.log('Get started clicked');
  }

  onSignIn() {
    // Handle sign in
    console.log('Sign in clicked');
  }

  onContactSales() {
    // Handle contact sales
    console.log('Contact sales clicked');
  }

  onUpgrade() {
    // Handle upgrade
    console.log('Upgrade clicked');
  }

/*
  constructor(
    public auth: AuthService,
    @Inject(auth0Config) private config: Auth0Config,
    @Inject(API_BASE_URL) private apiBaseUrl: string,
    private http: HttpClient
  ) {
    console.log('auth0Config:', this.config);
    // Initialize Auth0 service
    this.auth.isAuthenticated$.subscribe(async isAuthenticated => {
      console.log('User is authenticated:', isAuthenticated);
      // If authenticated, you can access user information
      if (isAuthenticated) {
        const token = await firstValueFrom(
          this.auth.getAccessTokenSilently({
            authorizationParams: { audience: this.config.audience },
          })
        );
        console.log('Access token:', token);
      }
    });

  }

  userMetadata() {
    this.http.get(`${this.apiBaseUrl}/user-metadata`).subscribe({
      next: (data) => {
        console.log('User metadata:', data);
      },
      error: (error) => {
        console.error('Error fetching user metadata:', error);
      }
    });
  }

  completeProfile() {
    this.http.post(`${this.apiBaseUrl}/complete-profile`, {}).subscribe({
      next: (data) => {
        console.log('Profile completed:', data);
      },
      error: (error) => {
        console.error('Error completing profile:', error);
      }
    });
  }

  uncompleteProfile() {
    this.http.post(`${this.apiBaseUrl}/uncomplete-profile`, {}).subscribe({
      next: (data) => {
        console.log('Profile uncompleted:', data);
      },
      error: (error) => {
        console.error('Error uncompleting profile:', error);
      }
    });
  }
  */

}
