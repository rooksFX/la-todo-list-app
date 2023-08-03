# la-todo-list-app

## Setup

- Clone this repo then
- Open a terminal in the cloned repo and then run the following commands:
- `npm install` - for installing concurrently
- `npm run install-client` - for installing packages for the client app
- `npm run install-server` - for installing packages for the server

Server will run on **http://localhost:8000/**
Client will run on **http://localhost:5173/**

## Structure of the App

This project is using a Monorepo setup. This one repository consist of a Client (app) folder and a Server (api) folder.

### Client

- Created using Vite
- Typescript
- Context API and React Hooks for state management

**Structure**

- **Views** - consist of non-reusable components and each represents a **page/route**
- **Components** - consist of reusable components (e.g, **Spinner**)
- **Context** - handles higher level states like the **login detais** data fetch from the API

---

### Server

- **Node.js**
- **Express.js**
- **Mongoose**
- **MongoDB** for database

**Structure**

- **Controllers** -
- **Models**
- **Middleware**
- **Routes**
