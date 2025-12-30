# API Documentation

## Overview

SolarWise LK uses tRPC for type-safe API endpoints. All API calls are made to `/api/trpc/*`.

## Authentication

The API uses JWT-based authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Base URL

- Development: `http://localhost:3000/api/trpc`
- Production: `https://your-domain.com/api/trpc`

## Available Endpoints

### Auth Routes

#### `auth.signIn`
Sign in with email and password.

**Input:**
```typescript
{
  email: string;
  password: string;
}
```

**Output:**
```typescript
{
  user: User;
  token: string;
}
```

#### `auth.signOut`
Sign out the current user.

**Input:** `null`

**Output:** `boolean`

#### `auth.signUp`
Register a new user account.

**Input:**
```typescript
{
  email: string;
  password: string;
  name: string;
}
```

**Output:**
```typescript
{
  user: User;
  token: string;
}
```

### Provider Routes

#### `providers.getAll`
Get all solar providers.

**Input:** `null`

**Output:** `Provider[]`

#### `providers.getById`
Get a provider by ID.

**Input:**
```typescript
{
  id: number;
}
```

**Output:** `Provider`

### Package Routes

#### `packages.getAll`
Get all solar packages with optional filtering.

**Input:**
```typescript
{
  providerId?: number;
  type?: 'on-grid' | 'off-grid' | 'hybrid';
  minPrice?: number;
  maxPrice?: number;
}
```

**Output:** `Package[]`

#### `packages.getById`
Get a package by ID with all details.

**Input:**
```typescript
{
  id: number;
}
```

**Output:** `Package`

#### `packages.compare`
Compare multiple packages.

**Input:**
```typescript
{
  packageIds: number[];
}
```

**Output:** `PackageComparison[]`

### Calculator Routes

#### `calculator.calculateROI`
Calculate return on investment for a solar package.

**Input:**
```typescript
{
  packageId: number;
  monthlyConsumption: number;
  location: string;
}
```

**Output:**
```typescript
{
  roi: number;
  paybackPeriod: number;
  monthlySavings: number;
  yearlySavings: number;
  projections: YearlyProjection[];
}
```

### Hardware Routes

#### `hardware.getAll`
Get all hardware components.

**Input:**
```typescript
{
  type?: 'panel' | 'inverter' | 'battery';
  brand?: string;
}
```

**Output:** `Hardware[]`

#### `hardware.getReviews`
Get reviews for a hardware component.

**Input:**
```typescript
{
  hardwareId: number;
}
```

**Output:** `HardwareReview[]`

### Review Routes

#### `reviews.create`
Create a new review.

**Input:**
```typescript
{
  packageId: number;
  rating: number;
  title: string;
  content: string;
  pros?: string[];
  cons?: string[];
  photos?: string[];
}
```

**Output:** `Review`

#### `reviews.getByPackage`
Get reviews for a package.

**Input:**
```typescript
{
  packageId: number;
  page?: number;
  limit?: number;
}
```

**Output:** `PaginatedReviews`

### Chat Routes

#### `chat.sendMessage`
Send a message to the AI assistant.

**Input:**
```typescript
{
  message: string;
  context?: {
    packageId?: number;
    hardwareId?: number;
  };
}
```

**Output:**
```typescript
{
  response: string;
  suggestions: string[];
}
```

## Data Types

### User
```typescript
{
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
```

### Provider
```typescript
{
  id: number;
  name: string;
  description: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  rating: number;
  verified: boolean;
}
```

### Package
```typescript
{
  id: number;
  name: string;
  description: string;
  type: 'on-grid' | 'off-grid' | 'hybrid';
  price: number;
  providerId: number;
  systemSize: number;
  panelId: number;
  inverterId: number;
  batteryId?: number;
  warranty: number;
  features: string[];
  createdAt: Date;
}
```

### Hardware
```typescript
{
  id: number;
  name: string;
  type: 'panel' | 'inverter' | 'battery';
  brand: string;
  model: string;
  specifications: Record<string, any>;
  qualityScore: number;
  pros: string[];
  cons: string[];
  price: number;
}
```

## Error Handling

All errors follow the tRPC error format:

```typescript
{
  error: {
    message: string;
    code: string;
    data?: any;
  }
}
```

Common error codes:
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `BAD_REQUEST`: Invalid input
- `INTERNAL_SERVER_ERROR`: Server error

## Rate Limiting

API endpoints are rate-limited:
- Auth endpoints: 5 requests per minute
- Calculator: 20 requests per minute
- Other endpoints: 100 requests per minute

## Pagination

List endpoints support pagination:
```typescript
{
  page: number; // 1-based
  limit: number; // max 100
}
```

Response includes pagination info:
```typescript
{
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```
