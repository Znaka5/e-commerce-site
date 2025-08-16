import { Routes } from '@angular/router';
import { CatalogComponent } from './components/catalog/catalog';
import { BestSellersComponent } from './components/best-seller/best-seller';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { ProfileComponent } from './components/profile-details/profile-details';
import { DetailsComponent } from './components/details/details';
import { NotFoundComponent } from './components/not found/not-found';
import { logoutComponent } from './components/logout/logout';
import { EditProfileComponent } from './components/profile-edit/profile-edit';
import { CreateComponent } from './components/create/create';
import { EditComponent } from './components/edit-item/edit';
import { DeleteComponent } from './components/delete-item/delete';
import { RateComponent } from './components/rate/rate';
import { orderComponent } from './components/order/order';
import { CartComponent } from './components/checkout/cart';
import { AuthGuard } from './services/auth.guard';
import { IsLoggedIn } from './services/isLoggedIn';
import { IsCreator } from './services/isCreator';
import { CanRate } from './services/canRate';
import { SearchComponent } from './components/search/search';
import { AboutComponent } from './components/about/about';

export const routes: Routes = [
  { path: 'catalog', component: CatalogComponent },
  { path: 'best-sellers', component: BestSellersComponent },
  { path: 'products/:id/details', component: DetailsComponent },
  { path: 'search', component: SearchComponent},
  { path: 'about', component: AboutComponent},

  // Protected routes
  { path: 'login', component: LoginComponent, canActivate: [IsLoggedIn] },
  { path: 'register', component: RegisterComponent, canActivate: [IsLoggedIn] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'logout', component: logoutComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id/edit', component: EditProfileComponent, canActivate: [AuthGuard] },
  { path: 'products/create', component: CreateComponent, canActivate: [AuthGuard] },
  { path: 'products/:id/edit', component: EditComponent, canActivate: [AuthGuard, IsCreator] },
  { path: 'products/:id/delete', component: DeleteComponent, canActivate: [AuthGuard, IsCreator] },
  { path: 'products/:id/rate', component: RateComponent, canActivate: [AuthGuard, CanRate] },
  { path: 'products/:id/order', component: orderComponent, canActivate: [AuthGuard, CanRate] },
  { path: 'products/cart', component: CartComponent, canActivate: [AuthGuard] },
  
  { path: '', redirectTo: '/catalog', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];