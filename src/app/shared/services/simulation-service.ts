import { Injectable } from "@angular/core";
import Simulation from "@shared/models/Simulation.model";
import { getSimulationPreset, SimulationPresetName } from "@shared/models/Simulation.presets";
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
    return this.repository;
  }
  
  create(presetName: SimulationPresetName){
    const preset =getSimulationPreset(presetName);

    const sim= new Simulation(
      preset.states,
      preset.rules,
      preset.options
    );
    
    const item: SimulationData= {
      id: uuidv4(),
      name: preset.name?? "Untitled",
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

  delete(id: string){
    const index=this.repository.findIndex(x=> x.id==id);
    if(index!==-1){
      const data= this.repository[index];

      //Remove from memory
      this.repository.splice(index, 1);

      //If present remove from storage
      if(data.persistedSimulation){
	const savedData=JSON.parse(localStorage.getItem("saved_simulations") ?? "{}");
	delete savedData[id];

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

  export(id: string){
    const data=this.getById(id);
    const exportObj= JSON.stringify(
      {
	simulation: data.data,
	name: data.name
      },
      (key, value) => {
	if (value instanceof Map) {
	  return {
	    __type: "Map",
	    entries: [...value.entries()]
	  };
	}
	return value;
      });
    
    const blob = new Blob([exportObj], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = data.name+'.json';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }

  async import(blob: Blob){
    const json= await blob.text();

    const data=JSON.parse( json ?? "{}",
	(key, value) => {
	  if (value?.__type === "Map") {
	    return new Map(value.entries);
	  }
	  return value;
	}
      );
    
    const sim: Simulation=Simulation.hydrateFrom(data.simulation);
    
    const item: SimulationData= {
      id: uuidv4(),
      name: data.name,
      data: sim,
      persistedSimulation: false
    }
    
    this.repository.push(item);
  }
  
}
