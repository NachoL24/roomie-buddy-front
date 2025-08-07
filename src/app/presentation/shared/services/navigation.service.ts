import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    private scrollToSectionSubject = new Subject<string>();

    scrollToSection$ = this.scrollToSectionSubject.asObservable();

    scrollToSection(sectionId: string) {
        this.scrollToSectionSubject.next(sectionId);
    }
}
