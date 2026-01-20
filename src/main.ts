import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { initFlags } from './app/openfeature/init-openfeature';
import { FlagService } from './app/services/flag.service';

async function main() {
  try {
    console.log('🚀 Application startup');
    const flagService = new FlagService();
    
    console.log('⏳ Initializing OpenFeature...');
    await initFlags(flagService);
    
    console.log('✅ Flags loaded, starting polling');
    flagService.startPolling();
    
    console.log('📱 Bootstrapping application');
    bootstrapApplication(AppComponent, {
      providers: [
        provideRouter(routes),
        { provide: FlagService, useValue: flagService }
      ]
    });
  } catch (error) {
    console.error('❌ Failed to initialize application:', error);
    throw error;
  }
}

main();