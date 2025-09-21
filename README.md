# USOF Backend

Backend-частина навчального проєкту **USOF (University Stack Overflow)** — платформи для публікації постів, коментарів та оцінки матеріалів (лайки/дизлайки), з підтримкою категорій, авторизацією та системою ролей.

## ✨ Можливості
- Реєстрація та авторизація користувачів (JWT-токени)
- Розмежування доступу (user / admin)
- CRUD для постів, коментарів і категорій
- Лайки/дизлайки та рейтинг
- Фільтрація, сортування, пагінація
- Керування сесіями та обмеження за кількістю пристроїв
- Swagger-документація для API

## 🛠️ Технології
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)  
- [Sequelize](https://sequelize.org/) (ORM для роботи з БД)  
- [MySQL](https://www.mysql.com/) (можна замінити на PostgreSQL)  
- JWT для аутентифікації  
- ESLint + Prettier (єдиний стиль коду)
## ⚙️ Встановлення та запуск

1. Клонувати репозиторій і встановити залежності:
   ```bash
   npm install
   ```

2. Створити файл `.env` на основі `.env.example`:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASS=password
   DB_NAME=usof
   JWT_KEY=supersecret
   ```

3. Виконати міграції та сіди:
   ```bash
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

4. Запустити сервер:
   ```bash
   npm run dev
   ```
   За замовчуванням сервер доступний на `http://localhost:3000`.

## 📖 Документація API
Після запуску можна відкрити Swagger UI за адресою:  
```
http://localhost:3000/api-docs
```

## 🧪 Тестування
Тести можна запускати через [Jest](https://jestjs.io/):
```bash
npm test
```
