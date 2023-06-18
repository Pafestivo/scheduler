-- AlterTable
ALTER TABLE `Calendar` ADD COLUMN `googleReadFrom` VARCHAR(191) NULL,
    ADD COLUMN `googleWriteInto` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Integration` MODIFY `token` VARCHAR(800) NOT NULL,
    MODIFY `refreshToken` VARCHAR(800) NOT NULL;
