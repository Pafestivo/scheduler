/*
  Warnings:

  - You are about to drop the column `availabilityHash` on the `Calendar` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Calendar` DROP COLUMN `availabilityHash`,
    ADD COLUMN `availabilities` JSON NULL;
