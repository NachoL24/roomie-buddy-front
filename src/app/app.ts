import { Component, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Auth0Config, auth0Config } from './app.config';
import { firstValueFrom } from 'rxjs';

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
    @Inject(auth0Config) private config: Auth0Config
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
}
