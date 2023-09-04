/*
  Warnings:

  - You are about to drop the `translations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `translations`;

-- CreateTable
CREATE TABLE `Translations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `language` VARCHAR(191) NOT NULL,
    `translations` JSON NOT NULL,

    UNIQUE INDEX `Translations_language_key`(`language`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
