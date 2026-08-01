import { Component } from "@angular/core";
import { ModalService } from "@core/modal/ModalService";

@Component({
  selector: "app-help-dialog",
  imports: [],
  templateUrl: "./help-dialog.html",
  styleUrl: "./help-dialog.css",
})
export class HelpDialog{  

  modalService: ModalService;
  
  constructor(modalService: ModalService ){
    this.modalService=modalService;    
  }
}
