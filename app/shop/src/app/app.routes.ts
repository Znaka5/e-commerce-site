import { Routes } from '@angular/router';
import { CatalogComponent } from './components/catalog/catalog';
import { BestSellersComponent } from './components/best-seller/best-seller';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { ProfileComponent } from './components/profile-details/profile-details';
import { DetailsComponent } from './components/details/details';
// import { EditComponent } from './components/edit/edit.component';
// import { DeleteComponent } from './components/delete/delete.component';
import { NotFoundComponent } from './components/not found/not-found';
import { logoutComponent } from './components/logout/logout';
import { EditProfileComponent } from './components/profile-edit/profile-edit';

export const routes: Routes = [
  { path: 'catalog', component: CatalogComponent },
  { path: 'best-sellers', component: BestSellersComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'logout', component: logoutComponent},
  { path: 'profile/:id/edit', component: EditProfileComponent},

  { path: 'products/:id/details', component: DetailsComponent },
  // { path: 'products/:id/edit', component: EditComponent },
  // { path: 'products/:id/delete', component: DeleteComponent },

  { path: '', redirectTo: '/catalog', pathMatch: 'full' },

  { path: '**', component: NotFoundComponent }
];