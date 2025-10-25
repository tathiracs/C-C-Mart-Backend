# Deploying C-C-Mart Backend to Render

This guide walks you through deploying your Spring Boot backend to Render using Docker.

## Prerequisites

- GitHub account with your code pushed to a repository
- Render account (sign up at https://render.com)
- Your Vercel frontend URL

## Files Added for Deployment

1. **Dockerfile** - Multi-stage Docker build configuration
2. **.dockerignore** - Excludes unnecessary files from Docker image
3. **render.yaml** - Render Blueprint specification (optional)

## Deployment Steps

### Option 1: Using Render Dashboard (Recommended for First Time)

#### Step 1: Create MySQL Database

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"PostgreSQL"** or **"MySQL"** (if available)
   
   **Note:** Render's free tier typically offers PostgreSQL. For MySQL:
   - Consider using [PlanetScale](https://planetscale.com/) (free tier MySQL)
   - Or use [Railway](https://railway.app/) for MySQL
   - Or upgrade to Render paid plan
   
   **Alternative for MySQL:**
   - Use external MySQL service (PlanetScale, Railway, or AWS RDS)
   - Get connection details (host, port, user, password, database name)

3. Name it: `ccmart-db`
4. Select region: Choose closest to your users
5. Click **"Create Database"**
6. Save the connection details (you'll need these)

#### Step 2: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `tathiracs/C-C-Mart-Backend`
3. Configure the service:

   **Basic Settings:**
   - **Name:** `ccmart-backend`
   - **Region:** Same as your database
   - **Branch:** `main`
   - **Runtime:** `Docker`
   - **Dockerfile Path:** `./Dockerfile` (auto-detected)

   **Instance Type:**
   - Select **Free** tier (or Starter for better performance)

4. Add Environment Variables:

   ```
   PORT=8080
   
   # Database Configuration (use your database details)
   DB_HOST=your-db-host.render.com
   DB_PORT=3306
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   
   # JWT Secret (generate a random 256-bit secret)
   JWT_SECRET=your-super-secret-jwt-key-min-256-bits
   
   # Frontend URL (your Vercel deployment)
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

   **To generate a secure JWT_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

5. **Health Check Path:** `/api/health`

6. Click **"Create Web Service"**

#### Step 3: Monitor Deployment

1. Render will start building your Docker image
2. Build takes ~5-10 minutes for first deployment
3. Monitor logs in the Render dashboard
4. Once deployed, you'll get a URL like: `https://ccmart-backend.onrender.com`

### Option 2: Using Render Blueprint (Infrastructure as Code)

1. Push your code including `render.yaml` to GitHub
2. Go to Render Dashboard → **"Blueprints"**
3. Click **"New Blueprint Instance"**
4. Connect your repository
5. Render will auto-detect `render.yaml` and create all services
6. Update environment variables:
   - `FRONTEND_URL` - Your Vercel URL
   - `JWT_SECRET` - Generate secure secret
7. Click **"Apply"**

## Post-Deployment Configuration

### 1. Update Frontend Environment Variables

In your Vercel project, update the API URL:

```env
NEXT_PUBLIC_API_URL=https://ccmart-backend.onrender.com/api
# or
VITE_API_URL=https://ccmart-backend.onrender.com/api
```

Redeploy your frontend after updating.

### 2. Test the Deployment

```bash
# Health check
curl https://ccmart-backend.onrender.com/api/health

# Expected response:
# {"status":"UP","timestamp":"2024-10-25T..."}
```

### 3. Database Initialization

Your application will:
- Auto-create tables (via `spring.jpa.hibernate.ddl-auto=update`)
- Initialize admin user (via `AdminInitializer`)
- Seed data if configured (via `DataSeeder`)

## Important Notes

### Free Tier Limitations

- **Render Free Tier:**
  - Service spins down after 15 minutes of inactivity
  - First request after spin-down takes ~30-60 seconds (cold start)
  - 750 hours/month free
  
- **Solution for Cold Starts:**
  - Upgrade to paid tier ($7/month)
  - Use a cron job to ping your health endpoint every 10 minutes
  - Accept the cold start delay for low-traffic apps

### Database Options

If using external MySQL:
- **PlanetScale** (Recommended): Free tier, great performance
- **Railway**: $5/month, includes MySQL
- **Render PostgreSQL**: Free tier available (requires code changes)

### Security Checklist

✅ Strong JWT_SECRET (min 256 bits)
✅ Database credentials secured
✅ CORS configured for your frontend only
✅ HTTPS enabled (automatic on Render)
✅ Environment variables not in code

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port (auto-set by Render) | `8080` |
| `DB_HOST` | Database hostname | `mysql.railway.internal` |
| `DB_PORT` | Database port | `3306` |
| `DB_USER` | Database username | `root` |
| `DB_PASSWORD` | Database password | `your-password` |
| `JWT_SECRET` | JWT signing secret | `base64-encoded-secret` |
| `FRONTEND_URL` | Your Vercel frontend URL | `https://app.vercel.app` |

## Troubleshooting

### Build Fails

```bash
# Check logs in Render dashboard
# Common issues:
# - Java version mismatch
# - Maven dependency issues
# - Out of memory (upgrade instance)
```

### Database Connection Fails

- Verify DB_HOST, DB_PORT, DB_USER, DB_PASSWORD
- Check database is running and accessible
- Verify database name exists
- Check security group/firewall rules

### CORS Errors

- Verify `FRONTEND_URL` matches your Vercel URL exactly
- Check browser console for exact origin being blocked
- Ensure no trailing slash in `FRONTEND_URL`

### Application Won't Start

- Check logs: `Render Dashboard → Your Service → Logs`
- Verify all required environment variables are set
- Check health endpoint is accessible

## Custom Domain (Optional)

1. Go to your Render service settings
2. Click **"Custom Domains"**
3. Add your domain: `api.yourdomain.com`
4. Add CNAME record to your DNS:
   ```
   CNAME api.yourdomain.com ccmart-backend.onrender.com
   ```
5. SSL certificate is automatically provisioned

## Continuous Deployment

Every push to `main` branch automatically triggers:
1. Docker build
2. Run tests (if configured)
3. Deploy new version
4. Health check
5. Route traffic to new version

To disable auto-deploy:
- Go to service settings
- Toggle off **"Auto-Deploy"**

## Monitoring

### View Logs
```bash
# In Render Dashboard
Your Service → Logs (real-time)
```

### Metrics
- CPU usage
- Memory usage
- Response times
- Error rates

Available in Render Dashboard → Metrics

## Scaling

### Vertical Scaling
Upgrade instance type in service settings:
- Free: 512 MB RAM, 0.1 CPU
- Starter: 512 MB RAM, 0.5 CPU
- Standard: 2 GB RAM, 1 CPU

### Horizontal Scaling
Available in paid plans:
- Multiple instances
- Load balancing
- Auto-scaling

## Backup Strategy

1. **Database Backups:**
   - Automated daily backups (paid plans)
   - Manual backups via database dashboard
   
2. **Code:**
   - GitHub serves as version control
   - Tag releases for easy rollback

## Cost Estimation

- **Free Tier:** $0/month (with limitations)
- **Starter:** $7/month + database costs
- **Standard:** $25/month + database costs

**Database:**
- PlanetScale: Free tier available
- Render PostgreSQL: $7/month
- Railway MySQL: $5/month

## Support

- Render Docs: https://render.com/docs
- Community: https://community.render.com
- GitHub Issues: Your repository

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Update frontend environment variables
3. ✅ Test all API endpoints
4. 🔄 Set up monitoring/alerts
5. 🔄 Configure custom domain
6. 🔄 Set up backup strategy
7. 🔄 Performance testing

---

**Congratulations! Your backend is now deployed! 🚀**
