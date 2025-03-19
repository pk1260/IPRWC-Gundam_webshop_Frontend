import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ProductItemComponent} from "./product-item/product-item.component";
import {Product} from "../../product.model";
import {ApiService} from "../shared/api.service";

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    ProductItemComponent
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit{
  public productList: Product[] = [];

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.loadAllProducts()
  }

  loadAllProducts(): void{
    this.apiService.getAllProducts().subscribe({
      next: (data) => {
        this.productList = data
      }
    });

  }
}
