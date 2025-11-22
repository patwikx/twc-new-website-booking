# Pricing & Promotion System

## Overview
Complete enterprise-grade pricing, fees, taxes, and promotion management system for hotel bookings.

## 1. Booking Settings (`BookingSettings`)

Global settings that apply to all bookings:

### Tax Configuration
- **Tax Name**: Customizable (e.g., "VAT", "Sales Tax")
- **Tax Rate**: Percentage (e.g., 12%)
- **Tax Applies To**: SUBTOTAL or TOTAL

### Service Charge
- **Service Charge Name**: Customizable
- **Service Charge Rate**: Percentage (e.g., 10%)
- **Enabled/Disabled**: Toggle on/off

### Additional Fees
- **Cleaning Fee**: Fixed amount, optional
- **Resort Fee**: Fixed amount per night or one-time
- **Enabled/Disabled**: Individual toggles

### Booking Policies
- **Cancellation Policy**: Text description
- **Deposit Required**: Yes/No
- **Deposit Percentage**: % of total required upfront
- **Allow Partial Payment**: Yes/No
- **Min Partial Payment**: Minimum % required

### Currency
- **Currency Code**: PHP, USD, etc.
- **Currency Symbol**: ₱, $, etc.

## 2. Additional Fees (`AdditionalFee`)

Flexible fee system with multiple options:

### Fee Types
- CLEANING
- RESORT
- PARKING
- PET
- EXTRA_BED
- EARLY_CHECKIN
- LATE_CHECKOUT
- AIRPORT_TRANSFER
- OTHER

### Fee Configuration
- **Amount**: Fixed amount or percentage
- **Is Percentage**: True/False
- **Is Per Night**: Multiply by number of nights
- **Is Per Guest**: Multiply by number of guests
- **Is Optional**: Guest can choose to add or not
- **Apply To All Properties**: Or select specific properties

### Example Fees in Seed
- Airport Transfer: ₱1,500 (optional, one-time)
- Extra Bed: ₱800/night (optional)
- Pet Fee: ₱500/night (optional, specific properties)
- Early Check-in: ₱1,000 (optional, one-time)
- Late Check-out: ₱1,000 (optional, one-time)
- Parking: ₱200/night (optional, Anchor Hotel only)

## 3. Promotions (`Promotion`)

Advanced promotion/coupon system:

### Discount Types
- **PERCENTAGE**: % off (with optional max cap)
- **FIXED_AMOUNT**: Fixed ₱ off
- **FREE_NIGHT**: Get X nights free
- **UPGRADE**: Free room upgrade

### Applicability
- **Properties**: All or specific properties
- **Room Types**: All or specific room types
- **Min Stay**: Minimum nights required
- **Min/Max Booking Amount**: Amount restrictions

### Date Restrictions
- **Valid From/To**: Date range
- **Blackout Dates**: Specific dates excluded

### Usage Limits
- **Max Uses**: Total times code can be used
- **Max Uses Per User**: Per-user limit
- **Used Count**: Track usage

### User Restrictions
- **New Users Only**: First-time bookers
- **Requires Login**: Must be logged in

### Combination Rules
- **Can Combine With Others**: Stack with other promos
- **Priority**: Order of application (higher first)

### Example Promotions in Seed
1. **WELCOME2025**: 15% off (max ₱3,000), new users only
2. **SUMMER2025**: ₱1,000 off, 5+ nights
3. **EARLYBIRD**: 20% off (max ₱5,000), book 30 days ahead
4. **WEEKEND50**: ₱500 off weekends, specific properties

## 4. Seasonal Pricing (`SeasonalPricing`)

Dynamic pricing based on dates and demand:

### Configuration
- **Property/Room Specific**: Or apply to all
- **Date Range**: Start and end dates
- **Adjustment Type**: PERCENTAGE or FIXED
- **Adjustment Value**: Positive (increase) or negative (decrease)
- **Days of Week**: Specific days (e.g., weekends only)
- **Priority**: Order of application

### Example Seasonal Pricing in Seed
1. **Peak Season** (Dec 20 - Jan 5): +30% all properties
2. **Summer Peak** (Apr-May): +25% Tropicana Resort
3. **Weekend Premium** (Fri-Sat): +15% all properties
4. **Off-Season** (Jun-Sep): -20% all properties

## 5. Loyalty Program (`LoyaltyProgram`)

Rewards system for repeat guests:

### Configuration
- **Points Per Amount**: Points earned per ₱ spent
- **Points Value**: ₱ value per point when redeeming
- **Min Points To Redeem**: Minimum threshold
- **Points Expiry**: Days until expiration

### Example in Seed
- Earn 1 point per ₱1 spent
- Each point worth ₱0.50
- Min 100 points to redeem
- Points expire after 365 days

## 6. Booking Price Calculation

The `Booking` model tracks complete price breakdown:

```
Room Rate × Nights × Rooms = Subtotal
+ Service Charge (% of subtotal)
+ Additional Fees
= Subtotal with Fees
+ Tax (% of subtotal or total)
- Discounts (promotions)
= Total Amount
```

### Tracked Fields
- `roomRate`: Base rate per night
- `subtotal`: Room rate × nights × rooms
- `serviceChargeAmount`: Calculated service charge
- `taxAmount`: Calculated tax
- `additionalFeesAmount`: Sum of all fees
- `discountAmount`: Total discounts applied
- `totalAmount`: Final amount
- `amountPaid`: Amount already paid
- `amountDue`: Remaining balance

### Applied Promotions
- `promotionCodes`: Array of promo codes used
- `BookingPromotion`: Junction table tracking each promo

### Applied Fees
- `BookingFee`: Individual fees applied to booking

## Usage Examples

### Setting Tax Rate
```typescript
await prisma.bookingSettings.update({
  where: { id: settingsId },
  data: { taxRate: 12.0 } // 12% VAT
});
```

### Creating a Promotion
```typescript
await prisma.promotion.create({
  data: {
    code: 'FLASH50',
    name: 'Flash Sale',
    discountType: 'PERCENTAGE',
    discountValue: 50,
    maxDiscountAmount: 5000,
    validFrom: new Date('2025-01-01'),
    validTo: new Date('2025-01-31'),
    maxUses: 100,
    isActive: true
  }
});
```

### Adding Seasonal Pricing
```typescript
await prisma.seasonalPricing.create({
  data: {
    name: 'Holiday Premium',
    startDate: new Date('2025-12-24'),
    endDate: new Date('2025-12-26'),
    adjustmentType: 'PERCENTAGE',
    adjustmentValue: 50, // 50% increase
    isActive: true
  }
});
```

## Admin Dashboard Features

With this system, you can build:

1. **Settings Page**: Manage tax rates, service charges, policies
2. **Fees Manager**: Add/edit/disable additional fees
3. **Promotions Manager**: Create and track promo codes
4. **Seasonal Pricing**: Set up dynamic pricing rules
5. **Loyalty Dashboard**: Monitor rewards program
6. **Booking Calculator**: Preview pricing with all rules applied

## Benefits

✅ **Flexible**: Supports any pricing model
✅ **Scalable**: Handle complex pricing scenarios
✅ **Transparent**: Complete price breakdown
✅ **Automated**: Rules apply automatically
✅ **Trackable**: Full audit trail of pricing
✅ **User-Friendly**: Easy to manage via admin panel
