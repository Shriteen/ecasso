import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Type } from '@angular/core';

export interface ModalConfig {
  component: Type<any>;
  inputs?: Record<string, any>;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalSubject = new Subject<ModalConfig | null>();
  modalState$ = this.modalSubject.asObservable();

  open(config: ModalConfig) {
    this.modalSubject.next(config);
  }

  close() {
    this.modalSubject.next(null);
  }
}
