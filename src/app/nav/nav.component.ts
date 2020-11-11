import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '../shared/modal.service';
import { DataService } from '../shared/data.service';

@Component({
    selector: 'nav-component',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent {
    closeResult = '';
    isMenuCollapsed: boolean;
    optionsBoxOpen = false;
    pageName = 'propertyListings';
    userIsLoggedIn = false;

    constructor(public modalService: ModalService, private router: Router, private dataService: DataService) {

    }

    handleLogin(content) {
        if (this.userIsLoggedIn) {
          this.userIsLoggedIn = false;
          this.dataService.logout();
          console.log(this.dataService.tempUser);
        } else {
          this.modalService.open(content);
        }
    }

    onUserStatusChange(event) {
        if (event === 'loggedIn') {
            this.userIsLoggedIn = true;
        }
    }
}