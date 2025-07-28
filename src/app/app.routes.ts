import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./presentation/pages/homepage/homepage.component').then(m => m.HomepageComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
