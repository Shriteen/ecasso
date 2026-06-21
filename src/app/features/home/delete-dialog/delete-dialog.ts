import { Component, Input } from "@angular/core";
import ModalInterface from "@core/modal/ModalInterface";
import { SimulationService } from "@shared/services/simulation-service";

@Component({
  selector: "app-delete-dialog",
  imports: [],
  templateUrl: "./delete-dialog.html",
  styleUrl: "./delete-dialog.css",
})
export class DeleteDialog extends ModalInterface{
  @Input({ required: true }) id!:string;

  constructor(private simulationService: SimulationService){
    super();
  }
  
  delete(){
    this.simulationService.delete(this.id!);
    this._close()?.();
  }
  
}
