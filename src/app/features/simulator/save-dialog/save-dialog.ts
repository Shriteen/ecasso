import { Component, inject, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import ModalInterface from "@core/modal/ModalInterface";
import { SimulationService } from "@shared/services/simulation-service";

@Component({
  selector: "app-save-dialog",
  imports: [FormsModule],
  templateUrl: "./save-dialog.html",
  styleUrl: "./save-dialog.css",
})
export class SaveDialog extends ModalInterface{

  @Input({ required: true }) id!:string;
  @Input() updateNameFunction?: (newName:string)=>void;

  originalName: string | undefined;
  name: string | undefined;

  constructor(private router: Router, private simulationService: SimulationService){
    super();
  }
  
  ngOnInit(){
    const simulationData= this.simulationService.getById(this.id);
    if(simulationData?.data){
      this.originalName = this.name= simulationData.name;
    }else{
      throw new Error('Simulation not found!'+ "ID: "+this.id);
    }
  }

  save(){
    this.simulationService.save(this.id!);
    this._close()?.();
  }

  rename(){
    this.simulationService.rename(this.id!, this.name!);
    this?.updateNameFunction?.(this.name!);
    this._close()?.();
  }

  saveAsCopy(){
    const newId:string=this.simulationService.saveAs(this.id!, this.name!);
    this._close()?.();    
    this.router.navigate(['/simulation', newId]);
  }
}
