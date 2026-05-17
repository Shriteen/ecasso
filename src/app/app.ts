import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Simulator } from '@features/simulator/simulator';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Simulator],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
