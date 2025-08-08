import { Component } from '@angular/core';
import { GlobalUserService } from '@application/use-cases';
import { MyResumeComponent } from "./components/my-resume.ng";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    MyResumeComponent
],
  template: `
    <app-my-resume/>
  `
})
export class MyDashboardComponent {

  constructor(public userState: GlobalUserService) { }
}
