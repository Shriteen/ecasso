import { Component, Input } from "@angular/core";
import { ModalService } from "@core/modal/ModalService";
import { SimulationService } from "@shared/services/simulation-service";

@Component({
  selector: "app-revert-dialog",
  imports: [],
  templateUrl: "./revert-dialog.html",
  styleUrl: "./revert-dialog.css",
})
export class RevertDialog{
  @Input({ required: true }) id!:string;
  @Input() reloadFunction?: ()=>void;

  modalService: ModalService;
  
  constructor(private simulationService: SimulationService, modalService: ModalService){
    this.modalService=modalService;    
  }

  revert(){
    this.simulationService.revert(this.id!);
    this.reloadFunction?.();
    this.modalService.close();
  }
}
