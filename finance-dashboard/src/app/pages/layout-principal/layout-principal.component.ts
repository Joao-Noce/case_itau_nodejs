import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LateralBarComponent } from '../../shared/components/lateral-bar/lateral-bar.component';

@Component({
  selector: 'app-layout-principal',
  standalone: true,
  imports: [RouterOutlet, LateralBarComponent],
  templateUrl: './layout-principal.component.html',
  styleUrls: ['./layout-principal.component.scss']
})
export class LayoutPrincipalComponent {}
