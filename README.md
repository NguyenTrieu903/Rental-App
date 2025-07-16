# Rental-App

# How to run prisma

1. `npm run prisma:generate`
2. `npx prisma migrate dev --name init`
3. `npm run seed`

## Issues:

- if you have any database issues, or you change model you have to reset everything: `npx prisma migrate reset`
- After reset, you should run `npm run seed` to load data from json to db
