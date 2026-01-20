import { OpenFeature } from '@openfeature/web-sdk';
import { FliptWebProvider } from '@openfeature/flipt-web-provider';
import { environment } from '../../environments/environment';
import { FlagService } from '../services/flag.service';

export async function initFlags(flagService?: FlagService){
  try {
    console.group('🔧 DEBUG: Initializing OpenFeature with Flipt');
    console.log('Environment:', environment);
    console.log('Flipt URL:', environment.flipt.url);
    console.log('Flipt Namespace:', environment.flipt.namespace);
    console.groupEnd();
    
    const provider = new FliptWebProvider(environment.flipt.namespace, {
      url: environment.flipt.url
    });
    
    console.log('🔌 Provider created:', provider);
    
    console.log('⏳ Setting provider...');
    await OpenFeature.setProvider(provider);
    console.log('✅ Provider set successfully');
    
    // Set default context on app launch
    const defaultContext = {
      targetingKey: 'client-1',
      userId: 'client-1',
      plan: 'premium',
      tenant: 'enterprise'
    };
    
    console.group('🎯 Setting Evaluation Context');
    console.log('Context:', defaultContext);
    await OpenFeature.setContext(defaultContext);
    console.log('✅ Context set successfully');
    console.groupEnd();
    
    // Test connection with a simple flag evaluation
    console.group('🧪 Testing Flag Evaluation');
    const client = OpenFeature.getClient();
    console.log('Client obtained:', client);
    
    try {
      const testFlag = await client.getBooleanDetails('newHomeUI', false);
      console.log('Test flag evaluation result:', testFlag);
      console.log('  - Value:', testFlag.value);
      console.log('  - Reason:', testFlag.reason);
      console.log('  - Flag Key:', testFlag.flagKey);
    } catch (evalError) {
      console.error('❌ Flag evaluation failed:', evalError);
    }
    console.groupEnd();
    
    console.log('✓ OpenFeature Flipt provider initialized successfully');
    
    // Fetch snapshot through service if provided
    if (flagService) {
      console.log('📸 Fetching initial snapshot...');
      await flagService.fetchSnapshot(defaultContext.targetingKey);
    }
    
  } catch (error) {
    console.error('✗ Failed to initialize OpenFeature:', error);
    throw error;
  }
}