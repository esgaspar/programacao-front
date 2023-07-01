import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DesignacaoComponent } from './designacao/designacao.component';
import { HomeComponent } from './home/home.component';
import { PrivilegioComponent } from './privilegio/privilegio.component';
import { VoluntarioComponent } from './voluntario/voluntario.component';
import { DesignacaoCreateComponent } from './designacao/pages/create/designacao.create.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: "home", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: 'login', component: LoginComponent },
  { path: 'privilegio', component: PrivilegioComponent, canActivate: [AuthGuard] },
  { path: 'voluntario', component: VoluntarioComponent, canActivate: [AuthGuard] },
  { path: 'designacao', component: DesignacaoComponent, canActivate: [AuthGuard] },
  { path: 'designacao/novo', component: DesignacaoCreateComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
