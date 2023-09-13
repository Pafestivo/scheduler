-- AlterTable
ALTER TABLE `Calendar` ADD COLUMN `activeTheme` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `Themes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `header` VARCHAR(191) NOT NULL,
    `button` VARCHAR(191) NOT NULL,
    `mainText` VARCHAR(191) NOT NULL,
    `secondaryText` VARCHAR(191) NOT NULL,
    `calendarText` VARCHAR(191) NOT NULL,
    `disabledDay` VARCHAR(191) NOT NULL,
    `selectedDay` VARCHAR(191) NOT NULL,
    `calendarBorder` VARCHAR(191) NOT NULL,
    `calendarHeaderBackground` VARCHAR(191) NOT NULL,
    `pageBackground` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Themes_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
