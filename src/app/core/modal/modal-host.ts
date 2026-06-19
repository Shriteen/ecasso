import { Component } from "@angular/core";
import { ModalConfig, ModalService } from "./ModalService";
import { NgComponentOutlet } from "@angular/common";

@Component({
  selector: "app-modal-host",
  imports: [NgComponentOutlet],
  templateUrl: "./modal-host.html",
  styleUrl: "./modal-host.css",
})
export class ModalHost {

  modalConfig: ModalConfig | null = null;
  componentInputs: Record<string, any> = {};

  constructor(private modalService: ModalService) {
    this.modalService.modalState$.subscribe(config => {
      this.modalConfig = config;

      if (config) {
        this.bindInputs(config);
      }
    });
  }

  bindInputs(config: ModalConfig){
    this.componentInputs= {
      ...config.inputs,
      _close: ()=> this.close()
    }
  }

  close(){
    this.modalConfig=null;
    this.componentInputs={};
  }
}
