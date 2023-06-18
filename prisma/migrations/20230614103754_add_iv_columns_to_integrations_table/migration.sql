/*
  Warnings:

  - Added the required column `refreshTokenIv` to the `Integration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokenIv` to the `Integration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Integration` ADD COLUMN `refreshTokenIv` VARCHAR(191) NOT NULL,
    ADD COLUMN `tokenIv` VARCHAR(191) NOT NULL;
