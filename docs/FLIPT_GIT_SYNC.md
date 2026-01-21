# Flipt v2 Git Sync Integration

This Angular application now supports Flipt v2's git storage backend, which enables automatic synchronization of feature flags between a remote Git repository and your Flipt instance.

## Overview

Flipt v2 allows you to:
- Store feature flag definitions in a Git repository (infrastructure-as-code)
- Automatically sync changes from Git to Flipt every 30 seconds
- Keep your feature flags version-controlled and auditable
- Use strict fetch policies to validate changes before applying them

## Architecture

### Components

#### 1. **Flipt Backend Configuration** (`flipt/flipt.yml`)
```yaml
storage:
  type: memory
  remote:
    type: git
    git:
      repository: "https://github.com/dev-alxv/openfeature-flipt-angular.git"
      branch: "main"
      poll_interval: "30s"
      fetch_policy: "strict"
      credentials: "github"
      backend:
        type: memory
```

**Configuration Details:**
- **storage.type**: Primary storage engine (memory for fast access)
- **remote.type**: Uses git backend for remote synchronization
- **repository**: GitHub repository URL containing flag definitions
- **branch**: Branch to sync from (main)
- **poll_interval**: How often Flipt checks for changes (30 seconds)
- **fetch_policy**: "strict" validates all changes before applying
- **credentials**: GitHub credentials for authentication
- **backend.type**: In-memory backend for storing synced flags

#### 2. **Feature Flag Definitions** (`flipt/features.yml`)
```yaml
flags:
  - key: newHomeUI
    name: New Home UI
    type: VARIANT_FLAG_TYPE
    enabled: true
    variants:
      - key: enabled
      - key: disabled
    rules:
      - segment: premium-users
        distributions:
          - variant_key: enabled
            rollout: 100
```

This file is:
- Version-controlled in Git
- Automatically synced to Flipt every 30 seconds
- Used to define all feature flags and their rules
- Validated before applying changes

#### 3. **Angular Git Sync Service** (`src/app/services/git-sync.service.ts`)

Service that tracks the status of Git synchronization:

```typescript
interface GitSyncStatus {
  enabled: boolean;
  repository?: string;
  branch?: string;
  lastSyncTime?: Date;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  errorMessage?: string;
  pollInterval?: string;
}
```

**Key Methods:**
- `getStatus()`: Get current sync status
- `startSync()`: Mark sync as starting
- `syncSuccess()`: Mark sync as successful
- `syncError(error)`: Mark sync as failed
- `updateStatus(status)`: Update sync status

#### 4. **Git Sync Status Component** (`src/app/shared/git-sync-status/git-sync-status.component.ts`)

Visual component that displays:
- Current sync status (idle, syncing, success, error)
- Repository URL and branch
- Poll interval
- Last sync time
- Any error messages

Status indicators:
- 🟢 **Success**: Changes synced successfully
- 🟡 **Syncing**: Currently fetching from remote
- 🔴 **Error**: Sync failed with error message
- ⏸️ **Idle**: Waiting for next poll interval

## Workflow

### 1. Update Feature Flags via Git

```bash
# Clone the Flipt flags repository
git clone https://github.com/flipt-io/example.git
cd example

# Edit features.yml with new flags
# For example, enable a new flag:
# - key: darkMode
#   enabled: true

# Commit and push
git add flipt/features.yml
git commit -m "Enable dark mode feature flag"
git push origin main
```

### 2. Flipt Detects and Syncs Changes

1. Flipt polls the Git repository every 30 seconds
2. Detects changes in `flipt/features.yml`
3. Validates changes using "strict" fetch policy
4. Applies valid changes to in-memory storage
5. Angular app receives updated flag values on next evaluation

### 3. Angular App Reflects Changes

```typescript
// Component code
export class MyComponent implements OnInit {
  constructor(private flagService: FlagService) {}
  
  ngOnInit() {
    // Subscribe to flag changes
    this.flagService.flags$.subscribe(flags => {
      // Component automatically updates when flags change
      console.log('Flags updated:', flags);
    });
  }
}
```

## Usage Examples

### Example 1: Enable a Feature for Specific Users

**Git Change:**
```yaml
flags:
  - key: newDashboard
    enabled: true
    rules:
      - segment: beta-testers
        distributions:
          - variant_key: enabled
            rollout: 100
```

**Result:** Feature is automatically enabled for beta testers within 30 seconds

### Example 2: Gradual Rollout

**Git Change:**
```yaml
flags:
  - key: newPaymentFlow
    enabled: true
    rules:
      - segment: premium-users
        distributions:
          - variant_key: enabled
            rollout: 25  # 25% rollout
```

**Result:** Feature gradually rolls out to 25% of premium users

### Example 3: A/B Testing

**Git Change:**
```yaml
flags:
  - key: checkoutExperiment
    type: VARIANT_FLAG_TYPE
    rules:
      - segment: enterprise-users
        distributions:
          - variant_key: variant-a
            rollout: 50
          - variant_key: variant-b
            rollout: 50
```

**Result:** Users are split 50/50 between two variants for A/B testing

## Key Features

### 1. Infrastructure as Code
- All flag configurations stored in Git
- Full audit trail of changes
- Easy rollback to previous versions

### 2. Automatic Synchronization
- Periodic polling ensures Flipt stays in sync
- No manual intervention needed
- 30-second sync interval for near-real-time updates

### 3. Validation & Safety
- "strict" fetch policy validates all changes
- Invalid changes are rejected
- Error handling and reporting in Angular UI

### 4. Flexible Storage Backend
- Primary in-memory storage for fast access
- Remote Git repository for version control
- Hybrid approach combines best of both

## Monitoring & Debugging

### View Git Sync Status in Angular App

The Git Sync Status component displays:
```
🟢 Success
Repository: https://github.com/flipt-io/example.git
Branch: main
Poll Interval: 30s
Last Sync: 1/21/2026, 2:45 PM
```

### Check Flipt Logs

```bash
# Tail Flipt container logs
docker logs flipt -f

# Look for sync messages like:
# "Git sync completed successfully"
# "Git sync error: <details>"
```

### Monitor Changes in Git

```bash
# View recent commits to features.yml
git log --oneline flipt/features.yml

# See what changed
git diff HEAD~1 flipt/features.yml
```

## Best Practices

1. **Use Clear Commit Messages**
   ```
   git commit -m "Enable dark mode for beta testers"
   ```

2. **Review Changes Before Merging**
   - Use pull requests to review flag changes
   - Require approval before merging to main

3. **Test Configuration Locally**
   - Validate YAML syntax before committing
   - Test flags in development environment

4. **Monitor Sync Status**
   - Check the Git Sync Status component regularly
   - Set up alerts for sync errors

5. **Gradual Rollouts**
   - Start with small percentages
   - Increase rollout incrementally
   - Monitor metrics before full rollout

6. **Version Control**
   - Keep a clear history of flag changes
   - Document why changes were made
   - Use descriptive file names and structures

## Troubleshooting

### Issue: Sync Status Shows Error

**Solution:** Check Flipt logs for details
```bash
docker logs flipt -f | grep -i "error\|sync"
```

### Issue: Changes Not Reflected After 30 Seconds

**Possible Causes:**
1. Changes not pushed to main branch
2. Fetch policy validation rejected changes
3. Invalid YAML syntax in features.yml

**Solution:**
1. Verify changes are in Git: `git log -1 flipt/features.yml`
2. Check Flipt logs for validation errors
3. Validate YAML: `yamllint flipt/features.yml`

### Issue: Permission Denied Error

**Solution:** Verify GitHub credentials in Flipt configuration
```yaml
credentials: "github"
# Ensure GitHub token has read access to repository
```

## Next Steps

1. **Set up GitHub Integration**
   - Create a GitHub token
   - Configure in Flipt credentials

2. **Create Feature Flag Repository**
   - Clone example repository
   - Customize flag definitions

3. **Enable Monitoring**
   - Set up alerts for sync errors
   - Monitor flag changes in Git

4. **Document Flag Policies**
   - Create guidelines for flag naming
   - Define rollout procedures
   - Document segment definitions

## References

- [Flipt v2 Documentation](https://docs.flipt.io)
- [Git Storage Backend](https://docs.flipt.io/storage#git)
- [Feature Flag Best Practices](https://martinfowler.com/articles/feature-toggles.html)
- [OpenFeature Angular Integration](https://openfeature.dev)
