
import { Injectable } from '@angular/core';
import { OpenFeature } from '@openfeature/web-sdk';
import { UnleashWebProvider } from '@openfeature/unleash-web-provider';
import { environment } from '../environments/environment';

export interface ClientContext {
  userId?: string;
  properties?: { clientId?: string; plan?: string };
}

@Injectable({ providedIn: 'root' })
export class OpenFeatureProviderService {
  private ctx: ClientContext = {
    userId: 'alice@example.com',
    properties: { clientId: 'customer-123', plan: 'free' },
  };

  async init() { await this.setContext(this.ctx); }

  async setContext(ctx: ClientContext) {
    this.ctx = ctx;
    console.log(ctx);
    const provider = new UnleashWebProvider({
      url: environment.unleash.url,
      clientKey: environment.unleash.clientKey,
      appName: environment.unleash.appName,
      context: this.ctx,
    });
    await OpenFeature.setProviderAndWait(provider);
  }

  get current(): ClientContext { return this.ctx; }
}
