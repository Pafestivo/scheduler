/*
  Warnings:

  - You are about to drop the column `appointments` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the column `availability` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the column `integration` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the column `license` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `Calendar` table. All the data in the column will be lost.
  - Added the required column `licenseHash` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userHash` to the `Calendar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Calendar` DROP COLUMN `appointments`,
    DROP COLUMN `availability`,
    DROP COLUMN `integration`,
    DROP COLUMN `license`,
    DROP COLUMN `user`,
    ADD COLUMN `appointmentsHash` JSON NULL,
    ADD COLUMN `availabilityHash` JSON NULL,
    ADD COLUMN `integrationHash` INTEGER NULL,
    ADD COLUMN `licenseHash` INTEGER NOT NULL,
    ADD COLUMN `userHash` VARCHAR(191) NOT NULL,
    MODIFY `isActive` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `type` ENUM('paid', 'free', 'trial') NOT NULL DEFAULT 'free';
