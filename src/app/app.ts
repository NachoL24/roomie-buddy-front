import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from "@presentation/shared/ui/toolbar/toolbar.component";
import { LoadingComponent } from "@presentation/shared/ui/loading/loading.component";
import { LoadingService } from "@presentation/shared/services";
import { CommonModule } from '@angular/common';
import { GlobalUserService } from '@application/use-cases';
import { DrawerComponent } from "@presentation/shared/ui/drawer/drawer.ng";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToolbarComponent, LoadingComponent, CommonModule, DrawerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'roomie-buddy-front';
  loadingService = inject(LoadingService);

}
