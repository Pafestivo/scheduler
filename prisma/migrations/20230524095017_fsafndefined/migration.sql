/*
  Warnings:

  - A unique constraint covering the columns `[hash]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hash]` on the table `Availability` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hash]` on the table `Calendar` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hash]` on the table `Coupon` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hash]` on the table `Integration` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hash]` on the table `License` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hash]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hash]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hash]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Appointment_hash_key` ON `Appointment`(`hash`);

-- CreateIndex
CREATE UNIQUE INDEX `Availability_hash_key` ON `Availability`(`hash`);

-- CreateIndex
CREATE UNIQUE INDEX `Calendar_hash_key` ON `Calendar`(`hash`);

-- CreateIndex
CREATE UNIQUE INDEX `Coupon_hash_key` ON `Coupon`(`hash`);

-- CreateIndex
CREATE UNIQUE INDEX `Integration_hash_key` ON `Integration`(`hash`);

-- CreateIndex
CREATE UNIQUE INDEX `License_hash_key` ON `License`(`hash`);

-- CreateIndex
CREATE UNIQUE INDEX `Review_hash_key` ON `Review`(`hash`);

-- CreateIndex
CREATE UNIQUE INDEX `Transaction_hash_key` ON `Transaction`(`hash`);

-- CreateIndex
CREATE UNIQUE INDEX `User_hash_key` ON `User`(`hash`);
