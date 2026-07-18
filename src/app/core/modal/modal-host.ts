import { ChangeDetectorRef, Component } from "@angular/core";
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

  constructor(private modalService: ModalService, private cdr: ChangeDetectorRef) {
    this.modalService.modalState$.subscribe(config => {
      this.modalConfig = config;

      if (config) {
        this.componentInputs= {...config.inputs};
      }

      //In case service is called in async,
      //the change detection may happen before data update leading to UI not updating.
      //Following ensures that its checked
      this.cdr.markForCheck();
    });
  }
}
