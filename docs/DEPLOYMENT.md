# Deployment Guide

This guide covers how to deploy SolarWise LK to production.

## 🚀 Production Deployment

### Prerequisites
- Production server with Node.js 18+
- MySQL database
- Domain name
- SSL certificate
- AWS S3 bucket (for file storage)

### Environment Setup

1. Clone the repository on the server:
```bash
git clone https://github.com/RajanthaR/web-manus-solarwise-lk.git
cd web-manus-solarwise-lk
```

2. Install dependencies:
```bash
pnpm install --prod
```

3. Set up environment variables:
```bash
cp .env.example .env.production
```

Required environment variables:
```env
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=mysql://user:password@localhost:3306/solarwise_lk

# JWT
JWT_SECRET=your-super-secret-jwt-key

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=your-bucket-name

# OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Database Setup

1. Create the database:
```sql
CREATE DATABASE solarwise_lk;
```

2. Run migrations:
```bash
pnpm run db:push
```

3. Seed data (optional):
```bash
pnpm run db:seed
```

### Building the Application

```bash
pnpm run build
```

This creates:
- `dist/index.js` - Server bundle
- `dist/public/` - Static files

### Running with PM2

Install PM2:
```bash
npm install -g pm2
```

Create PM2 config file `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'solarwise-lk',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

Start the application:
```bash
pm2 start ecosystem.config.js
```

## 🌐 Nginx Configuration

Create `/etc/nginx/sites-available/solarwise-lk`:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # File upload limit
    client_max_body_size 50M;
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/solarwise-lk /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🐳 Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .
RUN pnpm run build

FROM node:18-alpine AS runner

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/index.js"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mysql://root:password@db:3306/solarwise_lk
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: solarwise_lk
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped

volumes:
  mysql_data:
```

Deploy with Docker:
```bash
docker-compose up -d
```

## 🔒 Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **Environment Variables**: Never commit secrets to git
3. **Database Security**: Use strong passwords and limit access
4. **CORS**: Configure CORS properly for your domain
5. **Rate Limiting**: Implement rate limiting on API endpoints
6. **Input Validation**: Validate all user inputs
7. **Dependencies**: Keep dependencies updated

## 📊 Monitoring

### PM2 Monitoring
```bash
pm2 monit
pm2 logs solarwise-lk
```

### Health Check Endpoint
Add to your server:
```typescript
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

### Log Management
Configure log rotation:
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install pnpm
        run: npm install -g pnpm
        
      - name: Install dependencies
        run: pnpm install
        
      - name: Build
        run: pnpm run build
        
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /path/to/app
            git pull origin main
            pnpm install --prod
            pnpm run build
            pm2 reload solarwise-lk
```

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   sudo lsof -i :3000
   sudo kill -9 <PID>
   ```

2. **Database connection failed**:
   - Check DATABASE_URL
   - Verify database is running
   - Check firewall settings

3. **Build fails**:
   - Clear node_modules: `rm -rf node_modules`
   - Reinstall: `pnpm install`
   - Check TypeScript errors

4. **502 Bad Gateway**:
   - Check if app is running: `pm2 status`
   - Check Nginx error logs
   - Verify port configuration

### Performance Optimization

1. Enable gzip compression
2. Use CDN for static assets
3. Implement caching
4. Optimize database queries
5. Use PM2 cluster mode

## 📋 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database created and migrated
- [ ] SSL certificate installed
- [ ] Nginx configured
- [ ] PM2 process running
- [ ] Health check endpoint accessible
- [ ] Logs configured
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Security headers configured
