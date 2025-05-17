/*
  Warnings:

  - You are about to drop the column `guest_email` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "guest_email",
ADD COLUMN     "guestEmail" TEXT;
