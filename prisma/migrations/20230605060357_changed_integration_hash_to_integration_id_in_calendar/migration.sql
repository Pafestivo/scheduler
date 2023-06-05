/*
  Warnings:

  - You are about to drop the column `integrationHash` on the `Calendar` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Calendar` DROP COLUMN `integrationHash`,
    ADD COLUMN `integrationId` INTEGER NULL;
