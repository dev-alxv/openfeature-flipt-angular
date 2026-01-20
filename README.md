# OpenFeature Flipt Angular

Angular application demonstrating feature flag management with OpenFeature and Flipt, integrated with GitHub for GitOps workflows.

## 🚀 Quick Start

### GitHub Codespaces (Recommended)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new)

Everything is pre-configured! Just click the badge above or see [Codespaces Setup Guide](docs/CODESPACES_SETUP.md).

### Local Development

1. **Start Flipt** (requires Docker):
   ```bash
   docker run -d -p 8080:8080 -v $(pwd)/flipt:/etc/flipt/config flipt/flipt:latest
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the app**:
   ```bash
   npm start
   ```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## 🎯 Features

- ✨ **Feature Flags** - Dynamic feature toggling with Flipt
- 🔄 **Real-time Updates** - Flags update without app restart
- 🎨 **Multiple UIs** - Toggle between old and new designs
- 👥 **User Targeting** - Different experiences per user segment
- 📊 **Analytics Ready** - Track feature usage
- 🔧 **GitOps** - Manage flags through Git (see [GitHub Workflow Guide](docs/FLIPT_GITHUB_WORKFLOW.md))

## 📁 Project Structure

```
src/app/
├── services/
│   └── flag.service.ts           # Feature flag service
├── directives/
│   ├── feature-flag.directive.ts  # Show/hide based on flags
│   └── feature-flag-string.directive.ts
├── openfeature/
│   └── init-openfeature.ts       # OpenFeature initialization
└── pages/
    ├── home/                      # Home page with flag demos
    ├── admin/                     # Admin features
    └── experiments/               # Experiments page

flipt/
├── features.yml                   # Feature flag definitions
├── flipt.yml                      # Flipt server config
└── README.md

.github/workflows/
└── sync-flipt-flags.yml          # Auto-sync flags to Flipt
```

## 🚩 Feature Flags

Current flags (defined in [flipt/features.yml](flipt/features.yml)):

- **newHomeUI** - New home page design (variant flag with targeting)
- **oldFeatureA** - Legacy feature A (boolean)
- **oldFeatureB** - Legacy feature B (boolean)
- **newRevenueChart** - New chart visualization (variant with gradual rollout)

### Using Flags in Code

```typescript
// In components
constructor(private flagService: FlagService) {}

ngOnInit() {
  this.flagService.flags$.subscribe(flags => {
    if (flags.newHomeUI) {
      // Show new UI
    }
  });
}

// In templates with directive
<div *featureFlag="'newHomeUI'">
  New UI content
</div>
```

## 🔧 Managing Feature Flags

### Via GitHub (Recommended)
1. Edit [flipt/features.yml](flipt/features.yml)
2. Create a pull request
3. Merge to deploy (auto-syncs to Flipt)

See [GitHub Workflow Guide](docs/FLIPT_GITHUB_WORKFLOW.md) for details.

### Via Flipt UI
Access at `http://localhost:8080` (local) or your Codespace port 8080.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## 📚 Documentation

- [Codespaces Setup](docs/CODESPACES_SETUP.md) - Run in GitHub Codespaces
- [GitHub Workflow Guide](docs/FLIPT_GITHUB_WORKFLOW.md) - GitOps for feature flags
- [OpenFeature Docs](https://openfeature.dev/)
- [Flipt Docs](https://www.flipt.io/docs)

## 🧪 Testing

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## 🏗️ Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.16.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
