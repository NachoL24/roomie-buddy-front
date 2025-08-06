import { Routes } from '@angular/router';
import { userReadyResolver } from '@presentation/shared/guards/userLoadedResolver';
import { DashboardComponent } from './presentation/pages/dashboard/dashboard.component';
import { HomepageComponent } from '@presentation/pages/homepage/homepage.component';
import { AuthGuard } from '@auth0/auth0-angular';

export const routes: Routes = [
  {
    path: '',
    component: HomepageComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    resolve: {
      user: userReadyResolver
    },
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
