# Style Guide - Ansible Vault Web Service

## 🎨 Цветовая палитра

### Основные цвета
- **Primary**: `#2563eb` (синий) - основной цвет интерфейса
- **Secondary**: `#7c3aed` (фиолетовый) - акценты и кнопки
- **Success**: `#059669` (зеленый) - успешные операции
- **Warning**: `#d97706` (оранжевый) - предупреждения
- **Error**: `#dc2626` (красный) - ошибки
- **Info**: `#0891b2` (голубой) - информационные сообщения

### Нейтральные цвета
- **White**: `#ffffff`
- **Gray 50**: `#f9fafb`
- **Gray 100**: `#f3f4f6`
- **Gray 200**: `#e5e7eb`
- **Gray 300**: `#d1d5db`
- **Gray 400**: `#9ca3af`
- **Gray 500**: `#6b7280`
- **Gray 600**: `#4b5563`
- **Gray 700**: `#374151`
- **Gray 800**: `#1f2937`
- **Gray 900**: `#111827`
- **Black**: `#000000`

## 🔤 Типографика

### Шрифты
- **Primary Font**: Inter, system-ui, sans-serif
- **Monospace**: JetBrains Mono, Consolas, monospace (для кода)

### Размеры и веса
- **H1**: `text-4xl font-bold` (36px, 700)
- **H2**: `text-3xl font-semibold` (30px, 600)
- **H3**: `text-2xl font-semibold` (24px, 600)
- **H4**: `text-xl font-medium` (20px, 500)
- **Body Large**: `text-lg font-normal` (18px, 400)
- **Body**: `text-base font-normal` (16px, 400)
- **Body Small**: `text-sm font-normal` (14px, 400)
- **Caption**: `text-xs font-medium` (12px, 500)

## 📏 Система отступов

### Базовые единицы
- **Base Unit**: 4px
- **Spacing Scale**: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64

### Отступы
- **XS**: `p-1` (4px)
- **S**: `p-2` (8px)
- **M**: `p-4` (16px)
- **L**: `p-6` (24px)
- **XL**: `p-8` (32px)
- **XXL**: `p-12` (48px)

## 🧩 Компоненты

### Кнопки
- **Primary Button**: `bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors`
- **Secondary Button**: `bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors`
- **Danger Button**: `bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors`
- **Ghost Button**: `text-gray-600 hover:text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors`

### Поля ввода
- **Input**: `border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent`
- **Textarea**: `border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical`

### Карточки
- **Card**: `bg-white rounded-xl shadow-sm border border-gray-200 p-6`
- **Card Hover**: `hover:shadow-md transition-shadow`

### Алерты
- **Success**: `bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg`
- **Warning**: `bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg`
- **Error**: `bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg`
- **Info**: `bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg`

## 🎯 Тема и стиль

### Общий стиль
- **Modern & Clean**: Минималистичный дизайн с акцентом на функциональность
- **Security-Focused**: Визуальные элементы, подчеркивающие безопасность
- **Professional**: Корпоративный стиль для доверия пользователей

### Иконки
- **Icon Style**: Outline иконки (Heroicons, Lucide)
- **Icon Size**: 20px для стандартных, 24px для крупных
- **Icon Color**: Соответствует контексту (primary для действий, gray для декоративных)

## 📱 Адаптивность

### Breakpoints
- **Mobile**: `sm:` (640px+)
- **Tablet**: `md:` (768px+)
- **Desktop**: `lg:` (1024px+)
- **Large Desktop**: `xl:` (1280px+)

### Мобильная адаптация
- Упрощенные формы на мобильных устройствах
- Вертикальное расположение элементов
- Увеличенные области касания для мобильных устройств
