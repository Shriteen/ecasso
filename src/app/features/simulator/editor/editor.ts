import { afterNextRender, ChangeDetectorRef, Component, effect, ElementRef, inject, Injector, input, OnInit, output, ViewChild } from "@angular/core";
import { v4 as uuidv4 } from 'uuid'; 
import Simulation from "@shared/models/Simulation.model";
import { TransitionFromRule, State } from "@shared/types";
import { FormsModule } from "@angular/forms";
import { convertToStates, simulationToStateUIarray, StateUI, stateUIarrayToTransitionFromRules } from "./ui-adapter";
import { ToStateEditor } from "./to-state-editor/to-state-editor";
import { ALL_STATES } from "./editor.token";
import { LucideTrash2, LucidePlus, LucideHammer, LucideSave, LucideUndo2, LucideCircleX, LucideCircleCheck, LucideCircleQuestionMark  } from '@lucide/angular';
import { ModalService } from "@core/modal/ModalService";
import { HelpDialog } from "@shared/help-dialog/help-dialog";

@Component({
  selector: "editor",
  imports: [FormsModule, ToStateEditor, LucideTrash2, LucidePlus, LucideHammer,
    LucideSave, LucideUndo2, LucideCircleX, LucideCircleCheck, LucideCircleQuestionMark],
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
  persistedSimulation = input<boolean>();
  
  states: StateUI[]=[];

  selectedStateIndex: number|null=null;
  
  errorMode: "neutral"|"success"|"fail" = "neutral";
  errorMessage: string|null = null;

  compiled= output<void>();

  saved= output<void>();
  reverted= output<void>();

  @ViewChild('messageDiv')
  private messageDiv?: ElementRef<HTMLDivElement>;

  private modalService= inject(ModalService);
  
  constructor(private cdr: ChangeDetectorRef, private injector: Injector){

    effect(() => {
      this.states = simulationToStateUIarray(this.simulationState());
      this.selectedStateIndex= this.states[0] ? 0 : null;
    });
    
  }

  ngOnInit(): void {
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

    afterNextRender(
      () => {
        this.messageDiv?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start'});
      },
      { injector: this.injector }
    );
  }

  compile(rules: TransitionFromRule){
    try{
      const tempStates : State[]= convertToStates(this.states);
      
      this.simulationState()?.setRules(rules, tempStates);
      this.errorMode="success";      
      this.errorMessage=null;
      setTimeout(()=>{
        this.errorMode="neutral";
        this.cdr.detectChanges();
      }, 2500);
      //Emit successful compilation event
      this.compiled.emit();
    }catch(e: any){
      this.errorMode="fail";      
      this.errorMessage=e.message;
    }
  }

  selectState(index: number){
    this.selectedStateIndex=index;
  }
  
  addState(){    
    this.states.push({_id: uuidv4(), color: "#000000", weight: 0 ,rules: []});
    this.selectedStateIndex= this.states.length-1;
  }

  deleteState(id: string){
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

  help(){
    this.modalService.open({
      component: HelpDialog,
    });
  }
}
