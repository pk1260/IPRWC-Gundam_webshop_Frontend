import { Routes } from '@angular/router';
import {AppLayoutComponent} from "./components/app-layout/app-layout.component";
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {ProductComponent} from "./components/product/product.component";
import {ProductDetailsComponent} from "./components/product/product-details/product-details.component";
import {CartComponent} from "./components/cart/cart.component";
import {ProductEditComponent} from "./components/product/product-edit/product-edit.component";
import {adminGuard} from "./components/shared/guards/admin.guard";
import {ProductCreateComponent} from "./components/product/product-create/product-create.component";
import {AccountComponent} from "./components/account/account.component";

export const routes: Routes = [
  {
  path: '',
  component: AppLayoutComponent,
  children: [
    {
      path: '',
      component: ProductComponent
    },
    {
      path: 'login',
      component: LoginComponent
    },
    {
      path: 'register',
      component: RegisterComponent
    },
    {
      path: 'product/:uuid',
      component: ProductDetailsComponent
    },
    {
      path: 'product/edit/:uuid',
      component: ProductEditComponent,
      canActivate: [adminGuard]
    },{
      path: 'create',
      component: ProductCreateComponent,
      canActivate: [adminGuard]
    },
    {
      path: 'cart',
      component: CartComponent
    },
    {
      path: 'account',
      component: AccountComponent
    }
  ]
}
];
