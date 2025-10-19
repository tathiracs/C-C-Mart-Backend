Backend Spring scaffold

This is a minimal Spring Boot scaffold created to start migrating the Node/Express backend to Java/Spring Boot.

How to build (requires Java 17 and Maven):

In PowerShell:

mvn -f backend-spring\pom.xml clean package

To run:

java -jar backend-spring\target\backend-spring-0.0.1-SNAPSHOT.jar

Environment variables (optional):
- DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
- JWT_SECRET

The scaffold includes a minimal User entity, repository, service, and auth controller with JWT token generation. Security is configured to allow `/api/auth/**` endpoints.
