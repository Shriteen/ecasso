import { Injectable } from "@angular/core";
import Grid from "@core/Grid";
import Simulation, { SimulationParams } from "@shared/models/Simulation.model";
import { Cell, TransitionFromRule } from "@shared/types";
import { v4 as uuidv4 } from 'uuid';

export interface SimulationData{
  id: string,
  data?: Simulation 
}; 

@Injectable({
  providedIn: "root",
})
export class SimulationService {

  repository: SimulationData[];

  constructor(){
    const savedData=JSON.parse(localStorage.getItem("saved_simulations") ?? "{}");
    this.repository= Object.keys(savedData).map(id=>{return {id: id}});;
  }

  getAll(){
    return this.repository.map(x=>{return {id: x.id}});
  }
  
  create(){

    const options: SimulationParams = {
      cellSize: 10,
      matrixWidth: 60,
      matrixHeight: 70
    }
    
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
    
    const sim= new Simulation(
      [{name:"alive", color:"black", weight: 10},{name: "dead", color:"white", weight: 90}, {name: "zombie", color:"green", weight: 0}],
      rules,
      options
    );
    
    const item: SimulationData= {
      id: uuidv4(),
      data: sim 
    }
    
    this.repository.push(item);
    return item.id;
  }

  getById(id: string){
    const inMemoryObj=this.repository.filter(x=> x.id==id)[0];

    //If not already loaded load
    if(!inMemoryObj.data){
      const savedData=JSON.parse(
	localStorage.getItem("saved_simulations") ?? "{}",
	(key, value) => {
	  if (value?.__type === "Map") {
	    return new Map(value.entries);
	  }
	  return value;
	}
      );

      if(savedData[id]){
	console.info("Loaded saved object to memory");
	inMemoryObj.data=Simulation.hydrateFrom(savedData[id].simulation);
      }
    }

    return inMemoryObj;
  }

  save(id: string){
    const data= this.repository.filter(x=> x.id==id)[0];
    if(data){
      const savedData=JSON.parse(localStorage.getItem("saved_simulations") ?? "{}");
      savedData[id]={
	simulation: data.data
      }

      localStorage.setItem("saved_simulations", JSON.stringify(savedData,
	(key, value) => {
	  if (value instanceof Map) {
	    return {
	      __type: "Map",
	      entries: [...value.entries()]
	    };
	  }
	  return value;
	})
      );
    }
  }
  
}
