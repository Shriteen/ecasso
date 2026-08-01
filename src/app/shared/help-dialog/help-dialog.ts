import { Component } from "@angular/core";
import { SIMULATION_PRESET_NAMES, SimulationPresetName } from "../models/Simulation.presets";
import { SimulationService } from "@shared/services/simulation-service";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ModalService } from "@core/modal/ModalService";

@Component({
  selector: "app-help-dialog",
  imports: [FormsModule],
  templateUrl: "./help-dialog.html",
  styleUrl: "./help-dialog.css",
})
export class HelpDialog{  

  modalService: ModalService;
  
  constructor(modalService: ModalService ){
    this.modalService=modalService;    
  }
}
