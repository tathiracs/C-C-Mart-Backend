# 🚀 Deployment Checklist - C&C Mart

## Pre-Deployment Verification

### ✅ Code Quality
- [x] No console errors in browser
- [x] No compilation errors in backend
- [x] No build warnings in frontend
- [x] All tests passing
- [x] Code reviewed and documented

### ✅ Functionality
- [x] Customer registration works
- [x] Login/logout works
- [x] Product browsing works
- [x] Cart functionality works
- [x] Order placement works
- [x] Admin order approval works
- [x] Delivery agent assignment works
- [x] Complete order workflow functions
- [x] All CRUD operations work

### ✅ Security
- [x] JWT authentication implemented
- [x] Password hashing enabled
- [x] Role-based access control working
- [x] Protected routes secured
- [x] CORS configured properly
- [x] SQL injection prevention
- [x] XSS protection enabled

### ✅ Database
- [x] All tables created
- [x] Foreign keys configured
- [x] Indexes optimized
- [x] Default admin account created
- [x] Sample data seeded (optional)

### ✅ Documentation
- [x] README.md updated
- [x] API endpoints documented
- [x] Setup instructions clear
- [x] Testing guide provided
- [x] Architecture documented

---

## Deployment Steps

### Step 1: Prepare Database

#### Option A: Fresh Installation
```sql
-- Create database
CREATE DATABASE ccmart_db;

-- Spring Boot will auto-create tables on first run
-- Admin account will be auto-created (admin@ccmart.com / admin123)
```

#### Option B: Existing Database
```sql
-- Backup existing database first
mysqldump -u root -p ccmart_db > ccmart_backup_$(date +%Y%m%d).sql

-- Then update database if needed
USE ccmart_db;
-- Tables will auto-update with Hibernate's ddl-auto=update
```

---

### Step 2: Backend Deployment

#### Local Development:
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

#### Production (JAR):
```bash
cd backend
./mvnw clean package -DskipTests
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

#### Production (with Profile):
```bash
java -jar target/backend-0.0.1-SNAPSHOT.jar \
  --spring.profiles.active=production \
  --server.port=8081 \
  --spring.datasource.url=jdbc:mysql://localhost:3306/ccmart_db \
  --spring.datasource.username=your_db_user \
  --spring.datasource.password=your_db_password
```

#### Verify Backend:
```bash
# Test health endpoint
curl http://localhost:8081/actuator/health

# Expected: {"status":"UP"}
```

---

### Step 3: Frontend Deployment

#### Development Build:
```bash
cd frontend
npm install
npm start
```

#### Production Build:
```bash
cd frontend
npm install --production
npm run build
```

#### Serve Production Build:
```bash
# Option 1: Using serve
npx serve -s build -l 3000

# Option 2: Using nginx
# Copy build/ folder to nginx html directory
cp -r build/* /var/www/html/ccmart/
```

#### Verify Frontend:
```bash
# Open browser
http://localhost:3000

# Check:
- Home page loads
- Can navigate to products
- Can login
```

---

### Step 4: Configure Environment Variables

#### Backend (.env or application.properties):
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/ccmart_db
spring.datasource.username=root
spring.datasource.password=your_password

# Server
server.port=8081

# JWT
jwt.secret=your-secret-key-here-must-be-long-and-secure
jwt.expiration=86400000

# Admin Account
admin.email=admin@ccmart.com
admin.password=admin123
admin.name=Admin User

# Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

#### Frontend (.env):
```bash
REACT_APP_API_BASE_URL=http://localhost:8081/api
REACT_APP_NAME=C&C Mart
```

---

### Step 5: Web Server Configuration (Production)

#### Nginx Configuration:
```nginx
# Frontend (React)
server {
    listen 80;
    server_name yourdomain.com;
    
    root /var/www/html/ccmart/build;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Backend proxy
    location /api {
        proxy_pass http://localhost:8081;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Apache Configuration:
```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /var/www/html/ccmart/build
    
    <Directory /var/www/html/ccmart/build>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # React Router support
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # Backend proxy
    ProxyPass /api http://localhost:8081/api
    ProxyPassReverse /api http://localhost:8081/api
</VirtualHost>
```

---

### Step 6: SSL/HTTPS Setup (Production)

#### Using Let's Encrypt (Certbot):
```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

### Step 7: Process Management (Production)

#### Using systemd for Backend:
```bash
# Create service file
sudo nano /etc/systemd/system/ccmart-backend.service
```

```ini
[Unit]
Description=C&C Mart Backend
After=syslog.target network.target

[Service]
User=www-data
WorkingDirectory=/var/www/ccmart/backend
ExecStart=/usr/bin/java -jar target/backend-0.0.1-SNAPSHOT.jar
SuccessExitStatus=143
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable ccmart-backend
sudo systemctl start ccmart-backend
sudo systemctl status ccmart-backend
```

#### Using PM2 for Frontend (if using serve):
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start "npx serve -s build -l 3000" --name ccmart-frontend

# Save PM2 configuration
pm2 save
pm2 startup
```

---

### Step 8: Database Backup Setup

#### Automated Daily Backup:
```bash
# Create backup script
sudo nano /usr/local/bin/backup-ccmart-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/backups/ccmart"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="ccmart_db_${DATE}.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u root -p'your_password' ccmart_db > $BACKUP_DIR/$FILENAME

# Compress backup
gzip $BACKUP_DIR/$FILENAME

# Delete backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: ${FILENAME}.gz"
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-ccmart-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-ccmart-db.sh
```

---

### Step 9: Monitoring Setup

#### Health Check Endpoints:
```bash
# Backend health
curl http://localhost:8081/actuator/health

# Frontend health
curl http://localhost:3000
```

#### Uptime Monitoring:
- Use UptimeRobot, Pingdom, or similar service
- Monitor endpoints:
  - `https://yourdomain.com` (Frontend)
  - `https://yourdomain.com/api/health` (Backend)

#### Log Monitoring:
```bash
# Backend logs
tail -f /var/log/ccmart/backend.log

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

### Step 10: Performance Optimization

#### Frontend Optimization:
```bash
# Already optimized with:
- React code splitting
- Lazy loading
- Minified production build
- Gzip compression
```

#### Backend Optimization:
```properties
# application-production.properties
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=false
server.compression.enabled=true
server.compression.mime-types=application/json,application/xml,text/html,text/xml,text/plain
```

#### Database Optimization:
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_delivery_agents_available ON delivery_agents(is_available, is_active);
```

---

## Post-Deployment Testing

### Smoke Tests:
```bash
# 1. Frontend loads
curl -I http://yourdomain.com
# Expected: 200 OK

# 2. Backend API responds
curl http://yourdomain.com/api/health
# Expected: {"status":"UP"}

# 3. Database connection
# Login to admin panel and check dashboard loads

# 4. Authentication works
# Try to login with admin@ccmart.com

# 5. Order workflow
# Place test order and verify approval/assignment works
```

### Load Testing (Optional):
```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test backend endpoint
ab -n 1000 -c 10 http://localhost:8081/api/products

# Test frontend
ab -n 1000 -c 10 http://localhost:3000/
```

---

## Rollback Plan

### If Deployment Fails:

#### Step 1: Stop Services
```bash
sudo systemctl stop ccmart-backend
pm2 stop ccmart-frontend
```

#### Step 2: Restore Database
```bash
# Restore from backup
mysql -u root -p ccmart_db < /backups/ccmart/ccmart_db_YYYYMMDD.sql
```

#### Step 3: Revert Code
```bash
# Checkout previous version
git checkout <previous-commit-hash>

# Rebuild
cd backend && ./mvnw clean package
cd ../frontend && npm run build
```

#### Step 4: Restart Services
```bash
sudo systemctl start ccmart-backend
pm2 start ccmart-frontend
```

---

## Security Checklist

### Before Going Live:
- [ ] Change default admin password
- [ ] Update JWT secret key
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Disable debug mode
- [ ] Remove test data
- [ ] Set up database user with limited privileges
- [ ] Enable CORS only for your domain
- [ ] Set secure session cookies
- [ ] Enable rate limiting
- [ ] Set up intrusion detection

---

## Maintenance Tasks

### Daily:
- [ ] Check application logs
- [ ] Monitor error rates
- [ ] Verify backups completed

### Weekly:
- [ ] Review user reports
- [ ] Check database size
- [ ] Monitor API performance
- [ ] Review security logs

### Monthly:
- [ ] Update dependencies
- [ ] Review and optimize queries
- [ ] Clean old logs
- [ ] Test disaster recovery
- [ ] Review and rotate logs

---

## Support & Documentation

### For Developers:
- `README.md` - Main documentation
- `ORDER-MANAGEMENT-SUMMARY.md` - Workflow details
- `COMPLETE-TESTING-GUIDE.md` - Testing procedures
- `PROJECT-FINALIZATION-SUMMARY.md` - Recent changes

### For Admins:
- Default admin: `admin@ccmart.com` / `admin123`
- Dashboard: `http://yourdomain.com/admin`
- Order Management: `http://yourdomain.com/admin/orders`

### Contact:
- Technical Support: [support@ccmart.com]
- Development Team: [dev@ccmart.com]

---

## Troubleshooting

### Backend Won't Start:
```bash
# Check logs
tail -f logs/spring-boot-application.log

# Check database connection
mysql -u root -p -e "USE ccmart_db; SHOW TABLES;"

# Check port availability
lsof -i :8081
```

### Frontend Won't Build:
```bash
# Clear node modules
rm -rf node_modules package-lock.json
npm install

# Clear cache
npm cache clean --force
```

### Database Connection Issues:
```bash
# Test connection
mysql -u root -p ccmart_db

# Check user privileges
SHOW GRANTS FOR 'your_user'@'localhost';

# Reset password if needed
ALTER USER 'your_user'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

---

## Success Criteria

### Application is Successfully Deployed When:
- ✅ Frontend loads without errors
- ✅ Backend responds to health checks
- ✅ Database connection is stable
- ✅ Users can register and login
- ✅ Orders can be placed and managed
- ✅ Delivery agents can be assigned
- ✅ Admin dashboard is accessible
- ✅ All CRUD operations work
- ✅ SSL/HTTPS is enabled (production)
- ✅ Backups are automated
- ✅ Monitoring is in place

---

## 🎉 Deployment Complete!

Once all checklist items are completed, your C&C Mart application is live and ready for users!

**Next Steps**:
1. Announce launch to users
2. Monitor application closely for first 24 hours
3. Gather user feedback
4. Plan feature enhancements

---

**Last Updated**: October 19, 2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
