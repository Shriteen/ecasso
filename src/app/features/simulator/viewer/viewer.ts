import { AfterViewInit, Component, ElementRef, input, ViewChild } from "@angular/core";
import Simulation from "@shared/models/Simulation.model";

@Component({
  selector: "viewer",
  imports: [],
  templateUrl: "./viewer.html",
  styleUrl: "./viewer.css",
})
export class Viewer implements AfterViewInit {
  simulationState = input<Simulation>();
  width = input<Number>(600);
  height = input<Number>(700);

  @ViewChild('canvas')
  canvasElement!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;

  playState : "running" | "stopped" = "stopped";
  interval: number= 100;
  playIntervalId: number|undefined;
  
  ngAfterViewInit(): void {
    this.ctx = this.canvasElement.nativeElement.getContext("2d")!;

    this.simulationState()?.render(this.ctx);
  }

  step(){
    this.simulationState()?.tick();
    this.simulationState()?.render(this.ctx);    
  }

  reset(){
    this.simulationState()?.reset();
    this.simulationState()?.render(this.ctx);    
  }

  play(){
    this.playState="running";
    this.playIntervalId= setInterval(()=>{
      this.step();
    }, this.interval)
  }
  pause(){
    this.playState="stopped";
    clearInterval(this.playIntervalId);
  }
}
