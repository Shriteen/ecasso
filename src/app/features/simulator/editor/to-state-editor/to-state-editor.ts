import { Component, EventEmitter, input, Output } from "@angular/core";
import { StateUI, ToStateRulesUI } from "../ui-adapter";
import { JsonPipe } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-to-state-editor",
  imports: [JsonPipe, FormsModule],
  templateUrl: "./to-state-editor.html",
  styleUrl: "./to-state-editor.css",
})
export class ToStateEditor {
  toState = input.required<ToStateRulesUI>();
  availableStates = input<StateUI[]>([]);
  
  @Output() deleted= new EventEmitter<string>()

  delete(){
    this.deleted.emit(this.toState()._id);
  }
}
