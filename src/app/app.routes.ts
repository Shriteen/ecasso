import { Routes } from '@angular/router';
import { Home } from '@features/home/home';
import { Simulator } from '@features/simulator/simulator';

export const routes: Routes = [
  {path: "", component: Home},
  {path: "simulation/:id", component: Simulator}
];
