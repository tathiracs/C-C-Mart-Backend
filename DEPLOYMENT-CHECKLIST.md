# 🚀 Render Deployment Checklist

Use this checklist to ensure a smooth deployment to Render.

## Pre-Deployment

### Local Testing
- [ ] Test application locally with Docker
  ```bash
  ./docker-test.sh
  ```
- [ ] Verify health endpoint responds: http://localhost:8080/api/health
- [ ] Test all API endpoints work correctly
- [ ] Verify database migrations work
- [ ] Check admin initialization works

### Code Preparation
- [ ] All changes committed to Git
- [ ] Code pushed to GitHub repository
- [ ] `.env` file NOT committed (should be in `.gitignore`)
- [ ] Docker files present: `Dockerfile`, `.dockerignore`, `docker-compose.yml`
- [ ] CORS configuration includes production URL

### Database Preparation
- [ ] Decide on database provider (PlanetScale, Railway, or Render PostgreSQL)
- [ ] Database account created
- [ ] Database connection details noted down:
  - Host: _______________
  - Port: _______________
  - User: _______________
  - Password: _______________
  - Database name: _______________

### Secrets Generation
- [ ] Generate JWT_SECRET
  ```bash
  ./generate-secret.sh
  ```
  JWT_SECRET: _______________

## Render Setup

### Create Web Service
- [ ] Render account created
- [ ] New Web Service created
- [ ] GitHub repository connected
- [ ] Branch selected: `main`
- [ ] Runtime set to: **Docker**
- [ ] Region selected: _______________

### Environment Variables Configured
- [ ] `PORT=8080`
- [ ] `DB_HOST=_______________`
- [ ] `DB_PORT=3306`
- [ ] `DB_USER=_______________`
- [ ] `DB_PASSWORD=_______________`
- [ ] `JWT_SECRET=_______________`
- [ ] `FRONTEND_URL=https://your-frontend.vercel.app`

### Service Configuration
- [ ] Health check path set: `/api/health`
- [ ] Auto-deploy enabled
- [ ] Instance type selected: _______________

## Post-Deployment

### Verify Deployment
- [ ] Build completed successfully
- [ ] Service is running (green status)
- [ ] Health endpoint accessible
  ```bash
  curl https://your-backend.onrender.com/api/health
  ```
- [ ] No errors in logs

### Test Endpoints
- [ ] `GET /api/health` - Returns UP status
- [ ] `POST /api/auth/login` - Login works
- [ ] `POST /api/auth/register` - Registration works
- [ ] `GET /api/products` - Returns products
- [ ] Admin login works with default credentials

### Frontend Integration
- [ ] Frontend environment variable updated:
  ```
  NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
  ```
- [ ] Frontend redeployed on Vercel
- [ ] No CORS errors in browser console
- [ ] Can login from frontend
- [ ] Can view products from frontend
- [ ] Can place orders from frontend

## Monitoring

### Initial Checks (First 24 Hours)
- [ ] Monitor error logs in Render dashboard
- [ ] Check response times are acceptable
- [ ] Verify cold start time (free tier)
- [ ] Test after 15 minutes of inactivity (free tier spin-down)

### Performance
- [ ] Response times < 1 second (after warm-up)
- [ ] No memory issues
- [ ] Database connections stable
- [ ] No authentication issues

## Optional Enhancements

### Custom Domain
- [ ] Custom domain purchased
- [ ] DNS CNAME record added
- [ ] SSL certificate provisioned
- [ ] Domain working with HTTPS

### Monitoring & Alerts
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure error alerts
- [ ] Set up log aggregation
- [ ] Performance monitoring enabled

### Backup Strategy
- [ ] Database backup schedule configured
- [ ] Backup restoration tested
- [ ] Git tags for release versions

## Troubleshooting

If deployment fails, check:

### Build Failures
- [ ] Docker build logs in Render
- [ ] Java version compatibility (21)
- [ ] Maven dependencies resolve
- [ ] Sufficient build resources

### Runtime Failures
- [ ] All environment variables set correctly
- [ ] Database connection works
- [ ] No syntax errors in configuration
- [ ] Port configuration correct

### Connection Issues
- [ ] Database host accessible from Render
- [ ] CORS configured for correct frontend URL
- [ ] No firewall blocking requests
- [ ] SSL/TLS certificates valid

## Rollback Plan

If production issues occur:

1. **Quick Fix:**
   - [ ] Revert to previous commit in GitHub
   - [ ] Render auto-deploys previous version

2. **Manual Rollback:**
   - [ ] Go to Render Dashboard → Your Service
   - [ ] Navigate to "Events" tab
   - [ ] Click "Rollback" on previous successful deployment

3. **Database Issues:**
   - [ ] Restore from latest backup
   - [ ] Verify data integrity

## Production Maintenance

### Regular Tasks
- [ ] Monitor error logs weekly
- [ ] Review performance metrics
- [ ] Update dependencies monthly
- [ ] Test backup restoration quarterly
- [ ] Review security advisories

### Scaling Considerations
- [ ] Monitor free tier hours (750/month)
- [ ] Plan upgrade if exceeding limits
- [ ] Consider caching strategy
- [ ] Optimize database queries

## Success Criteria

Your deployment is successful when:

✅ Backend is accessible and returns 200 OK for health check
✅ Frontend can communicate with backend (no CORS errors)
✅ Users can register and login
✅ Products are displayed correctly
✅ Orders can be placed
✅ Admin can manage orders
✅ No critical errors in logs
✅ Response times are acceptable

## Support Resources

- 📖 [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
- 📖 [DOCKER-DEPLOY.md](./DOCKER-DEPLOY.md) - Quick start guide
- 🔧 [Render Documentation](https://render.com/docs)
- 💬 [Render Community](https://community.render.com)
- 🐙 [Project GitHub Issues](https://github.com/tathiracs/C-C-Mart-Backend/issues)

## Notes

Deployment Date: _______________
Backend URL: _______________
Database Provider: _______________
Instance Type: _______________
Additional Notes:
_________________________________
_________________________________
_________________________________

---

**Ready to deploy? Let's go! 🚀**
