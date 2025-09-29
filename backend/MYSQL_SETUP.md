# MySQL Database Setup for C&C Mart Backend

## Prerequisites

1. **Install MySQL Server**

   - Download MySQL Community Server from: https://dev.mysql.com/downloads/mysql/
   - Follow the installation wizard
   - Remember the root password you set during installation

2. **Install MySQL Workbench (Optional)**
   - Download from: https://dev.mysql.com/downloads/workbench/
   - Useful for visual database management

## Database Setup Steps

### 1. Create Database

Connect to MySQL as root and create the database:

```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create the database
CREATE DATABASE ccmart_db;

-- Create a dedicated user (optional but recommended)
CREATE USER 'ccmart_user'@'localhost' IDENTIFIED BY 'ccmart_password';

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON ccmart_db.* TO 'ccmart_user'@'localhost';

-- Refresh privileges
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### 2. Update Application Configuration

Update `src/main/resources/application.properties`:

```properties
# Option 1: Using root user (simpler for development)
spring.datasource.username=root
spring.datasource.password=your_mysql_root_password

# Option 2: Using dedicated user (recommended)
spring.datasource.username=ccmart_user
spring.datasource.password=ccmart_password
```

### 3. Verify Connection

You can test the connection using MySQL command line:

```bash
mysql -u root -p -e "SHOW DATABASES;"
```

You should see `ccmart_db` in the list.

## Configuration Details

### Database URL Breakdown

```
jdbc:mysql://localhost:3306/ccmart_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
```

- `localhost:3306` - MySQL server location and port
- `ccmart_db` - Database name
- `useSSL=false` - Disable SSL for local development
- `serverTimezone=UTC` - Set timezone to avoid timezone issues
- `allowPublicKeyRetrieval=true` - Allow public key retrieval for newer MySQL versions

### JPA Configuration Changes

- **`hibernate.ddl-auto=update`** - Tables will be created/updated automatically, data persists
- **`MySQLDialect`** - Uses MySQL-specific SQL syntax
- **Connection pooling** - Added HikariCP settings for better performance

## Troubleshooting

### Common Issues:

1. **Access Denied Error**

   ```
   java.sql.SQLException: Access denied for user 'root'@'localhost'
   ```

   - Check username/password in application.properties
   - Ensure MySQL server is running

2. **Database Not Found**

   ```
   Unknown database 'ccmart_db'
   ```

   - Create the database using the SQL commands above

3. **Connection Timeout**

   ```
   Communications link failure
   ```

   - Check if MySQL server is running
   - Verify port 3306 is not blocked by firewall

4. **Timezone Issue**
   ```
   The server time zone value 'xxx' is unrecognized
   ```
   - Add `serverTimezone=UTC` to the database URL (already included)

### Checking MySQL Service Status:

**Windows:**

```cmd
net start mysql
# or
services.msc (look for MySQL service)
```

**Linux/Mac:**

```bash
sudo systemctl status mysql
# or
brew services list | grep mysql
```

## Data Migration

Since we're switching from H2 to MySQL:

1. **First Run**: The application will automatically create tables based on your entities
2. **Sample Data**: The `DataInitializer` will populate the database with sample products
3. **Data Persistence**: Unlike H2, your data will persist between application restarts

## Development vs Production

**Development Setup:**

- Use `hibernate.ddl-auto=update`
- Keep `show-sql=true` for debugging

**Production Setup:**

- Change to `hibernate.ddl-auto=validate` or `none`
- Set `show-sql=false`
- Use environment variables for database credentials
- Enable SSL connection
- Use connection pooling optimizations

## Next Steps

1. Install MySQL Server
2. Create the database using the SQL commands above
3. Update the password in `application.properties`
4. Run the Spring Boot application
5. Verify the tables are created by checking MySQL

The application will automatically create the `products` and `cart_items` tables when it starts up.
