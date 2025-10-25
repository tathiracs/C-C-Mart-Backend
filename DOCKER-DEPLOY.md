# 🐳 Docker Deployment Quick Start

## Quick Local Test with Docker

Test your application with Docker before deploying to production:

```bash
# Run the test script
./docker-test.sh

# Or manually with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

The application will be available at:
- Backend: http://localhost:8080
- Health Check: http://localhost:8080/api/health
- MySQL: localhost:3306

## Deploy to Render

### Quick Deploy (5 minutes)

1. **Push code to GitHub** (if not already done)

2. **Create account on [Render](https://render.com)**

3. **Set up Database:**
   - Option A: Use Render PostgreSQL (free tier) - requires code changes
   - Option B: Use [PlanetScale](https://planetscale.com/) MySQL (recommended, free tier)
   - Option C: Use [Railway](https://railway.app/) MySQL ($5/month)

4. **Deploy Backend:**
   - Go to Render Dashboard → New → Web Service
   - Connect your GitHub repository
   - Select `main` branch
   - Runtime: **Docker**
   - Add environment variables:
     ```
     PORT=8080
     DB_HOST=your-db-host
     DB_PORT=3306
     DB_USER=your-db-user
     DB_PASSWORD=your-db-password
     JWT_SECRET=your-256-bit-secret
     FRONTEND_URL=https://your-vercel-frontend.app
     ```
   - Health Check Path: `/api/health`
   - Click **Create Web Service**

5. **Update Frontend:**
   - In Vercel, add environment variable:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
     ```
   - Redeploy frontend

### Detailed Instructions

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete step-by-step instructions including:
- Database setup options
- Environment variable configuration
- Troubleshooting guide
- Custom domain setup
- Monitoring and scaling

## Files for Deployment

- `Dockerfile` - Multi-stage Docker build
- `.dockerignore` - Excludes unnecessary files
- `docker-compose.yml` - Local testing with Docker
- `render.yaml` - Render Blueprint (optional)
- `docker-test.sh` - Quick local test script
- `DEPLOYMENT.md` - Complete deployment guide

## Generate JWT Secret

```bash
# Generate a secure JWT secret
openssl rand -base64 32
```

## Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | Yes | Server port | `8080` |
| `DB_HOST` | Yes | Database host | `mysql.railway.internal` |
| `DB_PORT` | Yes | Database port | `3306` |
| `DB_USER` | Yes | Database username | `root` |
| `DB_PASSWORD` | Yes | Database password | `your-password` |
| `JWT_SECRET` | Yes | JWT signing secret | `base64-secret` |
| `FRONTEND_URL` | Yes | Frontend URL for CORS | `https://app.vercel.app` |

## Production Checklist

- [ ] Strong JWT_SECRET configured
- [ ] Database credentials secured
- [ ] CORS configured for production frontend
- [ ] Health check endpoint working
- [ ] All environment variables set
- [ ] Frontend API URL updated
- [ ] Test all API endpoints
- [ ] Monitor deployment logs

## Support

- 📖 See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide
- 🐛 Issues? Check Render logs: Dashboard → Your Service → Logs
- 💬 Render Community: https://community.render.com
