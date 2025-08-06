import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { GlobalUserService } from '@application/use-cases';
import { map } from 'rxjs';

export const userReadyResolver: ResolveFn<boolean> = () => {
  const user = inject(GlobalUserService);
  return user.loadOnce$().pipe(map(() => true));
};
