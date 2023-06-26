/*
  Warnings:

  - A unique constraint covering the columns `[userHash]` on the table `Integration` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Integration` ADD COLUMN `userHash` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Integration_userHash_key` ON `Integration`(`userHash`);
