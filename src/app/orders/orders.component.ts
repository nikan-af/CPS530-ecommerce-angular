import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  loading = true;
  user;
  orders;
  orderByDate: any[] = [];
  reverseList: any[] = [];
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.userBehaviorSubject.subscribe(
      data => {
        this.user = data;
      }
    );

    this.dataService.getOrders(this.user.id).subscribe(
      success => {
        console.log(success);
        this.orders = success;
        this.orders.map(order => {
          if (!this.orderByDate[`${order.timestamp}`]) {
            this.orderByDate[`${order.timestamp}`] = [];
          }
          this.orderByDate[`${order.timestamp}`].push(order);
        });
        console.log(this.orderByDate);
        this.reverseList = this.orderByDate.reverse();
        this.loading = false;
      },
      fail => {
        console.log(fail);
      }
    )
  }

}
