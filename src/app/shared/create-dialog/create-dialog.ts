import { Component } from "@angular/core";
import { SIMULATION_PRESET_NAMES, SimulationPresetName } from "../models/Simulation.presets";
import { SimulationService } from "@shared/services/simulation-service";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ModalService } from "@core/modal/ModalService";

@Component({
  selector: "app-create-dialog",
  imports: [FormsModule],
  templateUrl: "./create-dialog.html",
  styleUrl: "./create-dialog.css",
})
export class CreateDialog{
  
  preset : SimulationPresetName= "blank";
  presetOptions = SIMULATION_PRESET_NAMES;

  modalService: ModalService;
  
  constructor(private router: Router, private simulationService: SimulationService, modalService: ModalService ){
    this.modalService=modalService;    
  }
  
  create(){
    const id= this.simulationService.create(this.preset);
    this.modalService.close();
    this.router.navigate(['/simulation', id]);
  }
}
