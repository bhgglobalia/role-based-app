# Fullstack Login Demo (Node.js + React + TypeScript)

This is a minimal full-stack project that implements a basic login flow using:

- **Frontend**: React + TypeScript
- **Backend**: Node.js (Express) + TypeScript
- **Database**: sqlite
- **Build**: Single combined build for deployment

---

## ⚙️ Features

- Separate login for **students** (firstName + password) and **teachers** (name + classId + password)
- User data stored in sqlite
- Unified build system for easy deployment
- Serves the React build from the same Node server in production

---

## Steps to run the application

- Install dependency in root directory and as well as in frontend directory

- Init the database with following command. This will create a database and insert sample data.
   `npx ts-node backend/init-db.ts`

- Run the application with following command.
  ` node dist/server.js`
