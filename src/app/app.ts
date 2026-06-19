import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalHost } from '@core/modal/modal-host';
import { Simulator } from '@features/simulator/simulator';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Simulator, ModalHost],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
