/*
  Warnings:

  - You are about to drop the column `canceltime` on the `Appointment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Appointment` DROP COLUMN `canceltime`,
    ADD COLUMN `cancelTime` DATETIME(3) NULL;
