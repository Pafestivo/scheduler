-- AlterTable
ALTER TABLE `User` MODIFY `name` VARCHAR(191) NULL,
    MODIFY `type` ENUM('admin', 'vendor', 'booker', 'agent') NOT NULL DEFAULT 'booker',
    MODIFY `phone` VARCHAR(191) NULL,
    MODIFY `asWhatsapp` BOOLEAN NULL DEFAULT false,
    MODIFY `acceptPromotions` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `pfp` VARCHAR(191) NULL,
    MODIFY `hashedPassword` VARCHAR(191) NULL,
    MODIFY `hashedResetToken` VARCHAR(191) NULL,
    MODIFY `email` VARCHAR(191) NULL;
