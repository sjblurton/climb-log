# Climb Log API

A RESTful API for managing climbing locations, crags, routes, and climb logs built with Node.js, Express, and TypeScript.

## Features

- **Locations Management**: Create, read, update, and list climbing locations
- **Type Safety**: Full TypeScript support with Zod schema validation
- **Clean Architecture**: Layered architecture with separation of concerns
- **Error Handling**: Centralise error handling with custom HTTP errors
- **Testing**: Comprehensive test suite with isolated database
- **Code Quality**: ESLint configuration for consistent code style

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Validation**: Zod
- **Testing**: Vitest + Supertest
- **Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js (v20+)
- npm

### Installation

```bash
cd api
npm install
```

### Development

```bash
# Start development server with hot reload
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Type checking
npm run type-check

# Build for production
npm run build

# Start production server
npm start
```

### Swagger Docs

- UI: `http://localhost:3000/docs/`
- JSON: `http://localhost:3000/docs.json`

## API Endpoints

### Locations

- `GET /locations` - List all locations
- `POST /locations` - Create a new location
- `GET /locations/:id` - Get location by ID
- `PATCH /locations/:id` - Update location
- `DELETE /locations/:id` - Delete location

### Crags

- `GET /crags` - List all crags
- `POST /crags` - Create a new crag
- `GET /crags/:id` - Get crag by ID
- `PATCH /crags/:id` - Update crag
- `DELETE /crags/:id` - Delete crag

## Project Structure

```text
src/
├── db/                    # Database layer
│   ├── db.ts             # Database class
│   ├── database.json     # Production data
│   └── schemas/          # Zod schemas
├── middleware/           # Express middleware
│   ├── errorHandler.ts   # Error handling
│   └── validate.ts       # Request validation
├── modules/              # Feature modules
│   └── locations/        # Locations feature
│       ├── controller/   # HTTP controllers
│       ├── repository/   # Data access layer
│       ├── routes.ts     # Route definitions
│       └── service/      # Business logic
└── tests/                # Test files
```

## Development Guidelines

- Use classes for services, repositories, and controllers
- Validate input with Zod schemas
- Handle errors with custom `HttpError` class
- Write tests for all new features
- Run linting before committing

## License

MIT License
