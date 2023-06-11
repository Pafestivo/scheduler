/*
  Warnings:

  - You are about to alter the column `userHash` on the `Calendar` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `Calendar` ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `password` VARCHAR(191) NULL,
    MODIFY `userHash` JSON NOT NULL;
