# Khau Galli Catering


The public Khau Galli catering menu and enquiry builder for `catering.thekhaugalli.com`.

## What customers can do

- Compare all nine standard catering packages and their per-person rates.
- Configure every included menu choice, including the Street Food Delights 3/2/1 selection rule.
- Add live counters, service extras and premium shisha.
- Enter event details, review an indicative total and open a structured WhatsApp enquiry to `+971 52 559 6653`.
- Browse the full catering menu from the supplied eight-page PDF.

## Local development

Requires Node.js 22.13 or newer.

```sh
npm run install:ci
npm run dev
```

Production validation:

```sh
npx tsc --noEmit
npm run build
```

The Site registration is stored in `.openai/hosting.json`. There is no customer database and the site does not submit or store enquiries itself; the final hand-off opens WhatsApp with a prefilled message for the customer to send.
