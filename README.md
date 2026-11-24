# Khau Galli Catering

A catering package and enquiry builder for Khau Galli, an Indian street food business in the UAE.

Live: https://catering.thekhaugalli.com

## How it works

A visitor works through a step-by-step builder. They pick a standard catering package or a quote-only custom menu, configure the dishes the package includes, and add live counters, service extras and event options. They enter event details and see an indicative estimate, including a delivery-area charge. The final step opens WhatsApp with a pre-filled, structured enquiry for the customer to send. The site does not collect or store enquiries itself and has no customer database; packages, menu sections, extras and area charges live in a typed data file (`data/catering.ts`). There is also a browsable full menu.

## Stack

- Next.js 16 on the vinext runtime, deployed to Cloudflare Workers
- React 19 and TypeScript
- Tailwind CSS 4 with shadcn-style components built on Base UI
- Drizzle ORM scaffolding (present in the starter, no database is used)

## Run it

Requires Node.js 22.13 or newer.

```sh
npm run install:ci
npm run dev
npx tsc --noEmit
npm run build
```

## Authorship

I set the requirements and check the results. AI tools write most of the code.

## Status

Live.
