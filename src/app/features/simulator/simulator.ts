import { Component, effect, HostListener, inject, signal } from "@angular/core";
import { Viewer } from "./viewer/viewer";
import { Editor } from "./editor/editor";
import Simulation from "@shared/models/Simulation.model";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { SimulationService } from "@shared/services/simulation-service";
import { ModalService } from "@core/modal/ModalService";
import { SaveDialog } from "./save-dialog/save-dialog";
import { JsonPipe } from "@angular/common";
import { RevertDialog } from "./revert-dialog/revert-dialog";
import { LucideEye, LucideSquareSplitHorizontal, LucidePencil, LucideMoveLeft } from "@lucide/angular";

@Component({
  selector: "simulator",
  imports: [Editor,Viewer, FormsModule, RouterLink, JsonPipe,
    LucideEye, LucideSquareSplitHorizontal, LucidePencil, LucideMoveLeft],
  templateUrl: "./simulator.html",
  styleUrl: "./simulator.css",
})
export class Simulator {

  simulation?:Simulation;
  name?: string;
  
  simulationService = inject(SimulationService);
  
  private router = inject(Router)
  private route: ActivatedRoute = inject(ActivatedRoute);
  private id:string|null=null;

  private modalService= inject(ModalService);
  
  private readonly MOBILE_WIDTH= 768;
  isMobile = signal(window.innerWidth < this.MOBILE_WIDTH);
  
  viewType: "SPLIT"|"EDITOR"|"VIEWER"= "SPLIT";

  persistedSimulation: boolean= false;
  
  constructor(){
    effect(()=>{
      //For small width, if in split view, we need to change 
      if(this.isMobile() && this.viewType=="SPLIT"){
	this.viewType="EDITOR";
      }
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.load();
    });
  }
  
  load(){
    try{
      if(this.id){
        const simulationData= this.simulationService.getById(this.id);
        if(simulationData.data){
	  this.simulation= simulationData.data;
	  this.name= simulationData.name;
          this.persistedSimulation= simulationData.persistedSimulation ?? false;
        }else{
	  throw new Error('Simulation Not found');
        }
      }
      else{
        throw new Error('Id Not found');
      }
    }
    catch(e){
      console.log(e)
      this.router.navigate(['/simulation/error']);
    }

  }
  
  @HostListener("window:resize")
  onResize(){
    this.isMobile.set(window.innerWidth < this.MOBILE_WIDTH);
  }

  handleCompile(){
    //Switch view on compile for mobile
    if(this.isMobile() && this.viewType=="EDITOR"){
        this.viewType="VIEWER";      
    }
  }

  handleSave(){
    this.modalService.open({
      component: SaveDialog,
      inputs: {
        id: this.id!,
        reloadFunction: ()=>{
          this.load();          
        },
        saved: this.persistedSimulation
      }
    })
  }

  handleRevert(){
    this.modalService.open({
      component: RevertDialog,
      inputs: {
        id: this.id!,
        reloadFunction: ()=>{
          this.load();
        }
      }
    });
  }
  
}
