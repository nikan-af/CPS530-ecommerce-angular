import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  user;
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
      },
      fail => {
        console.log(fail);
      }
    )
  }

}
