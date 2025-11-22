# Database Seed Setup

## Prerequisites

Install required dependencies:

```bash
npm install bcryptjs tsx
npm install -D @types/bcryptjs
```

## Running the Seed

1. Make sure your database is set up and migrations are run:
```bash
npx prisma migrate dev
```

2. Run the seed:
```bash
npm run db:seed
```

Or use Prisma's built-in seed command:
```bash
npx prisma db seed
```

## What Gets Seeded

The seed file creates complete sample data for:

### CMS Content
- ✅ Site Settings (homepage text, titles, taglines)
- ✅ 4 Hero Slides with images
- ✅ Contact Information (reservations & events)
- ✅ 3 Services (Culinary, Events, Service)

### Properties & Rooms
- ✅ 4 Properties (Anchor Hotel, Tropicana Resort, Farm Resort, Lake Resort)
- ✅ Property amenities and image galleries
- ✅ 4 Room types with amenities
- ✅ Room pricing and availability

### Users & Bookings
- ✅ Admin user (admin@doloreshotels.com / password123)
- ✅ Guest user (guest@example.com / password123)
- ✅ Sample booking with payment
- ✅ Sample review

### Marketing
- ✅ 2 Promotional codes
- ✅ Newsletter subscribers

## Default Login Credentials

**Admin Account:**
- Email: admin@doloreshotels.com
- Password: password123

**Guest Account:**
- Email: guest@example.com
- Password: password123

## Reset Database

To clear and reseed:
```bash
npx prisma migrate reset
```

This will drop the database, run migrations, and automatically run the seed.
