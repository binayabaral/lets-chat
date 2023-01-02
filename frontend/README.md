# Let's Chat

Chat application developed using `Next js`, `Chakra UI`, `Prisma` and `Mongo DB`

## Start Development

### Install dependencies

```
yarn
```

### Set environment variables

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
