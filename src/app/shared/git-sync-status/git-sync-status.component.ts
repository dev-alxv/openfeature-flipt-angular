import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GitSyncService, GitSyncStatus } from '../../services/git-sync.service';

@Component({
  selector: 'app-git-sync-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="git-sync-container" *ngIf="gitSyncStatus$ | async as status">
      <div class="sync-badge" [ngClass]="status.syncStatus" [style.background-color]="getStatusColor(status.syncStatus)">
        <span class="icon">{{ getStatusIcon(status.syncStatus) }}</span>
        <span class="status-text">{{ status.syncStatus | titlecase }}</span>
      </div>
      
      <div class="sync-details" *ngIf="status.repository">
        <div class="detail-item">
          <span class="label">Repository:</span>
          <span class="value">{{ status.repository }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Branch:</span>
          <span class="value">{{ status.branch }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Poll Interval:</span>
          <span class="value">{{ status.pollInterval }}</span>
        </div>
        <div class="detail-item" *ngIf="status.lastSyncTime">
          <span class="label">Last Sync:</span>
          <span class="value">{{ status.lastSyncTime | date:'short' }}</span>
        </div>
        <div class="detail-item error" *ngIf="status.errorMessage">
          <span class="label">Error:</span>
          <span class="value">{{ status.errorMessage }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .git-sync-container {
      padding: 12px;
      background-color: #f8f9fa;
      border-radius: 6px;
      border-left: 4px solid #6C757D;
      margin: 10px 0;
    }

    .sync-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border-radius: 4px;
      color: white;
      font-weight: 600;
      margin-bottom: 10px;
      font-size: 14px;
    }

    .sync-badge .icon {
      font-size: 18px;
    }

    .sync-details {
      display: grid;
      gap: 8px;
      margin-top: 10px;
      font-size: 13px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .detail-item.error {
      color: #DC3545;
    }

    .label {
      font-weight: 600;
      color: #495057;
      min-width: 100px;
    }

    .value {
      color: #212529;
      word-break: break-all;
    }

    .detail-item.error .value {
      color: #DC3545;
    }
  `]
})
export class GitSyncStatusComponent implements OnInit {
  gitSyncStatus$ = this.gitSyncService.gitSyncStatus$;

  constructor(private gitSyncService: GitSyncService) {}

  ngOnInit(): void {
    console.log('🔧 Git Sync Status Component initialized');
  }

  getStatusIcon(status: string): string {
    return this.gitSyncService.getStatusIcon(status);
  }

  getStatusColor(status: string): string {
    return this.gitSyncService.getStatusColor(status);
  }
}
