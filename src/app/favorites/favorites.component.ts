import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  loading = true;
  user;
  noFavorites: boolean;
  favoriteProducts = [];

  constructor(private dataService: DataService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.dataService.userBehaviorSubject.subscribe(
      data => {
        this.user = data;
      }
    );

    this.dataService.getFavoriteProducts(this.user.id).subscribe(
      success => {
        this.favoriteProducts = success as [];
        if (this.favoriteProducts.length === 0) {
          this.noFavorites = true;
        }
        this.loading = false;
      },
      fail => {
        console.log(fail);
      }
    )
  }

  openProductDialog(product) {
    console.log(product);
    this.dialog.open(ProductDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '1200px',
      height: '1000',
      data: product
    });
  }

  removeFromFavorites(product) {
    this.favoriteProducts.splice(this.favoriteProducts.indexOf(product), 1);
    console.log(this.user.id);
    console.log(product.productId);
    if (this.favoriteProducts.length === 0) {
      this.noFavorites = true;
    }
    this.dataService.removeFromFavorites(this.user.id, product.productId).subscribe(
      success => {
        console.log(success);
      }, fail => {
        console.log(fail);
      }
    )
  }

}
