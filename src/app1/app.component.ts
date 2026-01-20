
import { Component, OnInit } from '@angular/core';
import { OpenFeatureProviderService } from './openfeature-provider.service';
import { DashboardComponent } from './dashboard.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    DashboardComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  loading = false;
  clientId = 'customer-123';
  plan = 'free';
  userId = 'alice@example.com';

  constructor(private providerSvc: OpenFeatureProviderService) {}

  async ngOnInit() { await this.providerSvc.init(); }

  async apply() {
    this.loading = true;
    await this.providerSvc.setContext({
      userId: this.userId,
      properties: { clientId: this.clientId, plan: this.plan },
    });
    this.loading = false;
  }
}
