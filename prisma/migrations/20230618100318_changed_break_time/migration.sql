/*
  Warnings:

  - You are about to alter the column `breakTime` on the `Calendar` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `Calendar` MODIFY `breakTime` JSON NULL;
