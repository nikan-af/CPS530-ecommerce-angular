import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  cartItems = [];
  checkout = false;
  subTotal = 0;

  constructor(private dataService: DataService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.dataService.cartItemsBehaviourSubject.subscribe(data => {
      console.log(data);
      this.cartItems = data;
      this.resetTotal();
    });
  }

  openProductDialog(product) {
    console.log(product);
    this.dialog.open(ProductDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '60vw',
      height: '67vh',
      data: product
    });
  }

  removeItem(product) {
    this.cartItems.splice(this.cartItems.indexOf(product), 1);
    this.dataService.removeItem(product);
  }

  onChange(event) {
    this.resetTotal();
  }

  resetTotal() {
    this.subTotal = 0;
    for (var i = 0; i < this.cartItems.length; i++) {
      this.subTotal += this.cartItems[i].price * this.cartItems[i].qty;
    }
  }

}
