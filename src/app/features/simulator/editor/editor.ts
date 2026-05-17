import { ChangeDetectorRef, Component, EventEmitter, input, Output } from "@angular/core";
import Simulation from "@shared/models/Simulation.model";
import { TransitionFromRule } from "@shared/types";

@Component({
  selector: "editor",
  imports: [],
  templateUrl: "./editor.html",
  styleUrl: "./editor.css",
})
export class Editor {
  simulationState = input<Simulation>();

  errorMode: "neutral"|"success"|"fail" = "neutral";
  errorMessage: string|null = null;

  constructor(private cdr: ChangeDetectorRef){
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
      this.simulationState()?.setRules(rules);
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
  
  
}
