import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProductsComponent } from './products/products.component';
import { MainComponent } from './main/main.component';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
  { path: 'home', component: MainComponent },
  { path: 'products-men', component: ProductsComponent },
  { path: 'products-women', component: ProductsComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', component: MainComponent }
];
