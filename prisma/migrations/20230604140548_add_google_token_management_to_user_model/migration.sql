-- AlterTable
ALTER TABLE `User` ADD COLUMN `accessToken` VARCHAR(191) NULL,
    ADD COLUMN `expiresAt` INTEGER NULL,
    ADD COLUMN `refreshToken` VARCHAR(191) NULL;
