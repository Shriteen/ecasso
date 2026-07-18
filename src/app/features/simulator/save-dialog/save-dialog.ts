import { Component, inject, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ModalService } from "@core/modal/ModalService";
import { SimulationService } from "@shared/services/simulation-service";

@Component({
  selector: "app-save-dialog",
  imports: [FormsModule],
  templateUrl: "./save-dialog.html",
  styleUrl: "./save-dialog.css",
})
export class SaveDialog{

  @Input({ required: true }) id!:string;
  @Input() reloadFunction?: ()=>void;
  @Input() saved?: boolean;

  originalName: string | undefined;
  name: string | undefined;

  modalService: ModalService;
  
  constructor(private router: Router, private simulationService: SimulationService, modalService: ModalService){
    this.modalService=modalService;
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
    if(this.name?.trim()==this.originalName)
      this.simulationService.save(this.id!);
    else
      this.simulationService.rename(this.id!, this.name?.trim()!);
    this?.reloadFunction?.();    
    this.modalService.close();
    
  }

  saveAsCopy(){
    const newId:string=this.simulationService.saveAs(this.id!, this.name?.trim()!);
    this.modalService.close();
    
    this.router.navigate(['/simulation', newId]);
  }
}
