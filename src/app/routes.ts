import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProductsComponent } from './products/products.component';
import { MainComponent } from './main/main.component';
import { ContactComponent } from './contact/contact.component';
import { OrdersComponent } from './orders/orders.component';
import { PremierComponent } from './premier/premier.component';
import { AboutComponent } from './about/about.component';
import { MissionComponent } from './mission/mission.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { SecurityComponent } from './security/security.component';

export const routes: Routes = [
  { path: 'home', component: MainComponent },
  { path: 'products-men', component: ProductsComponent },
  { path: 'products-women', component: ProductsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'premier', component: PremierComponent },
  { path: 'about', component: AboutComponent },
  { path: 'mission', component: MissionComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'security', component: SecurityComponent },
  { path: '**', component: MainComponent }
];
