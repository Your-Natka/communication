# communication

-Фронт: React + TypeScript -Бек: Python FastAPI -База данних: Postgres/MySQL Main Keys: Стилі повинні бути реалізовані за допомогою tailwind Додаток має бути докеризирований Реалізувати веб-додаток месенджер. Користувач повинен мати можливість авторизуватися/реєструватися та спілкуватися з іншими користувачами у форматі один на один (групові чати робити не потрібно). Користувач повинен мати можливість прикріпити кілька файлів до свого повідомлення, мати можливість редагувати та видаляти своє повідомлення. Авторизація користувачів повинна бути реалізована виключно за допомогою вбудованих можливостей FastAPI (JWT токени, OAuth2 схеми, middleware для перевірки автентифікації).

Фронтенд

React + TypeScript + Tailwind — SPA для користувача.

Тут буде логін/реєстрація, чат-інтерфейс, завантаження файлів, відображення повідомлень.

Фронт повинен "знати" тільки про REST/WebSocket API бекенду.

Бекенд

FastAPI + Postgres/MySQL

Реалізує авторизацію (JWT, OAuth2), REST API для користувачів і повідомлень.

Використовує WebSockets для реального часу в чаті.

Обробка завантаження файлів (FastAPI UploadFile).

CRUD для повідомлень (створення, редагування, видалення).

Middleware для перевірки JWT.

Docker

Кожна частина (фронт і бек) має свій Dockerfile.

Можна скласти все в docker-compose.yml:

frontend (React, зібраний і віддається nginx або Vite preview).

backend (FastAPI + Uvicorn).

db (Postgres або MySQL).

Окей 🚀
Нижче — базові кроки для старту репозиторію з назвою "Communication"
cd ~/Projects

mkdir Communication
cd Communication

git init

mkdir frontend backend

git add .
git commit -m " "

git remote add origin git@github.com:YOUR_USERNAME/Connection.git

git branch -M main
git push -u origin main

📦 1. Ініціалізація фронтенду (React + TypeScript + Tailwind через Vite)
cd frontend

npm create vite@latest . -- --template react-ts

npm install

# Tailwind + PostCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p


# У файлах src/index.css
 @tailwind base;
 @tailwind components;
 @tailwind utilities;

# Тестовий запуск
npm run dev

⚙️ 2. Ініціалізація бекенду (FastAPI + Docker-ready)

cd ../backend

python3 -m venv venv
source venv/bin/activate

# Встановлюємо FastAPI та залежності
pip install fastapi uvicorn[standard] sqlalchemy asyncpg alembic python-jose[cryptography] passlib[bcrypt] python-multipart

# Зафіксуємо у requirements.txt
pip freeze > requirements.txt

# Створюємо структуру
mkdir app
touch app/main.py

# app/main.py (мінімальний бекенд)
echo 'from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"msg": "Hello from Connection backend"}' > app/main.py

# Запуск для перевірки
uvicorn app.main:app --reload --port 8000

🐳 3. Docker-скелет
Backend backend/Dockerfile

Frontend frontend/Dockerfile

Кореневий docker-compose.yml


🔹 Архітектура застосунку
1. Backend (FastAPI)

📂 backend/

main.py — точка входу FastAPI

auth/ — авторизація

models.py — SQLAlchemy моделі користувачів

schemas.py — Pydantic схеми

routes.py — ендпоінти для login/register

jwt.py — генерація/перевірка JWT токенів

chat/ — функціонал месенджера

models.py — таблиці повідомлень, вкладень

schemas.py — Pydantic схеми повідомлень

routes.py — API для CRUD (створення, редагування, видалення повідомлень)

websockets.py — для live-чату (FastAPI WebSocket)

database.py — підключення до PostgreSQL (або SQLite на старті)

config.py — змінні середовища (JWT_SECRET, DB_URL)

🔑 Авторизація:

JWT (два токени: access_token і refresh_token – можна зробити тільки access, якщо простіше).

Використовуємо OAuth2PasswordBearer для захисту приватних роутів.


🔹 Архітектура застосунку
1. Backend (FastAPI)

📂 backend/

main.py — точка входу FastAPI

auth/ — авторизація

models.py — SQLAlchemy моделі користувачів

schemas.py — Pydantic схеми

routes.py — ендпоінти для login/register

jwt.py — генерація/перевірка JWT токенів

chat/ — функціонал месенджера

models.py — таблиці повідомлень, вкладень

schemas.py — Pydantic схеми повідомлень

routes.py — API для CRUD (створення, редагування, видалення повідомлень)

websockets.py — для live-чату (FastAPI WebSocket)

database.py — підключення до PostgreSQL (або SQLite на старті)

config.py — змінні середовища (JWT_SECRET, DB_URL)

🔑 Авторизація:

JWT (два токени: access_token і refresh_token – можна зробити тільки access, якщо простіше).

Використовуємо OAuth2PasswordBearer для захисту приватних роутів.

💬 Модель повідомлення:

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    receiver_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text, nullable=True)
    attachments = relationship("Attachment", back_populates="message")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)


📎 Модель вкладень (файлів):

class Attachment(Base):
    __tablename__ = "attachments"

    id = Column(Integer, primary_key=True, index=True)
    message_id = Column(Integer, ForeignKey("messages.id"))
    file_url = Column(String)
    file_type = Column(String)  # image, pdf, doc, etc.
    message = relationship("Message", back_populates="attachments")

2. Frontend (React + Tailwind + Vite)

📂 frontend/src/

App.tsx — роутинг

pages/

Login.tsx

Register.tsx

Chat.tsx (основний екран)

components/

Message.tsx — одне повідомлення

MessageInput.tsx — поле вводу з прикріпленням файлів

Sidebar.tsx — список контактів

services/api.ts — axios клієнт (авторизація, чати)

context/AuthContext.tsx — глобальний стан користувача

3. Функціонал

✅ Реєстрація / логін (JWT)
✅ Список контактів (вибираєш людину → відкривається чат)
✅ Відправка повідомлень + вкладення (кілька файлів)
✅ Редагування та видалення своїх повідомлень
✅ Live-чат через WebSocket
✅ Tailwind для UI


Якщо файл існує, але все одно помилка:

Переконайся, що в app/ є __init__.py (навіть пустий файл).
Це робить папку пакетом Python. Те саме в routers/.

touch app/__init__.py
touch app/routers/__init__.py



перезапусти:

uvicorn app.main:app --reload --port 8000

mydatabase=# CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    display_name VARCHAR(100)
);
CREATE TABLE
mydatabase=# \dt
              List of relations
 Schema |   Name   | Type  |      Owner      
--------+----------+-------+-----------------
 public | contacts | table | postgres
 public | items    | table | postgres
 public | users    | table | natalabodnarcuk
(3 rows)

mydatabase=# ALTER USER natalabodnarcuk WITH PASSWORD 'новий_пароль';
ALTER ROLE

natalabodnarcuk — ваш користувач

новий_пароль — пароль, який ви щойно задали

mydatabase — база даних, до якої підключаємося

{
  "username": "natala",
  "email": "natala@example.com",
  "password": "123456"
}

{
  "username": "testuser1",
  "email": "test1@example.com",
  "password": "Password123!"
}

1️⃣ Авторизація та реєстрація

Register (/api/auth/register)
✅ Реєстрація працює, дублікати username/email повертають 400.

Login (/api/auth/token)
✅ Логін працює, токен генерується.
⚠️ Перевірити: токен дійсний та можна використовувати для аутентифікації запитів.

JWT Middleware

Перевірити endpoint /users/me або подібний, який повертає дані користувача з токеном.

Якщо є помилка авторизації — треба налаштувати Depends з JWT.

2️⃣ База даних

Поки що ми використовуємо Postgres (лог показує Postgres команди).

Users table працює.

Наступне: Messages table — перевіримо структуру для:

тексту повідомлення

ID відправника та отримувача

файлів (можливо як JSON або окремий table)

дата створення, редагування, видалення

3️⃣ Мессенджер (основні фічі)

Один-на-один чат — таблиця messages + user_from + user_to.

CRUD повідомлень:

Create → додається повідомлення з/без файлів ✅

Read → можна отримати список повідомлень між двома користувачами

Update → редагування свого повідомлення

Delete → видалення свого повідомлення

Прикріплення файлів:

Поки треба перевірити, чи є endpoint /files/upload або обробка multipart/form-data.

4️⃣ Фронтенд

React + TypeScript ✅

Tailwind для стилів ✅

Перевірити підключення до бекенду через Axios/fetch та JWT токен

5️⃣ Docker

Перевірити Dockerfile та docker-compose.yml для:

FastAPI backend

React frontend

Postgres/MySQL

Можна запускати все локально командою docker-compose up --build

1️⃣ Таблиці бази даних

Перевіримо, чи є таблиці для:

users — вже є, працює ✅

messages — повинна містити:

id (PK)

text (текст повідомлення)

user_from_id (відправник)

user_to_id (отримувач)

created_at

updated_at

deleted (логічне видалення)

files (JSON або окремий table)

files (якщо робимо окремо):

id

message_id

filename

url/path

created_at

2️⃣ Endpoint-і для месенджера

Перевіримо, чи є:

Метод	Endpoint	Опис
GET	/messages/{user_id}	Повертає список повідомлень між поточним користувачем і user_id
POST	/messages	Створює повідомлення з текстом і файлами
PATCH	/messages/{msg_id}	Редагує своє повідомлення
DELETE	/messages/{msg_id}	Видаляє своє повідомлення
POST	/files/upload	Завантажує файли для повідомлення
3️⃣ JWT аутентифікація

Кожен endpoint має мати Depends(get_current_user)

Перевірка: якщо токен неправильний або не переданий → 401