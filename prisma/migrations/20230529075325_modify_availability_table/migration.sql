/*
  Warnings:

  - You are about to drop the column `acceptPromotions` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `asWhatsapp` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `calendar` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `pfp` on the `Availability` table. All the data in the column will be lost.
  - Added the required column `calendarHash` to the `Availability` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Availability` DROP COLUMN `acceptPromotions`,
    DROP COLUMN `asWhatsapp`,
    DROP COLUMN `calendar`,
    DROP COLUMN `pfp`,
    ADD COLUMN `calendarHash` VARCHAR(191) NOT NULL;
