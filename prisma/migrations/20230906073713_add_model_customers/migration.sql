-- CreateTable
CREATE TABLE `Customers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `customerId` INTEGER NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `tmpToken` INTEGER NOT NULL,

    UNIQUE INDEX `Customers_name_key`(`name`),
    UNIQUE INDEX `Customers_customerId_key`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
