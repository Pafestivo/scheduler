/*
  Warnings:

  - You are about to drop the column `calendar` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `Appointment` table. All the data in the column will be lost.
  - The values [COMPLETED,CANCELED,RESCHEDULED] on the enum `Appointment_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `length` on the `Appointment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.
  - Added the required column `calendarHash` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userHash` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Appointment` DROP COLUMN `calendar`,
    DROP COLUMN `user`,
    ADD COLUMN `calendarHash` VARCHAR(191) NOT NULL,
    ADD COLUMN `userHash` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('completed', 'canceled', 'rescheduled') NOT NULL,
    MODIFY `date` VARCHAR(191) NOT NULL,
    MODIFY `length` INTEGER NOT NULL;
