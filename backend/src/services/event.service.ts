import prisma from "../../prisma/client";
export const getAllEvents = async (search?: string, location?: string) => {
  return await prisma.event.findMany({
    where: {
      name: {
        contains: search,
        mode: 'insensitive',
      },
      location: location ? { equals: location } : undefined,
    },
    orderBy: { startDate: 'asc' },
  });
};
export const createEvent = async (data: {
  name: string;
  description?: string;
  location: string;
  price: number;
  startDate: string;
  endDate: string;
  promotion?: {
    code: string;
    discount: number;
    startDate: string;
    endDate: string;
  };
}) => {
  return await prisma.event.create({
    data: {
      name: data.name,
      description: data.description,
      location: data.location,
      price: data.price,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      promotion: data.promotion
        ? {
            create: [
              {
                code: data.promotion.code,
                discount: data.promotion.discount,
                startDate: new Date(data.promotion.startDate),
                endDate: new Date(data.promotion.endDate),
              },
            ],
          }
        : undefined,
    },
  });
};
// 🔼 Tambahan: ambil event berdasarkan ID
export const getEventById = async (id: string) => {
  return await prisma.event.findUnique({
    where: { id },
    include: {
      promotion: true, // 🔄 untuk menyertakan promo jika ada
    },
  });
};