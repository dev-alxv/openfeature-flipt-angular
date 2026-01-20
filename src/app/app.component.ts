import { Component } from '@angular/core';
import { LayoutComponent } from './layout/layout.component';
@Component({selector:'app-root',template:`<app-layout></app-layout>`,standalone:true,imports:[LayoutComponent]})
export class AppComponent {}