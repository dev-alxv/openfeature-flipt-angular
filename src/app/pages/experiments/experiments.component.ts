import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenFeature } from '@openfeature/web-sdk';
@Component({
  selector:'app-experiments',
  template:`
    <div class="card">
      <h1>🧪 Experiments</h1>
      <p>Track different UI variants using the <strong>uiVariant</strong> flag.</p>
      <div style="margin-top: 2rem;">
        <div class="flag-item">
          <span class="flag-label">🎨 Current Variant</span>
          <span class="flag-value" [ngClass]="''+variant" style="min-width: 120px; text-align: center;">{{variant}}</span>
        </div>
      </div>
      <div style="margin-top: 2rem; padding: 1rem; background: #f0f4ff; border-radius: 6px;">
        <strong>Available Variants:</strong>
        <ul style="margin: 0.5rem 0 0 1.5rem;">
          <li>control - Standard UI</li>
          <li>variant-a - Experimental design A</li>
          <li>variant-b - Experimental design B</li>
        </ul>
      </div>
    </div>
  `,
  standalone:true,
  imports:[CommonModule]
})
export class ExperimentsComponent implements OnInit, OnDestroy{
 variant='';
 private intervalId: any;
 
 async ngOnInit(){ 
  await this.evaluateVariant();
  // Re-evaluate variant every 500ms
  this.intervalId = setInterval(() => this.evaluateVariant(), 500);
 }
 
 ngOnDestroy() {
  if (this.intervalId) clearInterval(this.intervalId);
 }
 
 private async evaluateVariant() {
  this.variant = await OpenFeature.getClient().getStringValue('uiVariant','control');
  console.log('uiVariant evaluated to:', this.variant);
 }
}