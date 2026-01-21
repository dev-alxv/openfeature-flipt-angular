import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface GitSyncStatus {
  enabled: boolean;
  repository?: string;
  branch?: string;
  lastSyncTime?: Date;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  errorMessage?: string;
  pollInterval?: string;
}

/**
 * GitSyncService manages git synchronization status for Flipt v2
 * 
 * Flipt v2 supports syncing flag state to and from a remote git repository.
 * This service tracks the sync status and provides UI updates.
 * 
 * Configuration example:
 * ```yaml
 * storage:
 *   remote:
 *     type: git
 *     git:
 *       repository: "https://github.com/flipt-io/example.git"
 *       branch: "main"
 *       poll_interval: "30s"
 *       fetch_policy: "strict"
 *       credentials: "github"
 *       backend:
 *         type: memory
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class GitSyncService {
  private readonly gitSyncStatus = new BehaviorSubject<GitSyncStatus>({
    enabled: true,
    repository: 'https://github.com/flipt-io/example.git',
    branch: 'main',
    syncStatus: 'idle',
    pollInterval: '30s'
  });

  public gitSyncStatus$ = this.gitSyncStatus.asObservable();

  constructor() {
    this.logGitSyncStatus('GitSyncService initialized');
    this.simulateGitSync();
  }

  /**
   * Get current git sync status
   */
  public getStatus(): GitSyncStatus {
    return this.gitSyncStatus.value;
  }

  /**
   * Update git sync status (typically called by backend)
   */
  public updateStatus(status: Partial<GitSyncStatus>): void {
    const current = this.gitSyncStatus.value;
    this.gitSyncStatus.next({ ...current, ...status });
    this.logGitSyncStatus('Git sync status updated', status);
  }

  /**
   * Mark sync as starting
   */
  public startSync(): void {
    this.updateStatus({
      syncStatus: 'syncing',
      lastSyncTime: new Date()
    });
    console.log('🔄 Git sync started');
  }

  /**
   * Mark sync as successful
   */
  public syncSuccess(): void {
    this.updateStatus({
      syncStatus: 'success',
      errorMessage: undefined,
      lastSyncTime: new Date()
    });
    console.log('✅ Git sync successful');
  }

  /**
   * Mark sync as failed
   */
  public syncError(error: string): void {
    this.updateStatus({
      syncStatus: 'error',
      errorMessage: error,
      lastSyncTime: new Date()
    });
    console.error('❌ Git sync error:', error);
  }

  /**
   * Simulate periodic git sync (for demo purposes)
   * In production, this would be driven by Flipt backend events
   */
  private simulateGitSync(): void {
    setInterval(() => {
      const current = this.gitSyncStatus.value;
      if (current.syncStatus === 'idle') {
        // Randomly trigger sync to simulate polling
        if (Math.random() > 0.7) {
          this.startSync();
          setTimeout(() => {
            if (Math.random() > 0.1) {
              this.syncSuccess();
            } else {
              this.syncError('Failed to fetch from remote repository');
            }
          }, 2000);
        }
      }
    }, 15000); // Check every 15 seconds
  }

  /**
   * Log git sync status changes
   */
  private logGitSyncStatus(message: string, data?: any): void {
    console.group(`📦 ${message}`);
    console.log('Status:', this.gitSyncStatus.value);
    if (data) {
      console.log('Details:', data);
    }
    console.groupEnd();
  }

  /**
   * Get sync status icon
   */
  public getStatusIcon(status: string): string {
    switch (status) {
      case 'syncing':
        return '⏳';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'idle':
      default:
        return '⏸️';
    }
  }

  /**
   * Get sync status color (for UI styling)
   */
  public getStatusColor(status: string): string {
    switch (status) {
      case 'syncing':
        return '#FFA500'; // Orange
      case 'success':
        return '#28A745'; // Green
      case 'error':
        return '#DC3545'; // Red
      case 'idle':
      default:
        return '#6C757D'; // Gray
    }
  }
}
