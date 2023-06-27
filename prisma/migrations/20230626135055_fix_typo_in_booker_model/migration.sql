/*
  Warnings:

  - You are about to drop the column `preferedChannel` on the `Booker` table. All the data in the column will be lost.
  - Added the required column `preferredChannel` to the `Booker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Booker` DROP COLUMN `preferedChannel`,
    ADD COLUMN `preferredChannel` VARCHAR(191) NOT NULL;
