
// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser'; // ✅ from platform-browser
import { importProvidersFrom } from '@angular/core';             // ✅ from core
import { FormsModule } from '@angular/forms';

import { OpenFeatureModule } from '@openfeature/angular-sdk';
import { UnleashWebProvider } from '@openfeature/unleash-web-provider';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';

const unleashProvider = new UnleashWebProvider({
  url: environment.unleash.url,
  clientKey: environment.unleash.clientKey,
  appName: environment.unleash.appName,
  context: {
    userId: 'alice@example.com',
    properties: { clientId: 'customer-123', plan: 'free' },
  },
});

bootstrapApplication(AppComponent, {
  providers: [
    // Make Angular SDK + provider available app-wide
    importProvidersFrom(OpenFeatureModule.forRoot({ provider: unleashProvider })),
    importProvidersFrom(FormsModule)
  ],
}).catch(err => console.error(err));