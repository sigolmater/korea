# Z-CORE Deployment Guide

## Quick Start

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Create environment file
echo "GEMINI_API_KEY=your_key_here" > .env.local

# 3. Start dev server
npm run dev
```

## Docker Deployment

### Build and Run
```bash
# Build image
docker build -t zcore-ai:latest .

# Run container
docker run -d -p 3000:80 --name zcore-app zcore-ai:latest
```

### Using Docker Compose
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Production Deployment

### Prerequisites
- Node.js 18+
- npm 9+
- Gemini API key

### Build for Production
```bash
# Install production dependencies
npm ci --only=production

# Build application
GEMINI_API_KEY=your_key npm run build

# Preview build
npm run preview
```

## Cloud Deployment

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variable
vercel env add GEMINI_API_KEY
```

### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Set environment variable
netlify env:set GEMINI_API_KEY your_key
```

### Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and init
railway login
railway init

# Deploy
railway up

# Set environment variable
railway variables set GEMINI_API_KEY=your_key
```

### AI Studio
This project is configured for AI Studio deployment:
- Build command: `npm run build`
- Output directory: `dist`
- Environment: Set `GEMINI_API_KEY` in dashboard

## Environment Configuration

### Required Variables
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### Optional Variables
```bash
NODE_ENV=production
PORT=3000
```

## Performance Optimization

### Build Optimization
- Vite automatically code-splits
- Tree-shaking enabled
- Minification enabled in production

### Caching Strategy
- Static assets: 1 year cache
- Service worker for offline support
- LocalStorage for chat history

## Security Checklist

- [ ] API key stored in environment variable (not in code)
- [ ] HTTPS enabled for production
- [ ] CSP headers configured (see nginx.conf)
- [ ] XSS protection enabled
- [ ] CORS properly configured
- [ ] Rate limiting implemented (if using custom backend)

## Monitoring

### Health Check
```bash
# Docker health check
curl http://localhost:3000/health

# Response: "healthy"
```

### Logs
```bash
# Docker logs
docker logs zcore-app

# Docker Compose logs
docker-compose logs -f zcore-app
```

## Troubleshooting

### API Key Issues
```
Error: API_KEY environment variable is not set
```
**Solution:** Set `GEMINI_API_KEY` in `.env.local`

### Build Failures
```
Error: Cannot find module
```
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port Already in Use
```
Error: Port 3000 is already in use
```
**Solution:**
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

## Rollback Strategy

### Docker Rollback
```bash
# List images
docker images

# Run previous version
docker run -d -p 3000:80 zcore-ai:previous-tag
```

### Git Rollback
```bash
# Revert to previous commit
git revert HEAD

# Or reset to specific commit
git reset --hard <commit-hash>

# Rebuild and redeploy
npm run build
```

## Backup & Restore

### Backup Chat History
User data is stored in browser localStorage:
- Export via Settings → Export chat
- Formats: TXT, MD, JSON

### Database Backup (if using backend)
```bash
# MongoDB example
mongodump --db zcore --out backup/

# Restore
mongorestore --db zcore backup/zcore/
```

## CI/CD Pipeline

GitHub Actions automatically:
- Runs tests on push
- Type-checks TypeScript
- Builds production bundle
- Security audit
- Deploys on merge to main

See `.github/workflows/ci.yml` for configuration.

## Scaling

### Horizontal Scaling
```yaml
# docker-compose.yml
services:
  zcore-app:
    deploy:
      replicas: 3
```

### Load Balancing
Use nginx or cloud load balancer:
```nginx
upstream zcore_backends {
    server zcore-1:80;
    server zcore-2:80;
    server zcore-3:80;
}
```

## Support

For deployment issues:
1. Check logs
2. Verify environment variables
3. Review [CLAUDE.md](./CLAUDE.md) for architecture details
4. Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API issues

---

**Last Updated:** 2025-12-18
**Version:** 2.0.0
