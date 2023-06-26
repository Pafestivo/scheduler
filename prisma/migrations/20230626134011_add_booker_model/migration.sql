-- CreateTable
CREATE TABLE `Booker` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `preferedChannel` VARCHAR(191) NOT NULL,
    `appointmentHash` JSON NOT NULL,

    UNIQUE INDEX `Booker_phone_key`(`phone`),
    UNIQUE INDEX `Booker_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
