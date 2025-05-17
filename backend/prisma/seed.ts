import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const organizerId = 'org-1';

  //  Buat organizer karena belum ada
  const existing = await prisma.user.findUnique({ where: { id: organizerId } });

  if (!existing) {
    await prisma.user.create({
      data: {
        id: organizerId,
        full_name: 'Ghulam Organizer',
        email: 'Ghulam_organizer@example.com',
        password: 'dummy_password_hash',
        role: 'ORGANIZER',
        referral_code: 'REFORG1',
        created_at: new Date(),
      },
    });
    console.log('Organizer created');
  } else {
    console.log('Organizer already exists');
  }

  //  Event 1–15 
  const events = [
    {
      id: 'event-1',
      name: 'Jakarta Jazz Festival',
      description: 'Enjoy an evening of smooth jazz and soulful vibes.',
      category: 'Jazz',
      location: 'Jakarta',
      price: 250000,
      start_date: new Date('2025-06-10'),
      end_date: new Date('2025-06-12'),
      total_seats: 200,
      remaining_seats: 200,
      image_url: 'https://source.unsplash.com/800x600/?jazz,concert',
    },
    {
      id: 'event-2',
      name: 'K-Pop Stars Live in Seoul',
      description: 'The hottest K-Pop performances in one place.',
      category: 'K-Pop',
      location: 'Seoul',
      price: 350000,
      start_date: new Date('2025-07-01'),
      end_date: new Date('2025-07-01'),
      total_seats: 150,
      remaining_seats: 150,
      image_url: 'https://source.unsplash.com/800x600/?kpop,stage',
    },
    {
      id: 'event-3',
      name: 'Indie Vibes',
      description: 'A night full of indie music and arts.',
      category: 'Indie',
      location: 'Bandung',
      price: 150000,
      start_date: new Date('2025-06-15'),
      end_date: new Date('2025-06-15'),
      total_seats: 100,
      remaining_seats: 100,
      image_url: 'https://source.unsplash.com/800x600/?indie,concert',
    },
    {
      id: 'event-4',
      name: 'Rock Legends Live',
      description: 'The biggest rock bands of the decade!',
      category: 'Rock',
      location: 'Surabaya',
      price: 300000,
      start_date: new Date('2025-06-20'),
      end_date: new Date('2025-06-20'),
      total_seats: 150,
      remaining_seats: 150,
      image_url: 'https://source.unsplash.com/800x600/?rock,concert',
    },
    {
      id: 'event-5',
      name: 'EDM Rave Party',
      description: 'Let the beats drop with the best DJs.',
      category: 'EDM',
      location: 'Jakarta',
      price: 400000,
      start_date: new Date('2025-07-05'),
      end_date: new Date('2025-07-06'),
      total_seats: 300,
      remaining_seats: 300,
      image_url: 'https://source.unsplash.com/800x600/?edm,party',
    },
    {
      id: 'event-6',
      name: 'K-Pop Wonderland',
      description: 'A colorful experience with your fav idols.',
      category: 'K-Pop',
      location: 'Yogyakarta',
      price: 350000,
      start_date: new Date('2025-08-01'),
      end_date: new Date('2025-08-01'),
      total_seats: 180,
      remaining_seats: 180,
      image_url: 'https://source.unsplash.com/800x600/?kpop,concert',
    },
    {
      id: 'event-7',
      name: 'Jazz in The Park',
      description: 'Relax with smooth jazz under the stars.',
      category: 'Jazz',
      location: 'Bandung',
      price: 200000,
      start_date: new Date('2025-08-15'),
      end_date: new Date('2025-08-15'),
      total_seats: 120,
      remaining_seats: 120,
      image_url: 'https://source.unsplash.com/800x600/?jazz,music',
    },
    {
      id: 'event-8',
      name: 'Indie Sunset Fest',
      description: 'Catch the indie scene’s rising stars!',
      category: 'Indie',
      location: 'Surabaya',
      price: 180000,
      start_date: new Date('2025-09-01'),
      end_date: new Date('2025-09-01'),
      total_seats: 100,
      remaining_seats: 100,
      image_url: 'https://source.unsplash.com/800x600/?sunset,indie',
    },
    {
      id: 'event-9',
      name: 'Electronic Nation',
      description: 'Feel the pulse of electronic beats.',
      category: 'EDM',
      location: 'Jakarta',
      price: 420000,
      start_date: new Date('2025-09-10'),
      end_date: new Date('2025-09-10'),
      total_seats: 250,
      remaining_seats: 250,
      image_url: 'https://source.unsplash.com/800x600/?electronic,music',
    },
    {
      id: 'event-10',
      name: 'Pop Culture Night',
      description: 'Celebrate pop music and fandoms.',
      category: 'J-Pop',
      location: 'Jakarta',
      price: 300000,
      start_date: new Date('2025-09-15'),
      end_date: new Date('2025-09-15'),
      total_seats: 150,
      remaining_seats: 150,
      image_url: 'https://source.unsplash.com/800x600/?jpop,concert',
    },
    {
      id: 'event-11',
      name: 'Urban Sound Festival',
      description: 'Explore a mix of urban music genres.',
      category: 'Rock',
      location: 'Yogyakarta',
      price: 270000,
      start_date: new Date('2025-09-25'),
      end_date: new Date('2025-09-25'),
      total_seats: 150,
      remaining_seats: 150,
      image_url: 'https://source.unsplash.com/800x600/?urban,concert',
    },
    {
      id: 'event-12',
      name: 'Tokyo K-Pop Day',
      description: 'Meet your favorite idols in Tokyo!',
      category: 'K-Pop',
      location: 'Tokyo',
      price: 500000,
      start_date: new Date('2025-10-01'),
      end_date: new Date('2025-10-01'),
      total_seats: 200,
      remaining_seats: 200,
      image_url: 'https://source.unsplash.com/800x600/?kpop,japan',
    },
    {
      id: 'event-14',
      name: 'J-Pop Dream Night Jakarta',
      description: 'Magical J-Pop vibes under city lights. Idol units, anime themes, and fan chants!',
      category: 'J-Pop',
      location: 'Jakarta',
      price: 280000,
      start_date: new Date('2025-10-10'),
      end_date: new Date('2025-10-10'),
      total_seats: 180,
      remaining_seats: 180,
      image_url: 'https://source.unsplash.com/800x600/?jpop,idol',
    },
    {
      id: 'event-15',
      name: 'J-Pop Matsuri Surabaya',
      description: 'A cultural and musical explosion of J-Pop, cosplay, and summer festival games.',
      category: 'J-Pop',
      location: 'Surabaya',
      price: 260000,
      start_date: new Date('2025-10-20'),
      end_date: new Date('2025-10-20'),
      total_seats: 160,
      remaining_seats: 160,
      image_url: 'https://source.unsplash.com/800x600/?japan,pop',
    },
  ];

  for (const e of events) {
    await prisma.event.upsert({
      where: { id: e.id },
      update: {},
      create: {
        ...e,
        organizer_id: organizerId,
        created_at: new Date(),
      },
    });
  }

  // Charity event (event-13)
  await prisma.event.upsert({
    where: { id: 'event-13' },
    update: {},
    create: {
      id: 'event-13',
      name: 'Charity Concert for Orphanage',
      description:
        'A special charity concert. All proceeds go to support orphaned children. You can donate during the event or via bank transfer.',
      category: 'Indie',
      location: 'Bandung',
      price: 0,
      start_date: new Date('2025-08-15'),
      end_date: new Date('2025-08-15'),
      total_seats: 300,
      remaining_seats: 300,
      organizer_id: organizerId,
      created_at: new Date(),
    },
  });

  console.log(' All dummy events inserted successfully');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
