import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { 
  LoginComponent,
  HomeComponent,
  RegistrationComponent
} from './components';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
