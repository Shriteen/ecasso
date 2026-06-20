import { Component, Input } from "@angular/core";
import ModalInterface from "@core/modal/ModalInterface";
import { SimulationService } from "@shared/services/simulation-service";

@Component({
  selector: "app-revert-dialog",
  imports: [],
  templateUrl: "./revert-dialog.html",
  styleUrl: "./revert-dialog.css",
})
export class RevertDialog  extends ModalInterface{
  @Input({ required: true }) id!:string;
  @Input() reloadFunction?: ()=>void;

  constructor(private simulationService: SimulationService){
    super();
  }

  revert(){
    this.simulationService.revert(this.id!);
    this.reloadFunction?.();
    this._close()?.();
  }
}
