import { Component, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { API_BASE_URL, Auth0Config, auth0Config } from './app.config';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'roomie-buddy-front';

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
}
