import { Prisma, Event as PrismaEvent } from '@prisma/client';
import prisma from '../../prisma/client';

//  Ambil semua event dengan search, filter, dan sort
export const getAllEvents = async (
  search?: string,
  category?: string,
  location?: string,
  sortBy: 'newest' | 'soonest' | 'cheapest' = 'newest'
) => {
  const whereClause: Prisma.EventWhereInput = {
    AND: [
      search
        ? {
            name: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          }
        : {},
      category
        ? {
            category: {
              equals: category,
              mode: Prisma.QueryMode.insensitive,
            },
          }
        : {},
      location
        ? {
            location: {
              contains: location,
              mode: Prisma.QueryMode.insensitive,
            },
          }
        : {},
    ],
  };

  const orderByClause: Prisma.EventOrderByWithRelationInput =
    sortBy === 'soonest'
      ? { start_date: 'asc' }
      : sortBy === 'cheapest'
      ? { price: 'asc' }
      : { created_at: 'desc' };

  return prisma.event.findMany({
    where: whereClause,
    orderBy: orderByClause,
  });
};

//  Buat event baru + tambahkan promo jika ada
export const createEvent = async (data: {
  name: string;
  description?: string;
  category: string;
  location: string;
  price: number;
  startDate: string;
  endDate: string;
  totalSeats: number;
  organizer_id: string;
  promotion?: {
    code: string;
    discount: number;
    startDate: string;
    endDate: string;
  };
}) => {
  const event = await prisma.event.create({
    data: {
      name: data.name,
      description: data.description ?? '',
      category: data.category,
      location: data.location,
      price: data.price,
      start_date: new Date(data.startDate),
      end_date: new Date(data.endDate),
      total_seats: data.totalSeats,
      remaining_seats: data.totalSeats,
      organizer_id: 'org-1',
    },
  });

  if (data.promotion) {
    await prisma.voucher.create({
      data: {
        event_id: event.id,
        code: data.promotion.code,
        discount_amount: data.promotion.discount,
        start_date: new Date(data.promotion.startDate),
        end_date: new Date(data.promotion.endDate),
        usage_limit: 1,
        used_count: 0,
      },
    });
  }

  return event;
};

//  Ambil 1 event berdasarkan ID (dengan voucher jika ada)
export const getEventById = async (id: string) => {
  return prisma.event.findUnique({
    where: { id },
    include: {
      Voucher: true,
    },
  });
};
