import { Component } from "@angular/core";
import { SIMULATION_PRESET_NAMES, SimulationPresetName } from "../models/Simulation.presets";
import ModalInterface from "@core/modal/ModalInterface";
import { SimulationService } from "@shared/services/simulation-service";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-create-dialog",
  imports: [FormsModule],
  templateUrl: "./create-dialog.html",
  styleUrl: "./create-dialog.css",
})
export class CreateDialog extends ModalInterface{
  
  preset : SimulationPresetName= "blank";
  presetOptions = SIMULATION_PRESET_NAMES;

  constructor(private router: Router, private simulationService: SimulationService ){
    super();
  }
  
  create(){
    const id= this.simulationService.create(this.preset);
    this._close()?.();
    this.router.navigate(['/simulation', id]);
  }
}
