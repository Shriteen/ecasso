import { Component, effect, HostListener, signal } from "@angular/core";
import { Viewer } from "./viewer/viewer";
import { Editor } from "./editor/editor";
import Simulation from "@shared/models/Simulation.model";
import { TransitionFromRule } from "@shared/types";
import Grid from "@core/Grid";
import { type Cell } from "@shared/types";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "simulator",
  imports: [Editor,Viewer, FormsModule],
  templateUrl: "./simulator.html",
  styleUrl: "./simulator.css",
})
export class Simulator {

  simulation:Simulation;

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
    
    const rules:TransitionFromRule={
      alive: {
	dead: {
	  condition: "OR",
	  children: [
	    {
	      state: "alive",
	      condition: "LT",
	      value: 2
	    },
	    {
	      state: "alive",
	      condition: "GT",
	      value: 3
	    }
	  ]
	},
	zombie:{
	  condition: "DUMMY",
	}
      },
      dead: {
	alive: {
	  state: "alive",
	  condition: "EQ",
	  value: 3
	},
	zombie: {
	  condition: "DUMMY",
	}
      }
    };
    
    this.simulation= new Simulation(
      [{name:"alive", color:"black"},{name: "dead", color:"white"}, {name: "zombie", color:"green"}],
      "dead",
      rules,
      this.options
    )



    
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
  
}
