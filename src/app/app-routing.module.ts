import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';
import { EvadminregisterComponent } from './components/evadminregister/evadminregister.component';
import { AdminloginComponent } from './components/adminlogin/adminlogin.component';
import { EvadminloginComponent } from './components/evadminlogin/evadminlogin.component';
import { AuthGuard } from './guards/auth.guard';
import { SauthGuard } from './guards/sauth.guard';
import { EvdetailspageComponent } from './components/evdetailspage/evdetailspage.component';
import { UserAuthGuard } from './guards/userauth.guard';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { ContactusComponent } from './components/contactus/contactus.component';

const routes: Routes = [
  { path: 'about', component: AboutusComponent },
  { path: 'contact', component: ContactusComponent },

  { path: '', component: HomeComponent },
  // User
  { path: 'login/user', component: LoginComponent },
  { path: 'register/user', component: RegisterComponent },

  // Ev Details Page
  { path: 'evstation/:stationid', component: EvdetailspageComponent },

  // Ev Admin
  { path: 'register/evadmin', component: EvadminregisterComponent },
  { path: 'login/evadmin', component: EvadminloginComponent },
  //Admin
  { path: 'login/admin', component: AdminloginComponent },

  // EV Admin Dashboard
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/admin/admin.module').then((m) => m.AdminModule),
  },

  // Super Admin Dashboard
  {
    path: 'sadmin',
    canActivate: [SauthGuard],
    loadChildren: () =>
      import('./modules_admin/superadmin/superadmin.module').then(
        (s) => s.SuperadminModule
      ),
  },

  // User Dashboard
  {
    path: 'user',
    canActivate: [UserAuthGuard],
    loadChildren: () =>
      import('./user-module/user-module.module').then(
        (s) => s.UserModuleModule
      ),
  },

  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
