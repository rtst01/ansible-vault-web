import React, { useState } from 'react';

interface Template {
    id: string;
    name: string;
    description: string;
    content: string;
    category: string;
    icon: string;
}

const FileTemplates: React.FC = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    const templates: Template[] = [
        {
            id: 'k8s-secret',
            name: 'Kubernetes Secret',
            description: 'Базовый шаблон для Kubernetes Secret с переменными окружения',
            category: 'Kubernetes',
            icon: '☸️',
            content: `apiVersion: v1
kind: Secret
metadata:
  name: app-secret
  namespace: default
type: Opaque
stringData:
  DATABASE_URL: "postgresql://user:password@localhost:5432/dbname"
  API_KEY: "your-api-key-here"
  REDIS_PASSWORD: "redis-password"
  JWT_SECRET: "your-jwt-secret-key"
  SMTP_PASSWORD: "smtp-password"
  AWS_ACCESS_KEY: "AKIAIOSFODNN7EXAMPLE"
  AWS_SECRET_KEY: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"`
        },
        {
            id: 'k8s-configmap',
            name: 'Kubernetes ConfigMap',
            description: 'Шаблон для конфигурационных данных приложения',
            category: 'Kubernetes',
            icon: '⚙️',
            content: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: default
data:
  LOG_LEVEL: "INFO"
  ENVIRONMENT: "production"
  MAX_CONNECTIONS: "100"
  TIMEOUT: "30s"
  FEATURE_FLAGS: "feature1,feature2,feature3"
  CACHE_TTL: "3600"
  API_VERSION: "v1"
  DEBUG_MODE: "false"`
        },
        {
            id: 'docker-compose',
            name: 'Docker Compose',
            description: 'Шаблон для Docker Compose с переменными окружения',
            category: 'Docker',
            icon: '🐳',
            content: `version: '3.8'
services:
  app:
    image: myapp:latest
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/dbname
      - REDIS_URL=redis://redis:6379
      - API_KEY=your-api-key
      - DEBUG=false
      - LOG_LEVEL=INFO
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=dbname
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:6-alpine
    command: redis-server --requirepass redis-password

volumes:
  postgres_data:`
        },
        {
            id: 'env-file',
            name: '.env файл',
            description: 'Шаблон для переменных окружения',
            category: 'Environment',
            icon: '🔧',
            content: `# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
DATABASE_POOL_SIZE=10
DATABASE_TIMEOUT=30s

# API Configuration
API_KEY=your-api-key-here
API_SECRET=your-api-secret
API_RATE_LIMIT=1000

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=redis-password
REDIS_DB=0

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# AWS Configuration
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-west-2
AWS_S3_BUCKET=my-app-bucket

# Application Configuration
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
DEBUG=false
CORS_ORIGIN=https://myapp.com`
        },
        {
            id: 'nginx-config',
            name: 'Nginx конфигурация',
            description: 'Шаблон для Nginx с SSL и проксированием',
            category: 'Web Server',
            icon: '🌐',
            content: `server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com www.example.com;
    
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
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
    
    location /static/ {
        alias /var/www/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}`
        },
        {
            id: 'ansible-inventory',
            name: 'Ansible Inventory',
            description: 'Шаблон для Ansible inventory с группами хостов',
            category: 'Ansible',
            icon: '🤖',
            content: `[webservers]
web1.example.com ansible_host=192.168.1.10 ansible_user=ubuntu
web2.example.com ansible_host=192.168.1.11 ansible_user=ubuntu
web3.example.com ansible_host=192.168.1.12 ansible_user=ubuntu

[dbservers]
db1.example.com ansible_host=192.168.1.20 ansible_user=ubuntu
db2.example.com ansible_host=192.168.1.21 ansible_user=ubuntu

[loadbalancers]
lb1.example.com ansible_host=192.168.1.30 ansible_user=ubuntu
lb2.example.com ansible_host=192.168.1.31 ansible_user=ubuntu

[monitoring]
mon1.example.com ansible_host=192.168.1.40 ansible_user=ubuntu

[all:vars]
ansible_python_interpreter=/usr/bin/python3
ansible_ssh_private_key_file=~/.ssh/id_rsa
ansible_become=yes
ansible_become_method=sudo

[webservers:vars]
http_port=80
https_port=443
max_clients=200

[dbservers:vars]
db_port=5432
db_name=myapp
db_user=dbuser`
        }
    ];

    const handleTemplateSelect = (template: Template) => {
        setSelectedTemplate(template);
        setShowPreview(true);
    };

    const handleUseTemplate = () => {
        if (selectedTemplate) {
            // Переключаемся на вкладку шифрования текста и передаем шаблон
            // Здесь можно использовать localStorage или context для передачи данных
            localStorage.setItem('selectedTemplate', JSON.stringify(selectedTemplate));
            window.location.hash = '#text-tab';
            // Можно также добавить уведомление пользователю
            alert(`Шаблон "${selectedTemplate.name}" скопирован! Перейдите на вкладку "Шифрование текста" для использования.`);
        }
    };

    const categories = templates
        .map(t => t.category)
        .filter((category, index, self) => self.indexOf(category) === index);

    return (
        <div className="card">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">📋 Шаблоны файлов</h2>
                <p className="text-gray-600">
                    Готовые шаблоны для быстрого создания конфигурационных файлов
                </p>
            </div>

            {/* Категории */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Категории:</h3>
                <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                        <span
                            key={category}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                            {category}
                        </span>
                    ))}
                </div>
            </div>

            {/* Список шаблонов */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                {templates.map(template => (
                    <div
                        key={template.id}
                        className="template-card border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => handleTemplateSelect(template)}
                    >
                        <div className="flex items-start space-x-3">
                            <div className="text-2xl">{template.icon}</div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                                <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                                <span className="category-badge bg-gray-100 text-gray-700">
                                    {template.category}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Предварительный просмотр */}
            {showPreview && selectedTemplate && (
                <div className="template-preview border border-gray-200 rounded-lg p-6 bg-gray-50 slide-in-up">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                            {selectedTemplate.icon} {selectedTemplate.name}
                        </h3>
                        <button
                            onClick={() => setShowPreview(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <p className="text-gray-600 mb-4">{selectedTemplate.description}</p>

                    <div className="bg-white border border-gray-200 rounded p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Предварительный просмотр:</span>
                            <button
                                onClick={() => navigator.clipboard.writeText(selectedTemplate.content)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                                📋 Копировать
                            </button>
                        </div>
                        <pre className="preview-content text-xs text-gray-800 overflow-x-auto whitespace-pre-wrap">
                            {selectedTemplate.content}
                        </pre>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={handleUseTemplate}
                            className="btn-template"
                        >
                            📝 Использовать шаблон
                        </button>
                        <button
                            onClick={() => setShowPreview(false)}
                            className="btn bg-gray-500 hover:bg-gray-600 text-white"
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            )}

            {/* Инструкции */}
            <div className="instructions-box mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Как использовать шаблоны:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                    <li>Выберите нужный шаблон из списка выше</li>
                    <li>Просмотрите содержимое в предварительном просмотре</li>
                    <li>Нажмите "Использовать шаблон"</li>
                    <li>Перейдите на вкладку "Шифрование текста"</li>
                    <li>Шаблон будет автоматически подставлен в поле ввода</li>
                    <li>Отредактируйте содержимое под ваши нужды</li>
                    <li>Зашифруйте файл с помощью Ansible Vault</li>
                </ol>
            </div>
        </div>
    );
};

export default FileTemplates;
