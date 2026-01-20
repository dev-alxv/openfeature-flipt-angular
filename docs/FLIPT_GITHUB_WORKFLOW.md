# GitHub-Controlled Feature Flags with Flipt

This project uses GitHub as the source of truth for feature flag configurations, which are automatically synced to Flipt.

## 📁 Structure

```
flipt/
├── features.yml    # Feature flag definitions (version controlled)
└── README.md       # This file
.github/
└── workflows/
    └── sync-flipt-flags.yml  # Auto-sync workflow
```

## 🚀 How It Works

1. **Edit Flags**: Modify [flipt/features.yml](flipt/features.yml) with your flag changes
2. **Create PR**: Commit and open a pull request
3. **Review**: The workflow validates your changes and comments on the PR
4. **Merge**: 
   - Merge to `develop` → deploys to Development environment
   - Merge to `main` → deploys to Production environment
5. **Auto-Sync**: GitHub Actions automatically syncs to Flipt

## 🔧 Setup Instructions

### 1. Configure GitHub Secrets

Add these secrets to your repository (Settings → Secrets and variables → Actions):

#### Development Environment
- `FLIPT_DEV_URL` - Your Flipt dev server URL (e.g., `https://flipt-dev.yourcompany.com`)
- `FLIPT_DEV_TOKEN` - Authentication token for dev Flipt instance

#### Production Environment
- `FLIPT_PROD_URL` - Your Flipt prod server URL (e.g., `https://flipt.yourcompany.com`)
- `FLIPT_PROD_TOKEN` - Authentication token for prod Flipt instance

### 2. Create GitHub Environments

1. Go to Settings → Environments
2. Create two environments:
   - `development` - for dev deployments
   - `production` - for prod deployments (add protection rules)

### 3. Configure Flipt for Declarative Mode

Update your Flipt configuration to accept declarative configs:

```yaml
# flipt.yml (on your Flipt server)
storage:
  type: git
  git:
    repository: https://github.com/yourusername/openfeature-flipt-angular
    ref: main
    path: flipt/features.yml
    poll_interval: 30s
```

Or use the API-based sync approach (already configured in workflow).

## 📝 Editing Flags

### Example: Adding a New Flag

```yaml
flags:
  - key: myNewFeature
    name: My New Feature
    type: BOOLEAN_FLAG_TYPE
    description: Enables my awesome new feature
    enabled: true
```

### Example: Adding Targeting Rules

```yaml
flags:
  - key: premiumFeature
    name: Premium Feature
    type: VARIANT_FLAG_TYPE
    enabled: true
    variants:
      - key: enabled
        name: Enabled
      - key: disabled
        name: Disabled
    rules:
      - segment: premium-users
        distributions:
          - variant_key: enabled
            rollout: 100  # 100% of premium users
      - segment: free-users
        distributions:
          - variant_key: enabled
            rollout: 10   # 10% of free users
```

### Example: Gradual Rollout

```yaml
rules:
  - segment: all-users
    distributions:
      - variant_key: enabled
        rollout: 25  # Start with 25%
```

Update the rollout percentage over time: 25% → 50% → 75% → 100%

## 🔄 Workflow

### For New Features
1. Create feature branch: `git checkout -b feature/new-flag`
2. Edit `flipt/features.yml`
3. Commit: `git commit -m "feat: add new feature flag"`
4. Push and create PR
5. Review automated validation
6. Merge to `develop` to test
7. Merge to `main` to deploy to production

### For Flag Updates
1. Create branch: `git checkout -b update/increase-rollout`
2. Modify rollout percentage or targeting
3. Create PR and review
4. Merge to deploy

### For Emergency Rollback
1. Create hotfix branch
2. Disable flag or revert changes
3. Fast-track PR approval
4. Merge to `main` for immediate deployment

## 🛡️ Best Practices

1. **Always use PRs** - Never commit directly to main/develop
2. **Descriptive commits** - Use clear commit messages
3. **Test in dev first** - Merge to `develop` before `main`
4. **Small changes** - One flag change per PR when possible
5. **Document decisions** - Add comments in PR explaining changes
6. **Monitor after deploy** - Check Flipt UI and application logs

## 🐛 Troubleshooting

### Workflow fails validation
- Check YAML syntax in `features.yml`
- Ensure all required fields are present
- Verify segment references exist

### Flags not syncing to Flipt
- Check GitHub Actions logs
- Verify secrets are configured correctly
- Confirm Flipt URL is accessible
- Check authentication token is valid

### Local testing
Test flag configuration locally:
```bash
# Validate YAML syntax
yq eval flipt/features.yml

# Preview flags
cat flipt/features.yml
```

## 📚 Resources

- [Flipt Documentation](https://www.flipt.io/docs)
- [Flipt API Reference](https://www.flipt.io/docs/reference/overview)
- [OpenFeature Documentation](https://openfeature.dev/)
- [Project README](../README.md)

## 🔐 Security Notes

- Never commit API tokens or secrets to Git
- Use environment protection rules in GitHub
- Require approvals for production deployments
- Audit flag changes through Git history
- Rotate Flipt tokens regularly
