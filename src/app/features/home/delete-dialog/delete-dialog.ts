import { Component, Input } from "@angular/core";
import { ModalService } from "@core/modal/ModalService";
import { SimulationService } from "@shared/services/simulation-service";

@Component({
  selector: "app-delete-dialog",
  imports: [],
  templateUrl: "./delete-dialog.html",
  styleUrl: "./delete-dialog.css",
})
export class DeleteDialog{
  @Input({ required: true }) id!:string;

  modalService: ModalService;
  
  constructor(private simulationService: SimulationService, modalService : ModalService){
    this.modalService=modalService;    
  }
  
  delete(){
    this.simulationService.delete(this.id!);
    this.modalService.close();    
  }
  
}
