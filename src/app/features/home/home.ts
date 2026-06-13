import { Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { SimulationService } from "@shared/services/simulation-service";

@Component({
  selector: "app-home",
  imports: [RouterLink],
  templateUrl: "./home.html",
  styleUrl: "./home.css",
})
export class Home {
  
  simulationService= inject(SimulationService);
  list= this.simulationService.getAll();

  constructor(private router: Router ){
  }
  
  newSimulation(){
    const id= this.simulationService.create();
    this.router.navigate(['/simulation', id]);
  }
}
