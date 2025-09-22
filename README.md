Перед запуском проекта необходимо создать PostgreSQL базу данных.

После создания базы данных выполните следующие команды:

```bash
npm install          # Установка зависимостей
npm run build        # Сборка проекта
npm run migration:up # Применение миграций
npm run seed         # Наполнение базы начальными данными
npm run start:prod   # Запуск проекта
```

После выполнения этих команд проект запустится. В консоли появится ссылка на Swagger, 
где можно будет вызывать эндпоинты для проверки.
    В коде реализован метод обновления пары токенов access/refresh, но эндпоинт для него не реализован.
    Для проверки используется хэшированный fingerprint, который ломается в Swagger, поэтому метод работать не будет.

Настройки базы данных^
В файле database.module свойство logging: true прописано намеренно, чтобы удобно тестировать наличие кэширования при получении списка статей.

Тестирование
Для запуска юнит-тестов используйте дефолтные команды из package.json:

```bash
npm run test # запуск всех тестов
```

Необходимые переменные окружения (.env)
````
PORT=30440

DATABASE_HOST=localhost
DATABASE_USER=postgres
DATABASE_PASSWORD=
DATABASE_PORT=5432
DATABASE_NAME=qtim

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=1
REDIS_TTL=60000

JWT_TOKEN_SECRET=wpwsyZaSGXcT1Dx7mYFN018GZvYzwqptHInTt39FOpj9oKtoYU4N7r3vwzVOHnB6padW61g40qFzJRG3RbBuaQ
JWT_TOKEN_LIFE_TIME=24h

TOKEN_LIFE_TIME=30d
TOKEN_SECRET=po%{*O8j)o**on_ew4tm:w*(pnge
````

Если потребуется поддержка Docker и docker-compose, 
дайте знать — могу добавить инструкции и файлы для запуска проекта в контейнерах.