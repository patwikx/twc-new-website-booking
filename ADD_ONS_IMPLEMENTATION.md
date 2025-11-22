# Add-ons/Extras Feature Implementation

## Overview
Fully functional add-ons system integrated into the booking flow with consistent UI/UX matching the existing design.

## Features Implemented

### 1. Server Actions
- **`actions/fees/get-available-fees.ts`**
  - Fetches available fees for a specific property
  - Filters by active status and property applicability
  - Returns properly typed fee data

### 2. Components
- **`components/add-ons-selector.tsx`**
  - Clean, consistent UI matching booking flow design
  - Displays mandatory fees (included, non-removable)
  - Displays optional add-ons (selectable with checkboxes)
  - Real-time price calculation based on:
    - Per night multiplier
    - Per guest multiplier
    - Percentage-based fees
  - Proper decimal formatting
  - Dark theme consistent with booking summary

### 3. Integration
- **Updated `app/booking/guest-details/page.tsx`**
  - Fetches available fees for the property
  - Passes fees to guest details form

- **Updated `components/guest-details-form.tsx`**
  - Integrated AddOnsSelector component
  - Tracks selected fees state
  - Calculates total with add-ons
  - Displays selected fees in booking summary
  - Passes fees to booking creation

- **Updated `actions/booking/create-booking.ts`**
  - Accepts selectedFees parameter
  - Creates BookingFee records for each selected fee
  - Updates additionalFeesAmount in booking
  - Properly typed, no `any` usage

### 4. Seed Data
- **`prisma/seed-fees.ts`**
  - Sample optional add-ons:
    - Parking (₱200/night)
    - Airport Transfer (₱1,500 one-time)
    - Extra Bed (₱500/night)
    - Early Check-in (₱800 one-time)
    - Late Check-out (₱800 one-time)
    - Pet Fee (₱300/night)
  - Sample mandatory fee (disabled by default):
    - Cleaning Fee (₱500 one-time)

## Usage

### Run Seed Script
```bash
npx tsx prisma/seed-fees.ts
```

### How It Works

1. **Guest Details Page**: Fetches available fees for the property
2. **Add-ons Selector**: Displays fees with proper categorization
   - Mandatory fees shown as "Required" (non-interactive)
   - Optional fees shown with checkboxes
3. **Price Calculation**: Automatically calculates based on:
   - Base amount
   - Nights (if isPerNight = true)
   - Guests (if isPerGuest = true)
   - Percentage (if isPercentage = true)
4. **Booking Summary**: Shows selected fees with individual amounts
5. **Booking Creation**: Saves fees to BookingFee table

## UI/UX Features

- Consistent dark theme matching booking summary
- Compact spacing
- Clear visual hierarchy
- Checkbox selection for optional items
- "Required" badge for mandatory fees
- Proper decimal formatting (2 decimal places)
- Responsive design
- Smooth transitions

## Database Schema

Uses existing Prisma models:
- `AdditionalFee` - Defines available fees
- `BookingFee` - Tracks fees applied to bookings
- `FeeType` enum - Categorizes fee types

## Type Safety

- No `any` types used
- Strict TypeScript interfaces
- Proper type inference
- Server action return types defined

## Next Steps

To add more fees:
1. Use the admin dashboard (when built) OR
2. Add directly to database OR
3. Update `prisma/seed-fees.ts` and re-run

To customize fee behavior:
- `isOptional`: true = user can select, false = always included
- `isPerNight`: true = multiply by number of nights
- `isPerGuest`: true = multiply by number of guests
- `isPercentage`: true = calculate as percentage of subtotal
- `applyToAllProperties`: false = specify propertyIds array
