# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Overview

This is a Node.js learning project (Udemy course by Maximilian Schwarzmüller) containing two separate Express.js applications:

- **`app/`** - Full-stack web application with server-side rendering (EJS templates)
- **`api/`** - REST + GraphQL API backend

Each directory is a standalone Node.js project with its own `package.json` and dependencies.

## Commands

### App (Full-stack web application)

```bash
cd app
npm install              # Install dependencies
npm start                # Start with nodemon (development)
npm run start-server     # Start with node (production)
npm run lint             # Run ESLint
```

Runs on port **3000**.

### API (REST/GraphQL backend)

```bash
cd api
npm install              # Install dependencies
npm start                # Start with nodemon (development)
npm run lint             # Run ESLint
node swagger-generate.js # Regenerate Swagger documentation
```

Runs on port **8080** (configurable via `PORT` env variable).

## Environment Variables

Both apps require a `.env` file. Key variables:

| Variable | Used In | Description |
|----------|---------|-------------|
| `MONGO_DB_CONNECTION_STRING` | Both | MongoDB connection string |
| `SESSION_SECRET` | app | Express session secret |
| `JWT_SECRET` | api | JWT signing secret |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `API_KEY` | app | Email (nodemailer) configuration |
| `STRIPE_SECRET_KEY` | app | Stripe payment integration |

See `app/example.env` for reference.

## Architecture

### App (`app/`)

MVC architecture with server-side rendering:

- **`controllers/`** - Request handlers (admin, auth, shop, error)
- **`models/`** - Mongoose models (User, Product, Order)
- **`routes/`** - Express routers with validation (admin, auth, shop)
- **`middleware/is-auth.js`** - Session-based authentication guard
- **`views/`** - EJS templates
- **`public/`** - Static assets

Key middleware chain in `app.js`:
1. Body parsing (urlencoded) + Multer (file uploads)
2. Static file serving
3. Session management with MongoDB store
4. CSRF protection
5. Flash messages
6. User loading from session
7. Routes (admin, shop, auth)
8. Error handling

Authentication: Session-based with `connect-mongodb-session` storage.

### API (`api/`)

REST endpoints are defined but currently disabled in favor of GraphQL:

- **`graphql/schema.js`** - GraphQL type definitions (User, Post, AuthData)
- **`graphql/resolvers.js`** - Query/mutation implementations
- **`controllers/`** - REST handlers (feed, auth) - currently unused
- **`routes/`** - REST routes - currently commented out
- **`middleware/auth.js`** - JWT token validation (sets `req.isAuth`, `req.userId`)
- **`middleware/is-auth.js`** - Throws error if not authenticated

GraphQL endpoint: `http://localhost:8080/graphql` (GraphiQL enabled)
Swagger docs: `http://localhost:8080/api-docs`

Authentication: JWT tokens via `Authorization: Bearer <token>` header.

### Shared Patterns

- Both apps use Mongoose for MongoDB ODM
- File uploads handled by Multer, stored in `images/` directory
- Validation: `express-validator` (routes) or `validator` (GraphQL resolvers)
- Password hashing: `bcryptjs`
