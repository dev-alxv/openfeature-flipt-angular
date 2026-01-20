
// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { FormsModule } from '@angular/forms';

// import { OpenFeatureModule } from '@openfeature/angular-sdk';
// import { UnleashWebProvider } from '@openfeature/unleash-web-provider';

// import { AppComponent } from './app.component';
// import { DashboardComponent } from './dashboard.component';
// import { environment } from 'src/environments/environment';

// const initialProvider = new UnleashWebProvider({
//   url: environment.unleash.url,
//   clientKey: environment.unleash.clientKey,
//   appName: environment.unleash.appName,
//   context: { userId: 'alice@example.com', properties: { clientId: 'customer-123', plan: 'pro' } },
// });

// @NgModule({
//   declarations: [AppComponent, DashboardComponent],
//   imports: [BrowserModule, FormsModule, OpenFeatureModule.forRoot({ provider: initialProvider })],
//   bootstrap: [AppComponent],
// })
// export class AppModule {}
