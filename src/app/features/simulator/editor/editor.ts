import { ChangeDetectorRef, Component, computed, EventEmitter, input, OnInit, Output, signal } from "@angular/core";
import { v4 as uuidv4 } from 'uuid'; 
import Simulation from "@shared/models/Simulation.model";
import { TransitionFromRule, TransitionToRule, State } from "@shared/types";
import { FormsModule } from "@angular/forms";
import { convertToStates, simulationToStateUIarray, StateUI, stateUIarrayToTransitionFromRules } from "./ui-adapter";
import { JsonPipe } from "@angular/common";
import { ToStateEditor } from "./to-state-editor/to-state-editor";
import { ALL_STATES } from "./editor.token";

@Component({
  selector: "editor",
  imports: [FormsModule, JsonPipe, ToStateEditor],
  templateUrl: "./editor.html",
  styleUrl: "./editor.css",
  providers: [
    {
      provide: ALL_STATES,
      useFactory: (editor:Editor)=> (()=>editor.getStates()) ,
      deps: [Editor]
    }
  ]
})
export class Editor implements OnInit {
  simulationState = input.required<Simulation>();

  states: StateUI[]=[];
  defaultStateId: string|null=null;

  selectedStateIndex: number|null=null;
  
  errorMode: "neutral"|"success"|"fail" = "neutral";
  errorMessage: string|null = null;

  constructor(private cdr: ChangeDetectorRef){
  }

  ngOnInit(): void {
    this.states = simulationToStateUIarray(this.simulationState());

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

  compileRules(){
    try{
      const rules = stateUIarrayToTransitionFromRules(this.states);
      this.compile(rules);
    }catch(e: any){
      this.errorMode="fail";
      this.errorMessage=e.message;
    }
  }

  compile(rules: TransitionFromRule){
    try{
      const tempStates : State[]= convertToStates(this.states);

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
    this.states.push({_id: uuidv4(), color: "#000000", rules: []});
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

  addToStateRule(){
    //Need to add under currently selected
    if(this.selectedStateIndex!=null){
      this.states[this.selectedStateIndex].rules.push({
        _id: uuidv4(),
        to: "",
        rule: { _id: uuidv4() }
      });
    }
  }
  
  deleteToStateRule(id: string){
    if(this.selectedStateIndex!=null){
      const selectedToState= this.states[this.selectedStateIndex];
      selectedToState.rules= selectedToState.rules.filter(s=>s._id!=id);
    }
  }

  //Get states which are options as target states
  getAvailableToStates(fromStateIndex: number|null): StateUI[]{
    //Set(all states) - Set(already taken states for fromState)
    if(fromStateIndex!=null){
      const takenStateNames:string[]= this.states[fromStateIndex].rules.map(s=>s.to);
      const availableStates= this.states.filter(
        state=>state.name!=undefined && state.name!=null && state.name!=""
      ).filter(
        state=> !takenStateNames.includes(state.name!)
      );

      return availableStates;
    }
    return [];
  }

  getStates(){    
    return this.states
      .filter(s=>s.name)
      .map(s=>{ return {name: s.name, _id: s._id} });
  }
}
