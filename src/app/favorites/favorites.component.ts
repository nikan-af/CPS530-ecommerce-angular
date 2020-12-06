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

  /**
   * Upon initialization of the component set the event listeners on userData, favoriteProducts and userFavorites so that these
        arrays get updated in the component when data changes in other components.
   */
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

    this.dataService.userFavoritesBehaviourSubject.subscribe(
      data => {
        this.favoriteProducts = data as [];
        if (this.favoriteProducts.length > 0) {
          this.noFavorites = false;
        } else {
          this.noFavorites = true;
        }
      }
    )
  }

  /**
   * Takes in product object and opens the product-dialog.component and passes in the product object to the component.
   * @param product 
   */
  openProductDialog(product) {
    this.dialog.open(ProductDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '1200px',
      height: '1000',
      data: product
    });
  }

  /**
   * Takes in a product and removes the product from favorites
   * Uses dataService to make a post request to php backend to remove the product from the favorites table.
   * @param product 
   */
  removeFromFavorites(product) {
    this.favoriteProducts.splice(this.favoriteProducts.indexOf(product), 1);
    if (this.favoriteProducts.length === 0) {
      this.noFavorites = true;
    }
    this.dataService.removeFromFavorites(this.user.id, product.productId).subscribe(
      success => {
      }, fail => {
        console.log(fail);
      }
    )
  }

}
