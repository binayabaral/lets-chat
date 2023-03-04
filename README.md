# Let's Chat

Chat application developed using `Next js`, `Chakra UI`, `Prisma`, `Mongo DB`, `Next Auth`, `web sockets`, `Apollo Graphql` and `Typescript`.

## Start Development

### Install dependencies

```
yarn
```

### Set environment variables for both frontend and backend separately.

Create an `.env` file using the example template

```
cp .env.example
```

Then edit environment variables

### Generate Prisma Client

```
npx prisma generate --schema=./src/prisma/schema.prisma
```

### Start development server

```
yarn dev
```
