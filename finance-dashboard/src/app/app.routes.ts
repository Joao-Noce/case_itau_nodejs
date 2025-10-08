import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { DashboardComponent } from './pages/layout-principal/components/dashboard/dashboard.component';
import { ClienteComponent } from './pages/layout-principal/components/cliente/cliente.component';
import { LayoutPrincipalComponent } from './pages/layout-principal/layout-principal.component';

export const routes: Routes = [
  { path: '', redirectTo: 'Login', pathMatch: 'full' },
  { path: 'Login', component: LoginComponent },
  { path: 'Cadastro', component: CadastroComponent },
  {
    path: '',
    component: LayoutPrincipalComponent,
    children: [
      { path: 'Dashboard', component: DashboardComponent },
      { path: 'Configurações', component: ClienteComponent }
    ]
  },
  { path: '**', redirectTo: 'Login' }
];
