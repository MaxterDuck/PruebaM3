

# 🎉 Event Management SPA with Vite + JSON Server

A modern **Single Page Application (SPA)** for event management, built with **Vite** (frontend) and **JSON Server** (mock backend).

---

## 🌟 Features

- 🔐 Authentication for admin and users (login/register, session persistence)
- 🗂️ CRUD for events (create, read, update, delete)
- � User registration and login
- 📅 Enrollments: users can enroll/unenroll in events (only once per event)
- 📋 Dedicated Enrollments view for users
- 🧠 Data validation and duplicate prevention
- 🔍 Real-time search for events
- 🖼️ Default avatar for users
- 📱 Responsive, modern UI (sidebar, event table, forms)

---

## 📁 Project Structure

```
Reto-SPA-Vite/
├── index.html
├── package.json
├── vite.config.js
├── db.json
├── reset.js
├── /src/
│   ├── main.js
│   ├── auth.js
│   ├── home.js
│   ├── Users.js
│   └── style.css
└── /imgs/
    ├── ImgProfile.jpg
    └── Incognito.jpeg
```

---

## 🚀 Installation & Usage

### 1️⃣ Clone the repository

```bash
git clone https://github.com/MaxterDuck/Reto-SPA-Vite.git
cd PruebaM3
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Start JSON Server (mock backend)

```bash
npx json-server --watch db.json --port 3000
```

Backend running at: [http://localhost:3000/events](http://localhost:3000/events)

### 4️⃣ Start the Vite frontend

```bash
npm run dev
```

Frontend running at: [http://localhost:5173](http://localhost:5173)

---

## 🔐 Default Credentials

| Username | Password |
|----------|----------|
| Admin    | 1234     |
| Lola     | 1234     |
| Pepe     | 1234     |

---

## 🧪 Scripts Disponibles

| Comando         | Descripción                                      |
|-----------------|--------------------------------------------------|
| `npm run dev`   | Vite begins for frontend development        |
| `npm run server`| Start JSON Server to simulate the database |
| `node reset.js` | Reset the database. |

---

## 🧾 Database Structure (`db.json`)

```json
{
  "users": [
    {
      "id": 1,
      "username": "Admin",
      "password": "1234",
      "name": "Administrador",
      "email": "admin@admin.com",
      "role": "admin"
    },
    // ...more users
  ],
  "events": [
    {
      "id": 1,
      "name": "Fiesta",
      "description": "Es el proximo projecto X",
      "capacity": 30,
      "date": "2025-07-20",
      "enrolledUsers": []
    },
    // ...more events
  ]
}
```

---

## 🧠 Technologies Used

- ⚡ Vite
- 📦 JSON Server
- 🎨 Custom CSS (no frameworks)
- 🧹 Vanilla JavaScript

---

## 👨‍💻 Author

**Tomas Restrepo**  
Modern SPA practice project for event management using Vite and lightweight tools.

---



