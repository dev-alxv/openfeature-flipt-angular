# GitHub Codespaces Setup

This project is configured to run in GitHub Codespaces with Flipt feature flag server included.

## 🚀 Quick Start

### 1. Launch Codespace

Click the green **Code** button → **Codespaces** → **Create codespace on main**

Or use the GitHub CLI:
```bash
gh codespace create -r yourusername/openfeature-flipt-angular
```

### 2. Wait for Setup

The Codespace will automatically:
- ✅ Install Node.js 18
- ✅ Install Angular CLI
- ✅ Run `npm install`
- ✅ Start Flipt server in the background
- ✅ Configure VS Code extensions

### 3. Start Development

```bash
npm start
```

The app will be available at the forwarded port (usually opens automatically).

## 🏗️ What's Included

### Services
- **Angular App** - Port 4200
- **Flipt Server** - Port 8080 (UI and API)

### VS Code Extensions
- Angular Language Service
- ESLint
- Prettier
- TypeScript
- GitHub Copilot
- YAML Support
- Spell Checker

## 📝 Accessing Flipt

The Flipt UI is available at port 8080:
1. Go to the **PORTS** tab in VS Code
2. Find port 8080 (Flipt Server)
3. Click the globe icon to open in browser

Or access it directly at: `https://[your-codespace-name]-8080.preview.app.github.dev`

## 🔧 Configuration

### Flipt Configuration
Located at [flipt/flipt.yml](../flipt/flipt.yml)

Key settings:
- CORS enabled for Codespaces URLs
- Local storage using `features.yml`
- Debug logging enabled

### Feature Flags
Managed in [flipt/features.yml](../flipt/features.yml)

Edit this file to update flags - changes are picked up automatically by Flipt.

## 🐛 Troubleshooting

### Flipt not starting
```bash
# Check if Flipt is running
docker ps

# View Flipt logs
docker logs $(docker ps -q -f name=flipt)

# Restart Flipt
docker restart $(docker ps -q -f name=flipt)
```

### Port forwarding issues
1. Open the **PORTS** tab
2. Right-click the port → **Port Visibility** → **Public**
3. Try accessing again

### Angular app not loading
```bash
# Check Node version
node --version  # Should be 18.x

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Start with verbose logging
npm start -- --verbose
```

### Changes to features.yml not reflected
```bash
# Restart Flipt to reload configuration
docker restart $(docker ps -q -f name=flipt)

# Or rebuild the devcontainer
Ctrl+Shift+P → "Codespaces: Rebuild Container"
```

## 💡 Tips

### Rebuild Devcontainer
If you make changes to devcontainer configuration:
1. `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type: "Codespaces: Rebuild Container"
3. Select "Rebuild Container"

### Prebuilds (Optional)
Speed up Codespace creation by enabling prebuilds:
1. Go to repository Settings
2. Codespaces → Set up prebuild
3. Select branch and schedule

### Resource Management
Codespaces automatically stop after inactivity. To manage:
- View active codespaces: https://github.com/codespaces
- Stop: `gh codespace stop`
- Delete: `gh codespace delete`

## 🔐 Secrets

For production Flipt instances, add secrets:
1. Go to repository Settings
2. Secrets and variables → Codespaces
3. Add:
   - `FLIPT_PROD_URL`
   - `FLIPT_PROD_TOKEN`

These will be available as environment variables in your Codespace.

## 📚 Resources

- [GitHub Codespaces Docs](https://docs.github.com/en/codespaces)
- [Devcontainer Reference](https://containers.dev/)
- [Flipt Documentation](https://www.flipt.io/docs)
- [Angular in Codespaces](https://code.visualstudio.com/docs/remote/codespaces)

## 🎯 Common Tasks

### Run tests
```bash
npm test
```

### Build for production
```bash
npm run build
```

### Access Flipt API
```bash
# Get all flags
curl http://localhost:8080/api/v1/namespaces/default/flags

# Evaluate a flag
curl -X POST http://localhost:8080/api/v1/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "namespace": "default",
    "flagKey": "newHomeUI",
    "entityId": "user-123",
    "context": {"plan": "premium"}
  }'
```

### Update feature flags
1. Edit [flipt/features.yml](../flipt/features.yml)
2. Commit changes
3. Restart Flipt: `docker restart $(docker ps -q -f name=flipt)`

## 🚦 Development Workflow

1. **Code in Codespace** - All development happens in the cloud
2. **Test locally** - Use the integrated Flipt server
3. **Commit changes** - Push to GitHub
4. **Auto-deploy flags** - GitHub Actions syncs to production (see [FLIPT_GITHUB_WORKFLOW.md](FLIPT_GITHUB_WORKFLOW.md))

## ⚡ Performance

Codespaces specs:
- 2-core: Good for basic development
- 4-core: Recommended for this project
- 8-core: Best for heavy builds/tests

Change machine type:
1. Stop Codespace
2. Go to https://github.com/codespaces
3. Click "..." → "Change machine type"
