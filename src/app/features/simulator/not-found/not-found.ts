import { Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { SimulationService } from "@shared/services/simulation-service";

@Component({
  selector: "app-not-found",
  imports: [RouterLink],
  templateUrl: "./not-found.html",
  styleUrl: "./not-found.css",
})
export class NotFound {
  simulationService= inject(SimulationService);

  constructor(private router: Router ){}
  
  newSimulation(){
    const id= this.simulationService.create();
    this.router.navigate(['/simulation', id]);
  }
  
}
