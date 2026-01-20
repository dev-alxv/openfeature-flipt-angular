
import { Component } from '@angular/core';
import { BooleanFeatureFlagDirective, NumberFeatureFlagDirective, StringFeatureFlagDirective, ObjectFeatureFlagDirective } from '@openfeature/angular-sdk';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    BooleanFeatureFlagDirective,
    NumberFeatureFlagDirective,
    StringFeatureFlagDirective,
    ObjectFeatureFlagDirective
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {}
