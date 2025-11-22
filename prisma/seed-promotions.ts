import { PrismaClient, DiscountType } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPromotions() {
  console.log('🎫 Seeding promotions...');

  // Global promotions
  await prisma.promotion.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      name: 'Welcome Discount - 10% Off',
      description: 'Get 10% off your first booking',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10,
      maxDiscountAmount: 5000,
      applyToAllProperties: true,
      applyToAllRoomTypes: true,
      validFrom: new Date('2024-01-01'),
      validTo: new Date('2026-12-31'),
      maxUses: 1000,
      maxUsesPerUser: 1,
      usedCount: 0,
      newUsersOnly: false,
      requiresLogin: false,
      canCombineWithOthers: false,
      priority: 1,
      isActive: true,
    },
  });

  await prisma.promotion.upsert({
    where: { code: 'SUMMER2025' },
    update: {},
    create: {
      code: 'SUMMER2025',
      name: 'Summer Special - 20% Off',
      description: 'Enjoy 20% off all bookings this summer',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 20,
      maxDiscountAmount: 10000,
      applyToAllProperties: true,
      applyToAllRoomTypes: true,
      minStay: 3,
      validFrom: new Date('2025-03-01'),
      validTo: new Date('2025-08-31'),
      maxUses: 500,
      maxUsesPerUser: 2,
      usedCount: 0,
      newUsersOnly: false,
      requiresLogin: false,
      canCombineWithOthers: false,
      priority: 2,
      isActive: true,
    },
  });

  await prisma.promotion.upsert({
    where: { code: 'FLASH500' },
    update: {},
    create: {
      code: 'FLASH500',
      name: 'Flash Sale - ₱500 Off',
      description: 'Limited time: Get ₱500 off your booking',
      discountType: DiscountType.FIXED_AMOUNT,
      discountValue: 500,
      applyToAllProperties: true,
      applyToAllRoomTypes: true,
      minBookingAmount: 5000,
      validFrom: new Date('2025-01-01'),
      validTo: new Date('2025-12-31'),
      maxUses: 200,
      maxUsesPerUser: 1,
      usedCount: 0,
      newUsersOnly: false,
      requiresLogin: false,
      canCombineWithOthers: false,
      priority: 3,
      isActive: true,
    },
  });

  await prisma.promotion.upsert({
    where: { code: 'LONGSTAY' },
    update: {},
    create: {
      code: 'LONGSTAY',
      name: 'Extended Stay - 25% Off',
      description: 'Book 7+ nights and save 25%',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 25,
      maxDiscountAmount: 15000,
      applyToAllProperties: true,
      applyToAllRoomTypes: true,
      minStay: 7,
      validFrom: new Date('2025-01-01'),
      validTo: new Date('2025-12-31'),
      maxUsesPerUser: 3,
      usedCount: 0,
      newUsersOnly: false,
      requiresLogin: false,
      canCombineWithOthers: false,
      priority: 4,
      isActive: true,
    },
  });

  console.log('✅ Promotions seeded successfully!');
}

seedPromotions()
  .catch((e) => {
    console.error('Error seeding promotions:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
