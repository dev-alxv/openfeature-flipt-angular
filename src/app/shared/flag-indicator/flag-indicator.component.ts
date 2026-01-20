import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenFeature } from '@openfeature/web-sdk';

@Component({
  selector:'app-flag-indicator',
  template:`
    <div class="flag-item" [class.changing]="isChanging">
      <span class="flag-label">🚩 {{flag}}</span>
      <span class="flag-value" [ngClass]="''+value">{{value}}</span>
    </div>
  `,
  standalone:true,
  imports:[CommonModule]
})
export class FlagIndicatorComponent implements OnInit, OnDestroy{
 @Input() flag=''; 
 value: boolean | string = '';
 isChanging = false;
 private intervalId: any;
 private lastValue: any;
 
 async ngOnInit(){ 
  await this.evaluateFlag();
  // Re-evaluate every 500ms to pick up context changes quickly
  this.intervalId = setInterval(() => this.evaluateFlag(), 500);
 }
 
 ngOnDestroy() {
  if (this.intervalId) clearInterval(this.intervalId);
 }
 
 private async evaluateFlag() {
  try {
    const client = OpenFeature.getClient();
    const newValue = await client.getBooleanValue(this.flag, false);
    
    // Show animation when value changes
    if (newValue !== this.lastValue) {
      console.log(`✓ [${this.flag}] Changed: ${this.lastValue} → ${newValue}`);
      this.isChanging = true;
      setTimeout(() => this.isChanging = false, 600);
      this.lastValue = newValue;
    }
    
    this.value = newValue;
  } catch (error) {
    console.error(`Error evaluating flag ${this.flag}:`, error);
    this.value = 'error';
  }
 }
}