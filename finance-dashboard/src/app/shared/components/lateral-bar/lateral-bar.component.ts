import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lateral-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lateral-bar.component.html',
  styleUrls: ['./lateral-bar.component.scss']
})
export class LateralBarComponent {
  mostrar: any;


  constructor(private router: Router) { }

  alternarBarra() {
    this.mostrar = !this.mostrar;
  }

  irParaDashboard() {
    this.router.navigate(['/Dashboard']);
  }

  irParaUsuario() {
    this.router.navigate(['/Configurações']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/Login']);
  }
}
