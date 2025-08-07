import { Routes } from '@angular/router';
import { userReadyResolver } from '@presentation/shared/guards/userLoadedResolver';
import { authGuard } from '@presentation/shared/guards/auth.guard';
import { DashboardComponent } from './presentation/pages/dashboard/dashboard.component';
import { HomepageComponent } from '@presentation/pages/homepage/homepage.component';
import { AuthCallbackComponent } from '@presentation/pages/auth-callback/auth-callback.component';

export const routes: Routes = [
  {
    path: '',
    component: HomepageComponent
  },
  {
    path: 'auth/callback',
    component: AuthCallbackComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    resolve: {
      user: userReadyResolver
    },
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
