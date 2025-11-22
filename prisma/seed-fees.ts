import { PrismaClient, FeeType } from '@prisma/client';

const prisma = new PrismaClient();

async function seedFees() {
  console.log('🎫 Seeding additional fees...');

  // Optional add-ons
  await prisma.additionalFee.upsert({
    where: { id: 'parking-fee' },
    update: {},
    create: {
      id: 'parking-fee',
      name: 'Parking',
      description: 'Secure parking space for your vehicle',
      feeType: FeeType.PARKING,
      amount: 200,
      isPercentage: false,
      isPerNight: true,
      isPerGuest: false,
      isOptional: true,
      isActive: true,
      applyToAllProperties: true,
      propertyIds: [],
      order: 1,
    },
  });

  await prisma.additionalFee.upsert({
    where: { id: 'airport-transfer' },
    update: {},
    create: {
      id: 'airport-transfer',
      name: 'Airport Transfer',
      description: 'Round-trip airport shuttle service',
      feeType: FeeType.AIRPORT_TRANSFER,
      amount: 1500,
      isPercentage: false,
      isPerNight: false,
      isPerGuest: false,
      isOptional: true,
      isActive: true,
      applyToAllProperties: true,
      propertyIds: [],
      order: 2,
    },
  });

  await prisma.additionalFee.upsert({
    where: { id: 'extra-bed' },
    update: {},
    create: {
      id: 'extra-bed',
      name: 'Extra Bed',
      description: 'Additional bed for extra guest',
      feeType: FeeType.EXTRA_BED,
      amount: 500,
      isPercentage: false,
      isPerNight: true,
      isPerGuest: false,
      isOptional: true,
      isActive: true,
      applyToAllProperties: true,
      propertyIds: [],
      order: 3,
    },
  });

  await prisma.additionalFee.upsert({
    where: { id: 'early-checkin' },
    update: {},
    create: {
      id: 'early-checkin',
      name: 'Early Check-in',
      description: 'Check in before 2:00 PM',
      feeType: FeeType.EARLY_CHECKIN,
      amount: 800,
      isPercentage: false,
      isPerNight: false,
      isPerGuest: false,
      isOptional: true,
      isActive: true,
      applyToAllProperties: true,
      propertyIds: [],
      order: 4,
    },
  });

  await prisma.additionalFee.upsert({
    where: { id: 'late-checkout' },
    update: {},
    create: {
      id: 'late-checkout',
      name: 'Late Check-out',
      description: 'Check out after 12:00 PM',
      feeType: FeeType.LATE_CHECKOUT,
      amount: 800,
      isPercentage: false,
      isPerNight: false,
      isPerGuest: false,
      isOptional: true,
      isActive: true,
      applyToAllProperties: true,
      propertyIds: [],
      order: 5,
    },
  });

  await prisma.additionalFee.upsert({
    where: { id: 'pet-fee' },
    update: {},
    create: {
      id: 'pet-fee',
      name: 'Pet Fee',
      description: 'Bring your furry friend along',
      feeType: FeeType.PET,
      amount: 300,
      isPercentage: false,
      isPerNight: true,
      isPerGuest: false,
      isOptional: true,
      isActive: true,
      applyToAllProperties: true,
      propertyIds: [],
      order: 6,
    },
  });

  // Mandatory fees (examples)
  await prisma.additionalFee.upsert({
    where: { id: 'cleaning-fee' },
    update: {},
    create: {
      id: 'cleaning-fee',
      name: 'Cleaning Fee',
      description: 'One-time cleaning fee',
      feeType: FeeType.CLEANING,
      amount: 500,
      isPercentage: false,
      isPerNight: false,
      isPerGuest: false,
      isOptional: false,
      isActive: false, // Disabled by default, enable if needed
      applyToAllProperties: true,
      propertyIds: [],
      order: 10,
    },
  });

  console.log('✅ Additional fees seeded successfully!');
}

seedFees()
  .catch((e) => {
    console.error('Error seeding fees:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
