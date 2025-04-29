/*
  Warnings:

  - Added the required column `usage_limit` to the `Voucher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Voucher" ADD COLUMN     "usage_limit" INTEGER NOT NULL,
ADD COLUMN     "used_count" INTEGER NOT NULL DEFAULT 0;
