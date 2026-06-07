import { AfterViewInit, Component, ElementRef, input, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import Simulation from "@shared/models/Simulation.model";

@Component({
  selector: "viewer",
  imports: [FormsModule],
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
  intervalList = [
    {label:"0.1x", value: 1000},
    {label:"0.25x", value: 400},
    {label:"0.5x", value: 200},
    {label:"1x", value: 100},
    {label:"2x", value: 50},
    {label:"10x", value: 10}
  ];

  zoom= 1;
  
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

  updateTimer(interval: number){
    this.pause();
    this.interval=interval;
    this.play();
  }
  
  zoomIn(factor: number){
    this.zoom= Math.min(this.zoom*factor, 10);
  }
  zoomOut(factor: number){
    this.zoom= Math.max(this.zoom*factor, 0.3);
  }
  zoomReset(){
    this.zoom=1;
  }
  onWheel(event: WheelEvent){
    // ctrlKey is true for pinches. 
    if (event.ctrlKey) {
      event.preventDefault();

      if(event.deltaY < 0)
        this.zoomIn(1.05);
      else
        this.zoomOut(0.95);
    }
  }
}
