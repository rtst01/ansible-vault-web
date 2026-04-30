export interface VaultTemplate {
  id: string;
  name: string;
  desc: string;
  tag: string;
  content: string;
}

export const VAULT_TEMPLATES: VaultTemplate[] = [
  {
    id: 'k8s-secret',
    name: 'Kubernetes Secret',
    desc: 'Secret manifest with stringData',
    tag: 'k8s',
    content: `apiVersion: v1
kind: Secret
metadata:
  name: app-credentials
  namespace: production
type: Opaque
stringData:
  DB_USER: "app_service"
  DB_PASSWORD: "ChangeMe_S3cur3!"
  API_KEY: "sk_live_REPLACE_ME"
  JWT_SECRET: "REPLACE_WITH_STRONG_SECRET_64+"
`,
  },
  {
    id: 'k8s-cm',
    name: 'Kubernetes ConfigMap',
    desc: 'Application config',
    tag: 'k8s',
    content: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: production
data:
  LOG_LEVEL: "info"
  CACHE_TTL: "3600"
  FEATURE_FLAGS: "billing_v2,new_onboarding"
  SENTRY_DSN: "https://example@sentry.io/123"
`,
  },
  {
    id: 'docker-compose',
    name: 'Docker Compose',
    desc: 'Stack with environment variables',
    tag: 'docker',
    content: `version: '3.9'
services:
  api:
    image: registry.example.com/api:latest
    environment:
      DATABASE_URL: "postgres://app:CHANGE_ME@db:5432/app"
      REDIS_URL: "redis://:CHANGE_ME@redis:6379/0"
      SECRET_KEY_BASE: "REPLACE_WITH_64_CHAR_HEX"
    ports:
      - "8080:8080"
`,
  },
  {
    id: 'env',
    name: '.env file',
    desc: 'Environment variables KEY=VALUE',
    tag: 'env',
    content: `# Production environment
DATABASE_URL=postgres://app:ChangeMe@db.example.com:5432/app
REDIS_URL=redis://:ChangeMe@redis.example.com:6379/0
JWT_SECRET=REPLACE_WITH_STRONG_SECRET
STRIPE_SECRET_KEY=sk_live_REPLACE
SENDGRID_API_KEY=SG.REPLACE
S3_ACCESS_KEY=AKIAREPLACE
S3_SECRET_KEY=REPLACE_WITH_AWS_SECRET
`,
  },
  {
    id: 'ansible-vars',
    name: 'Ansible group_vars',
    desc: 'Host group variables',
    tag: 'ansible',
    content: `---
db_host: "db.internal.example.com"
db_port: 5432
db_user: "deploy"
db_password: "CHANGE_ME_BEFORE_USING"

api:
  base_url: "https://api.example.com"
  token: "REPLACE_WITH_BEARER_TOKEN"
  timeout: 30

aws:
  access_key: "AKIAREPLACE"
  secret_key: "REPLACE_WITH_AWS_SECRET"
  region: "eu-west-1"
`,
  },
  {
    id: 'ssh-key',
    name: 'SSH private key',
    desc: 'OpenSSH private key',
    tag: 'ssh',
    content: `-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABFwAAAAdzc2gtcn
NhAAAAAwEAAQAAAQEA1234567890abcdefghijklmnopqrstuvwxyzREPLACE_THIS_KEY
-----END OPENSSH PRIVATE KEY-----
`,
  },
  {
    id: 'nginx',
    name: 'Nginx + TLS',
    desc: 'Config with SSL certificates',
    tag: 'nginx',
    content: `server {
  listen 443 ssl http2;
  server_name app.example.com;

  ssl_certificate     /etc/ssl/private/app.crt;
  ssl_certificate_key /etc/ssl/private/app.key;

  auth_basic           "Restricted";
  auth_basic_user_file /etc/nginx/.htpasswd;

  location / {
    proxy_pass http://app:8080;
  }
}
`,
  },
  {
    id: 'plain',
    name: 'Plain text secret',
    desc: 'Simple string / token',
    tag: 'misc',
    content: `# Replace this with your secret
sk_live_REPLACE_THIS_WITH_REAL_TOKEN_xxxxxxxxxxxxxxxx
`,
  },
];
