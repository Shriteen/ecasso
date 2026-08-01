import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalHost } from '@core/modal/modal-host';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ModalHost],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
