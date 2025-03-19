import {Component, Input} from '@angular/core';
import {Product} from "../../../product.model";
import {RouterModule} from "@angular/router";
import {AdminOnlyDirective} from "../../shared/directives/admin-only.directive";

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [RouterModule, AdminOnlyDirective],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent {
  @Input() product!: Product;
}
