import { Routes } from '@angular/router';
import { CatalogComponent } from './components/catalog/catalog';
import { BestSellersComponent } from './components/best-seller/best-seller';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { ProfileComponent } from './components/profile-details/profile-details';

export const routes: Routes = [
  { path: 'catalog', component: CatalogComponent },
  { path: 'best-sellers', component: BestSellersComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '', redirectTo: '/catalog', pathMatch: 'full' }
];