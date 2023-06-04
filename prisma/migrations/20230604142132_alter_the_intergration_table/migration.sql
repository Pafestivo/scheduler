/*
  Warnings:

  - You are about to drop the column `hash` on the `Integration` table. All the data in the column will be lost.
  - You are about to drop the column `secret` on the `Integration` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Integration` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `Integration` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Integration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expiresAt` to the `Integration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `Integration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshToken` to the `Integration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userEmail` to the `Integration` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Integration_hash_key` ON `Integration`;

-- AlterTable
ALTER TABLE `Integration` DROP COLUMN `hash`,
    DROP COLUMN `secret`,
    DROP COLUMN `type`,
    DROP COLUMN `user`,
    ADD COLUMN `expiresAt` INTEGER NOT NULL,
    ADD COLUMN `provider` ENUM('google', 'outlook', 'zapier', 'zoom') NOT NULL,
    ADD COLUMN `refreshToken` VARCHAR(256) NOT NULL,
    ADD COLUMN `userEmail` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Integration_id_key` ON `Integration`(`id`);
