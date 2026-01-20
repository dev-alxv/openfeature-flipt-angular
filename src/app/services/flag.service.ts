import { Injectable, OnDestroy } from '@angular/core';
import { OpenFeature } from '@openfeature/web-sdk';
import { BehaviorSubject, Observable, interval, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface FeatureFlags {
  newHomeUI: boolean;
  oldFeatureA: boolean;
  oldFeatureB: boolean;
  newRevenueChart: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FlagService implements OnDestroy {
  private flags = new BehaviorSubject<FeatureFlags>({
    newHomeUI: false,
    oldFeatureA: false,
    oldFeatureB: false,
    newRevenueChart: false
  });

  public isFlagsReady = false;
  public flags$: Observable<FeatureFlags>;
  private pollingSubscription: Subscription | null = null;
  private pollingInterval = 1500; // 1.5 seconds

  constructor() {
    this.logFlags('FlagService initialized');
    // Emit flags on every change (or keep previous if same reference)
    this.flags$ = this.flags.asObservable();
  }

  public startPolling(): void {
    if (this.pollingSubscription) {
      console.log('⏱️ Polling already running');
      return;
    }
    console.log(`⏱️ Starting snapshot polling every ${this.pollingInterval}ms`);
    
    let pollCount = 0;
    this.pollingSubscription = interval(this.pollingInterval).subscribe(() => {
      pollCount++;
      console.log(`📡 Poll #${pollCount} - Fetching snapshot...`);
      
      try {
        // Use provider evaluation (respects full context) instead of snapshot
        this.refreshFlags().catch(err => console.error('Refresh error:', err));
      } catch (err) {
        console.error('Polling error:', err);
      }
    });
  }

  stopPolling(): void {
    if (this.pollingSubscription) {
      console.log('⏹️ Stopping flag polling');
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
  }

  setPollingInterval(intervalMs: number): void {
    console.log(`⏱️ Setting polling interval to ${intervalMs}ms`);
    this.stopPolling();
    this.pollingInterval = intervalMs;
    this.startPolling();
  }

  private logFlags(context: string): void {
    const currentFlags = this.flags.value;
    console.group(`🚩 Feature Flags - ${context}`);
    console.log('newHomeUI:', currentFlags.newHomeUI);
    console.log('oldFeatureA:', currentFlags.oldFeatureA);
    console.log('oldFeatureB:', currentFlags.oldFeatureB);
    console.log('newRevenueChart:', currentFlags.newRevenueChart);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
  }

  async refreshFlags(): Promise<void> {
    try {
      const client = OpenFeature.getClient();
      console.group('🔍 DEBUG: Fetching flags from Flipt');
      
      // Get current context or use default, and normalize entityId/targetingKey
      const rawContext = OpenFeature.getContext() || {};
      const entityId = (rawContext as any).targetingKey || (rawContext as any).userId || 'client-1';
      const context = {
        ...rawContext,
        entityId,
        targetingKey: (rawContext as any).targetingKey || entityId,
        userId: (rawContext as any).userId || entityId,
        plan: (rawContext as any).plan || 'premium',
        tenant: (rawContext as any).tenant || 'enterprise'
      } as Record<string, any>;

      // Ensure provider receives normalized context
      await OpenFeature.setContext(context);
      
      console.log('Using evaluation context:', context);
      
      const [newHomeUIDetails, oldFeatureADetails, oldFeatureBDetails, newRevenueChartDetails] = await Promise.all([
        client.getBooleanDetails('newHomeUI', false),
        client.getBooleanDetails('oldFeatureA', false),
        client.getBooleanDetails('oldFeatureB', false),
        client.getBooleanDetails('newRevenueChart', false)
      ]);

      console.log('Raw evaluation results:');
      console.log('  newHomeUI:', newHomeUIDetails);
      console.log('  oldFeatureA:', oldFeatureADetails);
      console.log('  oldFeatureB:', oldFeatureBDetails);
      console.log('  newRevenueChart:', newRevenueChartDetails);
      console.groupEnd();

      const newHomeUI = newHomeUIDetails.value;
      const oldFeatureA = oldFeatureADetails.value;
      const oldFeatureB = oldFeatureBDetails.value;
      const newRevenueChart = newRevenueChartDetails.value;

      const oldFlags = this.flags.value;
      const newFlags = { newHomeUI, oldFeatureA, oldFeatureB, newRevenueChart };

      // Check for changes
      const hasChanges = 
        oldFlags.newHomeUI !== newHomeUI ||
        oldFlags.oldFeatureA !== oldFeatureA ||
        oldFlags.oldFeatureB !== oldFeatureB ||
        oldFlags.newRevenueChart !== newRevenueChart;
      if (hasChanges) {
        console.warn('⚠️ Flag changes detected:');
        if (oldFlags.newHomeUI !== newHomeUI) console.log(`  newHomeUI: ${oldFlags.newHomeUI} → ${newHomeUI}`);
        if (oldFlags.oldFeatureA !== oldFeatureA) console.log(`  oldFeatureA: ${oldFlags.oldFeatureA} → ${oldFeatureA}`);
        if (oldFlags.oldFeatureB !== oldFeatureB) console.log(`  oldFeatureB: ${oldFlags.oldFeatureB} → ${oldFeatureB}`);
        if (oldFlags.newRevenueChart !== newRevenueChart) console.log(`  newRevenueChart: ${oldFlags.newRevenueChart} → ${newRevenueChart}`);
      }

      this.flags.next(newFlags);
      this.isFlagsReady = true; // Mark flags as ready after first fetch
      if (hasChanges) {
        this.logFlags('Flags Refreshed - Changes Applied');
      } else {
        this.logFlags('Flags Refreshed - No Changes');
      }
    } catch (error) {
      console.error('❌ Failed to refresh flags:', error);
    }
  }

  async fetchSnapshot(entityId: string): Promise<void> {
    try {
      console.group('📸 Fetching Flipt Snapshot');
      console.log('Entity ID:', entityId);
      console.log('Namespace:', environment.flipt.namespace);
      
      const snapshotUrl = `${environment.flipt.url}/internal/v1/evaluation/snapshot/namespace/${environment.flipt.namespace}?entityId=${encodeURIComponent(entityId)}`;
      console.log('Snapshot URL:', snapshotUrl);
      
      const response = await fetch(snapshotUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Snapshot fetch failed: ${response.status} ${response.statusText}`);
      }

      const snapshot = await response.json();
      console.log('Snapshot received:', snapshot);

      // Extract flags from snapshot - it's an array
      const flags: Partial<FeatureFlags> = {};
      
      console.log('Snapshot.flags type:', typeof snapshot.flags);
      console.log('Snapshot.flags is array:', Array.isArray(snapshot.flags));
      console.log('Snapshot.flags content:', snapshot.flags);
      
      if (Array.isArray(snapshot.flags)) {
        console.log('✅ Processing flags as array');
        for (const flagData of snapshot.flags) {
          console.log(`Processing flag:`, flagData);
          console.log(`  key=${flagData.key}, enabled=${flagData.enabled}, variant=${flagData.variant}`);
          if (flagData.key === 'newHomeUI' || flagData.key === 'oldFeatureA' || flagData.key === 'oldFeatureB') {
            flags[flagData.key as keyof FeatureFlags] = flagData.enabled;
            console.log(`  ✓ Set ${flagData.key} = ${flagData.enabled}`);
          }
        }
      }

      const newFlags: FeatureFlags = {
        newHomeUI: flags.newHomeUI ?? false,
        oldFeatureA: flags.oldFeatureA ?? false,
        oldFeatureB: flags.oldFeatureB ?? false,
        newRevenueChart: flags.newRevenueChart ?? false
      };

      const oldFlags = this.flags.value;
      
      // Check for changes
      const hasChanges = 
        oldFlags.newHomeUI !== newFlags.newHomeUI ||
        oldFlags.oldFeatureA !== newFlags.oldFeatureA ||
        oldFlags.oldFeatureB !== newFlags.oldFeatureB;

      if (hasChanges) {
        console.warn('🔔 Flipt Snapshot Changes Detected:');
        if (oldFlags.newHomeUI !== newFlags.newHomeUI) console.log(`  newHomeUI: ${oldFlags.newHomeUI} → ${newFlags.newHomeUI}`);
        if (oldFlags.oldFeatureA !== newFlags.oldFeatureA) console.log(`  oldFeatureA: ${oldFlags.oldFeatureA} → ${newFlags.oldFeatureA}`);
        if (oldFlags.oldFeatureB !== newFlags.oldFeatureB) console.log(`  oldFeatureB: ${oldFlags.oldFeatureB} → ${newFlags.oldFeatureB}`);
      }

      console.log('Parsed flags:', newFlags);
      console.groupEnd();

      // Always emit to notify subscribers
      this.flags.next({...newFlags});
      this.isFlagsReady = true;
      
      if (hasChanges) {
        this.logFlags('Snapshot Updated - Changes Applied');
      } else {
        console.log('📊 Snapshot polled - no changes');
      }
    } catch (error) {
      console.error('❌ Failed to fetch snapshot:', error);
      if (!this.isFlagsReady) {
        this.isFlagsReady = false;
      }
    }
  }

  getFlags(): FeatureFlags {
    const flags = this.flags.value;
    console.debug('📋 Getting flags:', flags);
    return flags;
  }

  isFeatureEnabled(flagName: keyof FeatureFlags): boolean {
    const flags = this.flags.value;
    const value = flags[flagName];
    const isEnabled = typeof value === 'boolean' ? value : false;
    console.debug(`✅ Checking flag '${flagName}':`, isEnabled);
    return isEnabled;
  }

  getFlagValue(flagName: keyof FeatureFlags): any {
    const value = this.flags.value[flagName];
    console.debug(`📊 Getting value for '${flagName}':`, value);
    return value;
  }

  async testConnection(): Promise<void> {
    console.group('🔍 Testing Flipt Connection');
    try {
      const client = OpenFeature.getClient();
      console.log('Client:', client);
      
      const currentContext = await OpenFeature.getContext();
      console.log('Current context:', currentContext);
      
      // Try to fetch a simple boolean flag with full details
      const testResult = await client.getBooleanDetails('test-flag', false);
      console.log('Test flag result:', testResult);
      console.log('✅ Connection successful');
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
    }
    console.groupEnd();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }
}
