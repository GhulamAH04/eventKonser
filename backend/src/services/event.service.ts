import prisma from '../../prisma/client';

export const getAllEvents = async (search?: string, location?: string) => {
  return prisma.event.findMany({
    where: {
      AND: [
        search ? { name: { contains: search, mode: 'insensitive' } } : {},
        location ? { location: { contains: location, mode: 'insensitive' } } : {},
      ],
    },
    orderBy: { start_date: 'asc' },
  });
};

export const createEvent = async (data: {
  name: string;
  description?: string;
  category: string;
  location: string;
  price: number;
  startDate: string;
  endDate: string;
  totalSeats: number;
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
      category: data.category, // 🔥 (wajib diisi karena required)
      location: data.location,
      price: data.price,
      start_date: new Date(data.startDate),
      end_date: new Date(data.endDate),
      total_seats: data.totalSeats,
      remaining_seats: data.totalSeats,
      organizer_id: "your-organizer-id", // ganti pas integrasi session user
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
      },
    });
  }

  return event;
};

export const getEventById = async (id: string) => {
  return prisma.event.findUnique({
    where: { id },
    include: {
      Voucher: true,
    },
  });
};
