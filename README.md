<p align="center">
  <a href="https://clerk.com?utm_source=github&utm_medium=clerk_docs" target="_blank" rel="noopener noreferrer">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./public/light-logo.png">
      <img alt="Logo" src="./public/dark-logo.png" height="64">
    </picture>
  </a>
  <br />
</p>

## Description

**Breezly** is a simple blogging website where users can create and share their blogs with other users.

## Installation

```bash
$ pnpm install
```

## Environment

```bash
# Clerk
CLERK_SIGNATURE=...
CLERK_SECRET_KEY=...
CLERK_PUBLISHABLE_KEY=...

# Database
DATABASE_URL=postgres://username:password@localhost:5432/db-name

# Gateway
GATEWAY_PORT=5000

# Node env
NODE_ENV=development
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```