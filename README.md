# ClimbLog 🧗

A full-stack climbing diary application for logging climbs and tracking progress.

This project is built as a portfolio project to demonstrate full-stack development skills using a modern React frontend and a Node.js API.

---

## Project Structure

```text
climb-log
│
├── api
│   Node.js API
│
├── frontend
│   React application
│
└── docs
```

---

## Tech Stack

Backend:

- Node.js
- Express

Frontend:

- React
- Material UI

---

## Features

- Log climbing attempts
- Track routes and grades
- Organise climbs by location and crag
- Support for bouldering and lead climbing
- Indoor and outdoor climbing model

---

## Architecture

The system models real-world climbing structure:

```text
Location
   └── Crag
         └── Route
               └── ClimbLog
```

---

## Getting Started

### 1 Clone repository

```text
git clone https://github.com/sjblurton/climb-log
```

### 2 Start the API

```text
cd api
npm install
npm run dev
```

### 3 Start the frontend

```text
cd frontend
npm install
npm run dev
```

---

## API Documentation

See:

```text
/api/README.md
```

---

## Frontend Documentation

See:

```text
/frontend/README.md
```

---

## Future Improvements

- Authentication
- PostgreSQL database
- Climbing statistics
- Progress tracking
- Session logging
- Mobile UI improvements

---

## License

MIT
