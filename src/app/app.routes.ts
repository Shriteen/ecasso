import { Routes } from '@angular/router';
import { Home } from '@features/home/home';
import { NotFound } from '@features/simulator/not-found/not-found';
import { Simulator } from '@features/simulator/simulator';

export const routes: Routes = [
  {path: "", component: Home},
  {path: "simulation/error", component: NotFound},
  {path: "simulation/:id", component: Simulator}
];
