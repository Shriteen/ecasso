import { ChangeDetectorRef, Component } from "@angular/core";
import { ModalService } from "@core/modal/ModalService";
import { SimulationService } from "@shared/services/simulation-service";

@Component({
  selector: "app-import-dialog",
  imports: [],
  templateUrl: "./import-dialog.html",
  styleUrl: "./import-dialog.css",
})
export class ImportDialog{

  fileToImport: File | null = null;
  errorMessage: string | null =null;
  
  modalService: ModalService;
  
  constructor(private simulationService: SimulationService, modalService:ModalService, private cdr: ChangeDetectorRef){
    this.modalService=modalService;    
  }

  handleFileInput(files?: FileList | null){
    this.fileToImport = files?.item(0) ?? null;
  }

  async import(){
    
    try {
      if(this.fileToImport){
        await this.simulationService.import(this.fileToImport);
        this.modalService.close();
      }
    } catch (error) {
      if(error instanceof Error){
        this.errorMessage= error.message;
        this.cdr.markForCheck()
      }
      console.error(error);
    }    
  }
}
