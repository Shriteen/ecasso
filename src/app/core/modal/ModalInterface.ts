import { Component, input } from "@angular/core";

@Component({
  template: ""
})
export default class ModalInterface{
  _close = input<() => void>();
}
