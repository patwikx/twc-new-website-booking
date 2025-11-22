import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  console.log('🧹 Cleaning database...');
  await prisma.newsletter.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.roomAvailability.deleteMany();
  await prisma.roomImage.deleteMany();
  await prisma.roomAmenity.deleteMany();
  await prisma.room.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.propertyAmenity.deleteMany();
  await prisma.property.deleteMany();
  await prisma.service.deleteMany();
  await prisma.contactInfo.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.heroSlideImage.deleteMany();
  await prisma.heroSlide.deleteMany();
  await prisma.user.deleteMany();

  // ============================================
  // SITE SETTINGS
  // ============================================
  console.log('⚙️  Creating site settings...');
  await prisma.siteSettings.create({
    data: {
      siteName: 'Dolores',
      siteTagline: 'HOTELS & RESORTS',
      establishedYear: '2025',
      aboutTitle: 'Where Every Stay Tells a Story',
      aboutText1:
        'From the vibrant energy of General Santos to the tranquil shores of Eastern Samar, our collection offers distinct experiences tailored to your journey.',
      aboutText2:
        'Whether you seek urban sophistication, tropical beaches, countryside serenity, or lakeside tranquility, we provide exceptional hospitality at every destination.',
      ctaTitle: 'Your Perfect Escape Awaits',
      ctaSubtitle: 'Book your stay today and discover why guests return to us time and again',
      ctaButtonText: 'Make a Reservation',
      contactTitle: "Let's Start Planning Your Stay",
    },
  });

  // ============================================
  // HERO SLIDES
  // ============================================
  console.log('🎬 Creating hero slides...');
  const heroSlide1 = await prisma.heroSlide.create({
    data: {
      title: 'Unforgettable Escapes',
      subtitle: 'Four distinctive destinations across the Philippines, each offering its own unique story',
      order: 1,
      isActive: true,
    },
  });

  await prisma.heroSlideImage.create({
    data: {
      heroSlideId: heroSlide1.id,
      url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=1080&fit=crop',
      alt: 'Luxury hotel lobby',
      order: 1,
    },
  });

  const heroSlide2 = await prisma.heroSlide.create({
    data: {
      title: 'Tropical Paradise',
      subtitle: 'Pristine beaches and crystal-clear waters await your discovery',
      order: 2,
      isActive: true,
    },
  });

  await prisma.heroSlideImage.create({
    data: {
      heroSlideId: heroSlide2.id,
      url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&h=1080&fit=crop',
      alt: 'Beach resort',
      order: 1,
    },
  });

  const heroSlide3 = await prisma.heroSlide.create({
    data: {
      title: 'Nature & Wellness',
      subtitle: 'Reconnect with nature in our serene countryside retreats',
      order: 3,
      isActive: true,
    },
  });

  await prisma.heroSlideImage.create({
    data: {
      heroSlideId: heroSlide3.id,
      url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop',
      alt: 'Farm resort',
      order: 1,
    },
  });

  const heroSlide4 = await prisma.heroSlide.create({
    data: {
      title: 'Lakeside Tranquility',
      subtitle: 'Find peace by the water surrounded by breathtaking mountain views',
      order: 4,
      isActive: true,
    },
  });

  await prisma.heroSlideImage.create({
    data: {
      heroSlideId: heroSlide4.id,
      url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1920&h=1080&fit=crop',
      alt: 'Lake resort',
      order: 1,
    },
  });

  // ============================================
  // CONTACT INFO
  // ============================================
  console.log('📞 Creating contact info...');
  await prisma.contactInfo.createMany({
    data: [
      {
        type: 'reservations',
        title: 'RESERVATIONS',
        phone: '+63 917 712 9217',
        email: 'reservations@doloreshotels.com',
        order: 1,
        isActive: true,
      },
      {
        type: 'events',
        title: 'EVENTS & OCCASIONS',
        phone: '+63 968 894 6219',
        email: 'events@doloreshotels.com',
        order: 2,
        isActive: true,
      },
    ],
  });

  // ============================================
  // SERVICES
  // ============================================
  console.log('🍽️  Creating services...');
  await prisma.service.createMany({
    data: [
      {
        title: 'Culinary Excellence',
        description:
          'From farm-to-table freshness to international cuisines, experience dining that delights every palate.',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
        linkText: 'Explore Dining',
        linkUrl: '#dining',
        order: 1,
        isActive: true,
      },
      {
        title: 'Events & Celebrations',
        description: 'Create unforgettable memories in our versatile venues designed for every occasion.',
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop',
        linkText: 'Plan Your Event',
        linkUrl: '#events',
        order: 2,
        isActive: true,
      },
      {
        title: 'Dedicated Service',
        description: 'Our 24/7 team ensures every detail of your stay exceeds your expectations.',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&h=400&fit=crop',
        linkText: 'Learn More',
        linkUrl: '#service',
        order: 3,
        isActive: true,
      },
    ],
  });

  // ============================================
  // PROPERTIES
  // ============================================
  console.log('🏨 Creating properties...');

  // 1. ANCHOR HOTEL
  const anchorHotel = await prisma.property.create({
    data: {
      name: 'Anchor Hotel',
      slug: 'anchor-hotel',
      location: 'General Santos City',
      tagline: 'Urban Sophistication Meets Coastal Comfort',
      description:
        'A premier business boutique hotel offering modern elegance in the heart of General Santos. Perfect for both business and leisure travelers seeking refined comfort.',
      mainImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1400&h=900&fit=crop',
      order: 1,
      isActive: true,
      isFeatured: true,
    },
  });

  await prisma.propertyAmenity.createMany({
    data: [
      { propertyId: anchorHotel.id, name: 'Free WiFi', order: 1 },
      { propertyId: anchorHotel.id, name: 'Restaurant', order: 2 },
      { propertyId: anchorHotel.id, name: 'Business Center', order: 3 },
    ],
  });

  await prisma.propertyImage.createMany({
    data: [
      {
        propertyId: anchorHotel.id,
        url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1400&h=900&fit=crop',
        caption: 'Hotel Exterior',
        order: 1,
      },
      {
        propertyId: anchorHotel.id,
        url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1400&h=900&fit=crop',
        caption: 'Lobby',
        order: 2,
      },
      {
        propertyId: anchorHotel.id,
        url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1400&h=900&fit=crop',
        caption: 'Guest Room',
        order: 3,
      },
    ],
  });

  // 2. DOLORES TROPICANA RESORT
  const tropicanaResort = await prisma.property.create({
    data: {
      name: 'Dolores Tropicana Resort',
      slug: 'dolores-tropicana-resort',
      location: 'Dolores, Eastern Samar',
      tagline: 'Your Tropical Paradise Awaits',
      description:
        'Discover pristine white sand beaches and crystal-clear waters. Experience the perfect blend of relaxation and adventure in this beachfront haven.',
      mainImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1400&h=900&fit=crop',
      order: 2,
      isActive: true,
      isFeatured: true,
    },
  });

  await prisma.propertyAmenity.createMany({
    data: [
      { propertyId: tropicanaResort.id, name: 'Beachfront', order: 1 },
      { propertyId: tropicanaResort.id, name: 'Pool', order: 2 },
      { propertyId: tropicanaResort.id, name: 'Water Sports', order: 3 },
    ],
  });

  await prisma.propertyImage.createMany({
    data: [
      {
        propertyId: tropicanaResort.id,
        url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1400&h=900&fit=crop',
        caption: 'Beach View',
        order: 1,
      },
      {
        propertyId: tropicanaResort.id,
        url: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1400&h=900&fit=crop',
        caption: 'Pool Area',
        order: 2,
      },
    ],
  });

  // 3. DOLORES FARM RESORT
  const farmResort = await prisma.property.create({
    data: {
      name: 'Dolores Farm Resort',
      slug: 'dolores-farm-resort',
      location: 'Dolores, Eastern Samar',
      tagline: 'Nature, Wellness & Authentic Farm Experience',
      description:
        'Reconnect with nature in our eco-friendly farm resort. Enjoy farm-to-table dining, organic gardens, and peaceful countryside views.',
      mainImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&h=900&fit=crop',
      order: 3,
      isActive: true,
      isFeatured: true,
    },
  });

  await prisma.propertyAmenity.createMany({
    data: [
      { propertyId: farmResort.id, name: 'Farm Tours', order: 1 },
      { propertyId: farmResort.id, name: 'Organic Dining', order: 2 },
      { propertyId: farmResort.id, name: 'Wellness', order: 3 },
    ],
  });

  await prisma.propertyImage.createMany({
    data: [
      {
        propertyId: farmResort.id,
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&h=900&fit=crop',
        caption: 'Farm View',
        order: 1,
      },
      {
        propertyId: farmResort.id,
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&h=900&fit=crop',
        caption: 'Villa',
        order: 2,
      },
    ],
  });

  // 4. DOLORES LAKE RESORT
  const lakeResort = await prisma.property.create({
    data: {
      name: 'Dolores Lake Resort',
      slug: 'dolores-lake-resort',
      location: 'Dolores, Eastern Samar',
      tagline: 'Tranquil Lakeside Retreat',
      description:
        'Nestled by a serene lake surrounded by mountains. Perfect for those seeking peace, water activities, and breathtaking natural scenery.',
      mainImage: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1400&h=900&fit=crop',
      order: 4,
      isActive: true,
      isFeatured: true,
    },
  });

  await prisma.propertyAmenity.createMany({
    data: [
      { propertyId: lakeResort.id, name: 'Lakefront', order: 1 },
      { propertyId: lakeResort.id, name: 'Kayaking', order: 2 },
      { propertyId: lakeResort.id, name: 'Mountain Views', order: 3 },
    ],
  });

  await prisma.propertyImage.createMany({
    data: [
      {
        propertyId: lakeResort.id,
        url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1400&h=900&fit=crop',
        caption: 'Lake View',
        order: 1,
      },
      {
        propertyId: lakeResort.id,
        url: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=1400&h=900&fit=crop',
        caption: 'Lakeside Cabin',
        order: 2,
      },
    ],
  });

  // ============================================
  // ROOMS
  // ============================================
  console.log('🛏️  Creating rooms...');

  // Anchor Hotel Rooms
  const anchorDeluxe = await prisma.room.create({
    data: {
      propertyId: anchorHotel.id,
      name: 'Deluxe Room',
      slug: 'deluxe-room',
      description: 'Spacious room with modern amenities and city views',
      type: 'Deluxe',
      maxGuests: 2,
      bedConfiguration: '1 King Bed',
      size: 32,
      basePrice: 3500,
      totalRooms: 50,
      isActive: true,
    },
  });

  await prisma.roomAmenity.createMany({
    data: [
      { roomId: anchorDeluxe.id, name: 'Air Conditioning', order: 1 },
      { roomId: anchorDeluxe.id, name: 'Smart TV', order: 2 },
      { roomId: anchorDeluxe.id, name: 'Mini Bar', order: 3 },
      { roomId: anchorDeluxe.id, name: 'Safe', order: 4 },
    ],
  });

  const anchorSuite = await prisma.room.create({
    data: {
      propertyId: anchorHotel.id,
      name: 'Executive Suite',
      slug: 'executive-suite',
      description: 'Luxurious suite with separate living area and premium amenities',
      type: 'Suite',
      maxGuests: 4,
      bedConfiguration: '1 King Bed + Sofa Bed',
      size: 55,
      basePrice: 6500,
      totalRooms: 20,
      isActive: true,
    },
  });

  await prisma.roomAmenity.createMany({
    data: [
      { roomId: anchorSuite.id, name: 'Living Room', order: 1 },
      { roomId: anchorSuite.id, name: 'Kitchenette', order: 2 },
      { roomId: anchorSuite.id, name: 'Jacuzzi', order: 3 },
      { roomId: anchorSuite.id, name: 'Work Desk', order: 4 },
    ],
  });

  // Tropicana Resort Rooms
  const tropicanaBeachfront = await prisma.room.create({
    data: {
      propertyId: tropicanaResort.id,
      name: 'Beachfront Villa',
      slug: 'beachfront-villa',
      description: 'Direct beach access with stunning ocean views',
      type: 'Villa',
      maxGuests: 4,
      bedConfiguration: '2 Queen Beds',
      size: 65,
      basePrice: 4200,
      totalRooms: 25,
      isActive: true,
    },
  });

  await prisma.roomAmenity.createMany({
    data: [
      { roomId: tropicanaBeachfront.id, name: 'Private Balcony', order: 1 },
      { roomId: tropicanaBeachfront.id, name: 'Beach Access', order: 2 },
      { roomId: tropicanaBeachfront.id, name: 'Outdoor Shower', order: 3 },
    ],
  });

  // Farm Resort Rooms
  const farmVilla = await prisma.room.create({
    data: {
      propertyId: farmResort.id,
      name: 'Garden Villa',
      slug: 'garden-villa',
      description: 'Eco-friendly villa surrounded by organic gardens',
      type: 'Villa',
      maxGuests: 3,
      bedConfiguration: '1 King Bed + 1 Single',
      size: 45,
      basePrice: 3800,
      totalRooms: 30,
      isActive: true,
    },
  });

  await prisma.roomAmenity.createMany({
    data: [
      { roomId: farmVilla.id, name: 'Garden View', order: 1 },
      { roomId: farmVilla.id, name: 'Eco-Friendly', order: 2 },
      { roomId: farmVilla.id, name: 'Outdoor Seating', order: 3 },
    ],
  });

  // Lake Resort Rooms
  const lakeRoom = await prisma.room.create({
    data: {
      propertyId: lakeResort.id,
      name: 'Lakeside Room',
      slug: 'lakeside-room',
      description: 'Peaceful room with panoramic lake and mountain views',
      type: 'Deluxe',
      maxGuests: 2,
      bedConfiguration: '1 Queen Bed',
      size: 38,
      basePrice: 4000,
      totalRooms: 40,
      isActive: true,
    },
  });

  await prisma.roomAmenity.createMany({
    data: [
      { roomId: lakeRoom.id, name: 'Lake View', order: 1 },
      { roomId: lakeRoom.id, name: 'Private Deck', order: 2 },
      { roomId: lakeRoom.id, name: 'Fireplace', order: 3 },
    ],
  });

  // ============================================
  // USERS
  // ============================================
  console.log('👤 Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@doloreshotels.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+63 917 712 9217',
      role: 'ADMIN',
      isActive: true,
      emailVerified: new Date(),
    },
  });

  const guestUser = await prisma.user.create({
    data: {
      email: 'guest@example.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+63 912 345 6789',
      role: 'GUEST',
      isActive: true,
      emailVerified: new Date(),
    },
  });

  // ============================================
  // BOOKINGS
  // ============================================
  console.log('📅 Creating sample bookings...');
  const booking1 = await prisma.booking.create({
    data: {
      bookingNumber: 'BK-2025-0001',
      propertyId: anchorHotel.id,
      roomId: anchorDeluxe.id,
      userId: guestUser.id,
      guestFirstName: 'John',
      guestLastName: 'Doe',
      guestEmail: 'guest@example.com',
      guestPhone: '+63 912 345 6789',
      guestAddress: '123 Main Street',
      guestCity: 'Manila',
      guestCountry: 'Philippines',
      checkInDate: new Date('2025-12-01'),
      checkOutDate: new Date('2025-12-05'),
      numberOfGuests: 2,
      numberOfNights: 4,
      numberOfRooms: 1,
      roomRate: 3500,
      subtotal: 14000,
      serviceChargeAmount: 1400, // 10% service charge
      taxAmount: 1848, // 12% VAT on subtotal + service charge
      additionalFeesAmount: 0,
      discountAmount: 0,
      promotionCodes: [],
      totalAmount: 17248,
      amountPaid: 17248,
      amountDue: 0,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      specialRequests: 'Late check-in requested',
    },
  });

  await prisma.payment.create({
    data: {
      bookingId: booking1.id,
      amount: 17248,
      paymentMethod: 'CREDIT_CARD',
      paymentProvider: 'stripe',
      transactionId: 'ch_1234567890',
      status: 'PAID',
      paidAt: new Date(),
    },
  });

  // ============================================
  // REVIEWS
  // ============================================
  console.log('⭐ Creating reviews...');
  await prisma.review.create({
    data: {
      propertyId: anchorHotel.id,
      userId: guestUser.id,
      bookingId: booking1.id,
      rating: 5,
      title: 'Excellent Stay!',
      comment: 'The hotel exceeded our expectations. Staff was friendly and the room was spotless.',
      isApproved: true,
      isPublished: true,
    },
  });

  // ============================================
  // BOOKING SETTINGS
  // ============================================
  console.log('⚙️  Creating booking settings...');
  await prisma.bookingSettings.create({
    data: {
      taxName: 'VAT',
      taxRate: 12.0,
      taxAppliesTo: 'SUBTOTAL',
      serviceChargeName: 'Service Charge',
      serviceChargeRate: 10.0,
      serviceChargeEnabled: true,
      cleaningFeeName: 'Cleaning Fee',
      cleaningFeeAmount: 500,
      cleaningFeeEnabled: false,
      resortFeeName: 'Resort Fee',
      resortFeeAmount: 300,
      resortFeePerNight: true,
      resortFeeEnabled: false,
      cancellationPolicy: 'Free cancellation up to 48 hours before check-in. Cancellations within 48 hours will incur a 50% charge.',
      depositRequired: true,
      depositPercentage: 30.0,
      allowPartialPayment: true,
      minPartialPayment: 50.0,
      currency: 'PHP',
      currencySymbol: '₱',
    },
  });

  // ============================================
  // ADDITIONAL FEES
  // ============================================
  console.log('💰 Creating additional fees...');
  await prisma.additionalFee.createMany({
    data: [
      {
        name: 'Airport Transfer',
        description: 'One-way airport pickup or drop-off',
        feeType: 'AIRPORT_TRANSFER',
        amount: 1500,
        isPercentage: false,
        isPerNight: false,
        isPerGuest: false,
        isOptional: true,
        isActive: true,
        order: 1,
        applyToAllProperties: true,
      },
      {
        name: 'Extra Bed',
        description: 'Additional bed in room',
        feeType: 'EXTRA_BED',
        amount: 800,
        isPercentage: false,
        isPerNight: true,
        isPerGuest: false,
        isOptional: true,
        isActive: true,
        order: 2,
        applyToAllProperties: true,
      },
      {
        name: 'Pet Fee',
        description: 'Fee for bringing pets',
        feeType: 'PET',
        amount: 500,
        isPercentage: false,
        isPerNight: true,
        isPerGuest: false,
        isOptional: true,
        isActive: true,
        order: 3,
        applyToAllProperties: false,
        propertyIds: [farmResort.id, lakeResort.id],
      },
      {
        name: 'Early Check-in',
        description: 'Check-in before 2:00 PM',
        feeType: 'EARLY_CHECKIN',
        amount: 1000,
        isPercentage: false,
        isPerNight: false,
        isPerGuest: false,
        isOptional: true,
        isActive: true,
        order: 4,
        applyToAllProperties: true,
      },
      {
        name: 'Late Check-out',
        description: 'Check-out after 12:00 PM',
        feeType: 'LATE_CHECKOUT',
        amount: 1000,
        isPercentage: false,
        isPerNight: false,
        isPerGuest: false,
        isOptional: true,
        isActive: true,
        order: 5,
        applyToAllProperties: true,
      },
      {
        name: 'Parking Fee',
        description: 'Daily parking fee',
        feeType: 'PARKING',
        amount: 200,
        isPercentage: false,
        isPerNight: true,
        isPerGuest: false,
        isOptional: true,
        isActive: true,
        order: 6,
        applyToAllProperties: false,
        propertyIds: [anchorHotel.id],
      },
    ],
  });

  // ============================================
  // PROMOTIONS
  // ============================================
  console.log('🎁 Creating promotions...');
  await prisma.promotion.createMany({
    data: [
      {
        code: 'WELCOME2025',
        name: 'Welcome Discount',
        description: '15% off your first booking',
        discountType: 'PERCENTAGE',
        discountValue: 15,
        maxDiscountAmount: 3000,
        applyToAllProperties: true,
        applyToAllRoomTypes: true,
        minStay: 2,
        validFrom: new Date('2025-01-01'),
        validTo: new Date('2025-12-31'),
        maxUses: 1000,
        maxUsesPerUser: 1,
        usedCount: 0,
        newUsersOnly: true,
        requiresLogin: false,
        canCombineWithOthers: false,
        priority: 1,
        isActive: true,
      },
      {
        code: 'SUMMER2025',
        name: 'Summer Special',
        description: '₱1000 off on stays of 5 nights or more',
        discountType: 'FIXED_AMOUNT',
        discountValue: 1000,
        applyToAllProperties: true,
        applyToAllRoomTypes: true,
        minStay: 5,
        validFrom: new Date('2025-03-01'),
        validTo: new Date('2025-05-31'),
        maxUses: 500,
        maxUsesPerUser: 2,
        usedCount: 0,
        newUsersOnly: false,
        requiresLogin: false,
        canCombineWithOthers: true,
        priority: 2,
        isActive: true,
      },
      {
        code: 'EARLYBIRD',
        name: 'Early Bird Special',
        description: '20% off for bookings made 30 days in advance',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        maxDiscountAmount: 5000,
        applyToAllProperties: true,
        applyToAllRoomTypes: true,
        minStay: 3,
        validFrom: new Date('2025-01-01'),
        validTo: new Date('2025-12-31'),
        maxUses: null,
        maxUsesPerUser: null,
        usedCount: 0,
        newUsersOnly: false,
        requiresLogin: false,
        canCombineWithOthers: false,
        priority: 3,
        isActive: true,
      },
      {
        code: 'WEEKEND50',
        name: 'Weekend Getaway',
        description: '₱500 off weekend stays',
        discountType: 'FIXED_AMOUNT',
        discountValue: 500,
        applyToAllProperties: false,
        propertyIds: [tropicanaResort.id, lakeResort.id],
        applyToAllRoomTypes: true,
        minStay: 2,
        validFrom: new Date('2025-01-01'),
        validTo: new Date('2025-12-31'),
        maxUses: null,
        maxUsesPerUser: 5,
        usedCount: 0,
        newUsersOnly: false,
        requiresLogin: true,
        canCombineWithOthers: true,
        priority: 4,
        isActive: true,
      },
    ],
  });

  // ============================================
  // SEASONAL PRICING
  // ============================================
  console.log('📅 Creating seasonal pricing...');
  await prisma.seasonalPricing.createMany({
    data: [
      {
        name: 'Peak Season',
        description: 'Christmas and New Year period',
        propertyId: null, // Applies to all
        roomId: null,
        startDate: new Date('2025-12-20'),
        endDate: new Date('2026-01-05'),
        adjustmentType: 'PERCENTAGE',
        adjustmentValue: 30,
        priority: 1,
        isActive: true,
      },
      {
        name: 'Summer Peak',
        description: 'Summer vacation period',
        propertyId: tropicanaResort.id,
        roomId: null,
        startDate: new Date('2025-04-01'),
        endDate: new Date('2025-05-31'),
        adjustmentType: 'PERCENTAGE',
        adjustmentValue: 25,
        priority: 2,
        isActive: true,
      },
      {
        name: 'Weekend Premium',
        description: 'Weekend rate increase',
        propertyId: null,
        roomId: null,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        adjustmentType: 'PERCENTAGE',
        adjustmentValue: 15,
        daysOfWeek: [5, 6], // Friday, Saturday
        priority: 3,
        isActive: true,
      },
      {
        name: 'Off-Season Discount',
        description: 'Rainy season discount',
        propertyId: null,
        roomId: null,
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-09-30'),
        adjustmentType: 'PERCENTAGE',
        adjustmentValue: -20, // Negative for discount
        priority: 4,
        isActive: true,
      },
    ],
  });

  // ============================================
  // LOYALTY PROGRAM
  // ============================================
  console.log('🏆 Creating loyalty program...');
  await prisma.loyaltyProgram.create({
    data: {
      name: 'Dolores Rewards',
      description: 'Earn points on every stay and redeem for discounts',
      pointsPerAmount: 1, // 1 point per ₱1 spent
      pointsValue: 0.5, // Each point worth ₱0.50
      minPointsToRedeem: 100,
      pointsExpiryDays: 365,
      isActive: true,
    },
  });

  // ============================================
  // NEWSLETTER
  // ============================================
  console.log('📧 Creating newsletter subscribers...');
  await prisma.newsletter.createMany({
    data: [
      {
        email: 'subscriber1@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        isActive: true,
      },
      {
        email: 'subscriber2@example.com',
        firstName: 'Mike',
        lastName: 'Johnson',
        isActive: true,
      },
    ],
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
