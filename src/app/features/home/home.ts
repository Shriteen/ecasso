import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ModalService } from "@core/modal/ModalService";
import { SimulationService } from "@shared/services/simulation-service";
import { DeleteDialog } from "./delete-dialog/delete-dialog";
import { CreateDialog } from "@shared/create-dialog/create-dialog";
import { ImportDialog } from "./import-dialog/import-dialog";
import { LucideCheck, LucideFileDown, LucideFileUp, LucidePlus, LucideTrash2, LucideX } from "@lucide/angular";

@Component({
  selector: "app-home",
  imports: [RouterLink, LucideCheck, LucideX, LucideTrash2, LucideFileDown, LucideFileUp, LucidePlus],
  templateUrl: "./home.html",
  styleUrl: "./home.css",
})
export class Home {
  
  simulationService= inject(SimulationService);
  list= this.simulationService.getAll();

  modalService= inject(ModalService);
  
  constructor( ){
  }
  
  newSimulation(){
    this.modalService.open({ component: CreateDialog });
  }

  importSimulation(){
    this.modalService.open({ component: ImportDialog });
  }

  delete(id: string){
    this.modalService.open({
      component: DeleteDialog,
      inputs: {
        id: id
      }
    });
  }

  export(id: string){
    this.simulationService.export(id);
  }
  
  
}
