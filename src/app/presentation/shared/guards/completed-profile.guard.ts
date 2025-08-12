import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GlobalUserService } from '@application/use-cases';

export const completedProfileGuard: CanActivateFn = () => {
  const userService = inject(GlobalUserService);
  const router = inject(Router);

  if (userService.ready()) {
    if (!userService.user()?.profileCompleted) {
      router.navigate(['/profile']);
      return false;
    }
    return true;
  }
  return false;
};
