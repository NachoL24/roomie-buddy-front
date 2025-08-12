import { Routes } from '@angular/router';
import { userReadyResolver } from '@presentation/shared/guards/userLoadedResolver';
import { authGuard } from '@presentation/shared/guards/auth.guard';
import { completedProfileGuard } from '@presentation/shared/guards/completed-profile.guard';
import { MyDashboardComponent } from './presentation/pages/dashboard/my-dashboard.component';
import { HomepageComponent } from '@presentation/pages/homepage/homepage.component';
import { AuthCallbackComponent } from '@presentation/pages/auth-callback/auth-callback.component';
import { HouseDashboardComponent } from './presentation/pages/house-dashboard/house-dashboard.component';
import { UserProfilePageComponent } from '@presentation/pages/profile/user-profile.ng';
import { homepageGuard } from '@presentation/shared/guards/homepage.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
    canActivate: [homepageGuard]
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
    canActivate: [authGuard, completedProfileGuard]
  },
  {
    path: 'house/:id/dashboard',
    component: HouseDashboardComponent,
    resolve: {
      user: userReadyResolver
    },
    canActivate: [authGuard, completedProfileGuard]
  },
  {
    path: 'profile',
    component: UserProfilePageComponent,
    resolve: { user: userReadyResolver },
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  }
];
