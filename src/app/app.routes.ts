import { Routes } from '@angular/router';
import { userReadyResolver } from '@presentation/shared/guards/userLoadedResolver';
import { authGuard } from '@presentation/shared/guards/auth.guard';
import { MyDashboardComponent } from './presentation/pages/dashboard/my-dashboard.component';
import { HomepageComponent } from '@presentation/pages/homepage/homepage.component';
import { AuthCallbackComponent } from '@presentation/pages/auth-callback/auth-callback.component';
import { HouseDashboardComponent } from './presentation/pages/house-dashboard/house-dashboard.component';

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
    component: MyDashboardComponent,
    resolve: {
      user: userReadyResolver
    },
    canActivate: [authGuard]
  },
  {
    path: 'house/:id/dashboard',
    component: HouseDashboardComponent,
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
