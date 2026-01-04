# Backend-for-Frontend (BFF) Microservice

A NestJS-based BFF service that orchestrates requests between the frontend and backend microservices, aggregating data and handling cross-cutting concerns.

## Endpoints

### Admin Endpoints (Admin Only)

- `POST /admin/staff/register` - Register a new staff member (orchestrates with Auth and Staffs services)
- `GET /admin/staff-attendance` - Get combined staff and attendance data with unified filtering and sorting

## Installation (Dev)

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your service URLs and other configuration
```

3. Run the service:
```bash
npm run start:dev
```

## Usage (Dev)

Start the development server:
```bash
npm run start:dev
```

The service will be available at `http://localhost:3003` (or the port specified in your `.env` file).