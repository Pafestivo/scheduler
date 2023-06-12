-- CreateTable
CREATE TABLE `CalendarIntegration` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userEmail` VARCHAR(191) NOT NULL,
    `calendarName` VARCHAR(191) NULL,
    `provider` ENUM('google', 'outlook', 'zapier', 'zoom') NOT NULL,

    UNIQUE INDEX `CalendarIntegration_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
