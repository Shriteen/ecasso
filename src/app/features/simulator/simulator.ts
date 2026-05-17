import { Component } from "@angular/core";
import { Viewer } from "./viewer/viewer";
import { Editor } from "./editor/editor";
import Simulation from "@shared/models/Simulation.model";
import { TransitionFromRule } from "@shared/types";
import Grid from "@core/Grid";
import { type Cell } from "@shared/types";

@Component({
  selector: "simulator",
  imports: [Editor,Viewer],
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
  
  constructor(){
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

}
