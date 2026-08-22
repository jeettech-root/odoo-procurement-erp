# API

This document is reserved for the GlobeTrotter API contract.

## Trip routes

All Trip routes require a JWT in the `Authorization: Bearer <token>` header. Trips are always scoped to the authenticated user.

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/trips` | Create a trip |
| `GET` | `/api/trips` | List the authenticated user's trips |
| `GET` | `/api/trips/:id` | Get one owned trip |
| `PATCH` | `/api/trips/:id` | Update one owned trip |
| `DELETE` | `/api/trips/:id` | Delete one owned trip |

Trip input fields are `title`, optional `description`, `startDate`, and `endDate`. The API returns `404` when a trip does not belong to the authenticated user.
