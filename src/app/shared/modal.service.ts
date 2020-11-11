import { Injectable } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class ModalService {

  closeResult;
  modalRef;

  constructor(private modalService: NgbModal) {};

  open(content, options: NgbModalOptions = {ariaLabelledBy: 'modal-basic-title'}) {
    console.log(content)
    this.modalRef = this.modalService.open(content, options);
  }

  close(content) {
    this.modalRef.close(content);
  }
}
