import { Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
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

  constructor(private router: Router, private modalService: ModalService ){}
  
  newSimulation(){
    this.modalService.open({ component: CreateDialog });
  }
  
}
