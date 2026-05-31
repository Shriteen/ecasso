import { Component, computed, EventEmitter, inject, input, Output } from "@angular/core";
import { v4 as uuidv4 } from 'uuid'; 
import { ConditionUI } from "../ui-adapter";
import { FormsModule } from "@angular/forms";
import { CONDITION_LABELS, CONDITION_OFFSET, DIRECTION_LABELS } from "@shared/constants";
import { KeyValuePipe } from "@angular/common";
import { ALL_STATES } from "../editor.token";
import { ToggleGroupButtons } from "@core/toggle-group-buttons/toggle-group-buttons";

@Component({
  selector: "condition-editor",
  imports: [FormsModule, KeyValuePipe, ToggleGroupButtons],
  templateUrl: "./condition-editor.html",
  styleUrl: "./condition-editor.css",
})
export class ConditionEditor {
  rule = input.required<ConditionUI>();
  level = input(0);

  @Output() deleted= new EventEmitter<string>()
  
  readonly CONDITION_LABELS=CONDITION_LABELS;
  readonly DIRECTION_LABELS=DIRECTION_LABELS;
  readonly indent= CONDITION_OFFSET

  getStates= inject(ALL_STATES);

  ngOnInit(){
    //Default to MOORE
    if(!this.rule().adjacency){
      this.rule().adjacency="MOORE";
    }
    //Initialize stateId from text
    if(this.rule().state){
      const state = this.getStates().find(s => s.name === this.rule().state);

      if (state) {
        this.rule()._stateId = state?._id;
      }
    }
  }
  
  addChildCondtion(){
    //Ensure children array
    if(!this.rule().children){
      this.rule().children=[];
    }

    this.rule().children?.push({_id: uuidv4(), adjacency: "MOORE" });
  }

  deleteCondtion(){
    this.deleted.emit(this.rule()._id);
  }

  deleteChildCondition(id: string){
    const rule=this.rule(); 
    if(rule.children){
      rule.children= rule.children.filter(c=>c._id!=id);
    }
  }

  onConditionChange(value: string){
    //If not composite, delete children
    if(!(value=="AND" || value=="OR")){
      delete this.rule().children;
    }

    //If composite, ensure atleast 1 condition
    if((value=="AND" || value=="OR") && !(this.rule().children?.length)){
      this.addChildCondtion();
    }

  }

  onStateChange(stateId: string){
    const state = this.getStates().find(s => s._id === stateId);

    if (state) {
      this.rule().state = state.name;
    }
  }
}
