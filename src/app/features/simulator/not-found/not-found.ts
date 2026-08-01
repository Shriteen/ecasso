import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ModalService } from "@core/modal/ModalService";
import { LucideHouse, LucidePlus } from "@lucide/angular";
import { CreateDialog } from "@shared/create-dialog/create-dialog";


@Component({
  selector: "app-not-found",
  imports: [RouterLink, LucideHouse, LucidePlus],
  templateUrl: "./not-found.html",
  styleUrl: "./not-found.css",
})
export class NotFound {

  constructor(private modalService: ModalService ){}
  
  newSimulation(){
    this.modalService.open({ component: CreateDialog });
  }
  
}
