import { Component, EventEmitter, input, Output } from "@angular/core";
import { JsonPipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { StateUI, ToStateRulesUI } from "../ui-adapter";
import { ConditionEditor } from "../condition-editor/condition-editor";
import { LucideChevronsDownUp, LucideChevronsUpDown, LucideTrash2 } from "@lucide/angular";

@Component({
  selector: "app-to-state-editor",
  imports: [JsonPipe, FormsModule, ConditionEditor, LucideChevronsDownUp, LucideChevronsUpDown, LucideTrash2],
  templateUrl: "./to-state-editor.html",
  styleUrl: "./to-state-editor.css",
})
export class ToStateEditor {
  toState = input.required<ToStateRulesUI>();
  availableStates = input<StateUI[]>([]);

  folded=true;
  
  @Output() deleted= new EventEmitter<string>()

  ngOnInit() {
    //If incomplete auto expand
    const isIncomplete = !this.toState().to || !this.toState().rule.condition;
    this.folded = !isIncomplete;
  }
  
  delete(){
    this.deleted.emit(this.toState()._id);
  }

  toggleFold(){
    this.folded=!this.folded;
  }
}
