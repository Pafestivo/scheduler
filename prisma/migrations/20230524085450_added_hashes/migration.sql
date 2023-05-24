/*
  Warnings:

  - Added the required column `hash` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hash` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hash` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hash` to the `Coupon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hash` to the `Integration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hash` to the `License` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hash` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hash` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hashedPassword` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hashedResetToken` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Appointment` ADD COLUMN `hash` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Availability` ADD COLUMN `hash` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Calendar` ADD COLUMN `hash` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Coupon` ADD COLUMN `hash` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Integration` ADD COLUMN `hash` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `License` ADD COLUMN `hash` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Review` ADD COLUMN `hash` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Transaction` ADD COLUMN `hash` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `hash` VARCHAR(191) NOT NULL,
    ADD COLUMN `hashedPassword` VARCHAR(191) NOT NULL,
    ADD COLUMN `hashedResetToken` VARCHAR(191) NOT NULL;
