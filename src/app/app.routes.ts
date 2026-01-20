import { Routes } from '@angular/router';
export const routes: Routes = [
 {path:'',loadComponent:()=>import('./pages/home/home.component').then(m=>m.HomeComponent)},
 {path:'admin',loadComponent:()=>import('./pages/admin/admin.component').then(m=>m.AdminComponent)},
 {path:'experiments',loadComponent:()=>import('./pages/experiments/experiments.component').then(m=>m.ExperimentsComponent)},
];