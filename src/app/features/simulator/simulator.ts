import { Component, effect, HostListener, inject, signal } from "@angular/core";
import { Viewer } from "./viewer/viewer";
import { Editor } from "./editor/editor";
import Simulation from "@shared/models/Simulation.model";
import { TransitionFromRule } from "@shared/types";
import Grid from "@core/Grid";
import { type Cell } from "@shared/types";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { SimulationData, SimulationService } from "@shared/services/simulation-service";

@Component({
  selector: "simulator",
  imports: [Editor,Viewer, FormsModule, RouterLink],
  templateUrl: "./simulator.html",
  styleUrl: "./simulator.css",
})
export class Simulator {

  simulation:Simulation;

  simulationService = inject(SimulationService);

  private router = inject(Router)
  private route: ActivatedRoute = inject(ActivatedRoute);
  private id= this.route.snapshot.paramMap.get('id');
  
  options = {
    cellSize: 10,
    matrixWidth: 60,
    matrixHeight: 70,
    initializer(grid: Grid<Cell>) {
      grid.mapInPlace((cell: Cell|null,r:Number,c:Number,grid:Grid<Cell>)=>{
	return Math.random()<0.1?
          {state: "alive"} :
          {state: "dead"};
      })
    }
  }

  private readonly MOBILE_WIDTH= 768;
  isMobile = signal(window.innerWidth < this.MOBILE_WIDTH);
  
  viewType: "SPLIT"|"EDITOR"|"VIEWER"= "SPLIT";
  
  constructor(){
    effect(()=>{
      //For small width, if in split view, we need to change 
      if(this.isMobile() && this.viewType=="SPLIT"){
	this.viewType="EDITOR";
      }
    });
    
    
    if(this.id){
      const simulationData= this.simulationService.getById(this.id);
      if(simulationData.data){
	this.simulation= simulationData.data;
      }else{
	throw new Error('404 - Simulation Not found');
      }
    }
    else{
      throw new Error('404 - Id Not found');
      //TODO create implicitely on error?
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
    this.simulationService.save(this.id!);
  }
  
}
