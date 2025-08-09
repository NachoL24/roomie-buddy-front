import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator to ensure the combination of a date control and an optional sibling time control
 * does not represent a future moment relative to now.
 *
 * Attach this validator to the date control. By default, it reads time from a sibling control named 'time'.
 *
 * Example:
 *   const dateCtrl = form.get('date');
 *   dateCtrl?.addValidators(dateTimeNotInFutureValidator('time'));
 */
export function dateTimeNotInFutureValidator(timeControlName: string = 'time'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control?.value) return null;

        const rawDate = control.value;
        const date = new Date(rawDate);
        if (isNaN(date.getTime())) return null; // let other validators handle invalid formats

        const time: unknown = control.parent?.get(timeControlName)?.value;

        const candidate = new Date(date);
        if (typeof time === 'string' && /^\d{2}:\d{2}$/.test(time)) {
            const [h, m] = time.split(':').map(Number);
            candidate.setHours(h, m, 0, 0);
        } else {
            candidate.setHours(0, 0, 0, 0);
        }

        const now = new Date();
        return candidate.getTime() > now.getTime() ? { dateTimeFuture: true } : null;
    };
}
