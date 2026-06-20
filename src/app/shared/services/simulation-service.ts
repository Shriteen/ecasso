import { Injectable } from "@angular/core";
import Grid from "@core/Grid";
import Simulation, { SimulationParams } from "@shared/models/Simulation.model";
import { Cell, TransitionFromRule } from "@shared/types";
import { v4 as uuidv4 } from 'uuid';

export interface SimulationData{
  id: string,
  name: string,
  data?: Simulation,
  persistedSimulation?: boolean,
}; 

@Injectable({
  providedIn: "root",
})
export class SimulationService {

  repository: SimulationData[];

  constructor(){
    const savedData=JSON.parse(localStorage.getItem("saved_simulations") ?? "{}");
    this.repository= Object.entries(savedData).map(([id,tempValue])=>{
      const value= tempValue as SimulationData;       // Just to satisfy TS tantrums
      return {id: id, name: value.name??"Untitled", persistedSimulation: true}
    });
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
      name: "Untitled",
      data: sim,
      persistedSimulation: false
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
	simulation: data.data,
	name: data.name
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

      data.persistedSimulation=true;
    }
  }

  rename(id: string, name: string){
    const data= this.repository.filter(x=> x.id==id)[0];
    data.name=name;
    this.save(id);
  }

  saveAs(id: string, name: string){
    const data= this.repository.filter(x=> x.id==id)[0];
    
    const newItem: SimulationData=structuredClone(data);
    newItem.id= uuidv4();
    newItem.name= name;
    newItem.data= Simulation.hydrateFrom(newItem.data!);
    
    this.repository.push(newItem);
    this.save(newItem.id);

    newItem.persistedSimulation=true;
    
    return newItem.id;
  }

  revert(id: string){
    const index=this.repository.findIndex(x=> x.id==id);

    if(index!=-1){
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
	console.info("Reloaded saved object to memory");
	this.repository[index]={
	  ...this.repository[index],
	  data: Simulation.hydrateFrom(savedData[id].simulation)
	};
      }else
	throw new Error("ID not present!");
    }else
      throw new Error("ID not present!");

  }
  
}
