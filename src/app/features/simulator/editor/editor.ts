import { ChangeDetectorRef, Component, EventEmitter, input, OnInit, Output } from "@angular/core";
import { v4 as uuidv4 } from 'uuid'; 
import Simulation from "@shared/models/Simulation.model";
import { TransitionFromRule, State } from "@shared/types";
import { FormsModule } from "@angular/forms";

type ItemWithId<T> = Partial<T> & { _id: string };

@Component({
  selector: "editor",
  imports: [FormsModule],
  templateUrl: "./editor.html",
  styleUrl: "./editor.css",
})
export class Editor implements OnInit {
  simulationState = input.required<Simulation>();

  states: ItemWithId<State>[]=[];
  defaultStateId: string|null=null;

  selectedStateIndex: number|null=null;

  errorMode: "neutral"|"success"|"fail" = "neutral";
  errorMessage: string|null = null;

  constructor(private cdr: ChangeDetectorRef){
  }

  ngOnInit(): void {
    this.states = Array.from(this.simulationState().states.values())
                       .map(x=>{return {_id: uuidv4(),...x}});
    const filtered = this.states.find(x=>x.name==this.simulationState().defaultState);
    if(filtered)         // Should always be true, this condition is to satisfy TS
      this.defaultStateId=filtered._id;
    else
      throw new Error("Default state not in states");
    
    this.selectedStateIndex= this.states[0] ? 0 : null;
  }
  
  compileFromText(json : string){
    try{
      const rules = JSON.parse(json);
      this.compile(rules);
    }catch(e: any){
      this.errorMode="fail";
      this.errorMessage=e.message;
    }
  }

  compile(rules: TransitionFromRule){
    try{
      const tempStates=[]
      for(const state of this.states){
        if(!state.name || !state.color)
          throw new Error("Incomplete state! "+ JSON.stringify(state));

        tempStates.push({name:state.name, color: state.color});
      }
      let defaultState:string|undefined;
      if(this.defaultStateId==null){
        throw new Error("One of the states should be set as background!")
      }else{
        defaultState= this.states.find(x=>x._id==this.defaultStateId)?.name ;
      }
      
      this.simulationState()?.setRules(rules, tempStates, defaultState);
      this.errorMode="success";      
      this.errorMessage=null;
      setTimeout(()=>{
        this.errorMode="neutral";
        this.cdr.detectChanges();
      }, 2500);
    }catch(e: any){
      this.errorMode="fail";      
      this.errorMessage=e.message;
    }
  }

  selectState(index: number){
    this.selectedStateIndex=index;
  }
  
  addState(){    
    this.states.push({_id: uuidv4(), color: "#000000"});
    this.selectedStateIndex= this.states.length-1;
  }

  deleteState(id: string){
    //If default was current set as null
    if(this.defaultStateId==id)
      this.defaultStateId= null;

    this.states= this.states.filter(s=>s._id!=id);

    //Current must have been selected so need to update
    if(this.states.length)
      this.selectedStateIndex=0;
    else
      this.selectedStateIndex=null;
  }
  
}
