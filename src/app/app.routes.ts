import { Routes } from '@angular/router';
import { RoomsComponent } from './components/room/room.component';
import { UsersComponent } from './components/users/users.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { BookingComponent } from './components/booking/booking.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { HomeComponent } from './public/home/home.component';
import { AuthGuard } from './core/Guards/AuthGuard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot', component: ForgotPasswordComponent },
  { path: 'reset', component: ResetPasswordComponent },

  { 
    path: 'booking', 
    component: BookingComponent, 
    canActivate: [AuthGuard], 
    data: { roles: ['Admin', 'User'] } 
  },
  { 
    path: 'rooms', 
    component: RoomsComponent, 
    canActivate: [AuthGuard], 
    data: { roles: ['Admin'] } 
  },
  { 
    path: 'users', 
    component: UsersComponent, 
    canActivate: [AuthGuard], 
    data: { roles: ['Admin'] } 
  },

  { path: '**', redirectTo: 'home' }
];


