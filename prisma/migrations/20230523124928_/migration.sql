-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('admin', 'vendor', 'booker', 'agent') NOT NULL,
    `mail` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `asWhatsapp` BOOLEAN NOT NULL,
    `acceptPromotions` BOOLEAN NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `pfp` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Calendar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user` INTEGER NOT NULL,
    `license` INTEGER NOT NULL,
    `appointments` JSON NOT NULL,
    `integration` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL,
    `type` ENUM('paid', 'free', 'trial') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `padding` INTEGER NOT NULL,
    `availability` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Integration` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(256) NOT NULL,
    `secret` VARCHAR(256) NOT NULL,
    `user` INTEGER NOT NULL,
    `type` ENUM('google', 'outlook', 'zapier', 'zoom') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user` INTEGER NOT NULL,
    `calendar` INTEGER NOT NULL,
    `license` INTEGER NOT NULL,
    `appointment` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `License` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('FREE', 'TRIAL', 'PAID') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `editedBy` INTEGER NOT NULL,
    `coupon` JSON NOT NULL,
    `fixedPrice` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Availability` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `calendar` INTEGER NOT NULL,
    `day` INTEGER NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `asWhatsapp` BOOLEAN NOT NULL,
    `acceptPromotions` BOOLEAN NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `pfp` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Coupon` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `CCode` VARCHAR(191) NOT NULL,
    `is_onetime` BOOLEAN NOT NULL,
    `editedby` INTEGER NOT NULL,
    `coupon` JSON NOT NULL,
    `discountPrice` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `calendar` INTEGER NOT NULL,
    `user` INTEGER NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `status` ENUM('COMPLETED', 'CANCELED', 'RESCHEDULED') NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `transaction` INTEGER NOT NULL,
    `canceltime` DATETIME(3) NULL,
    `isConfirmed` BOOLEAN NOT NULL,
    `length` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `calendar` INTEGER NOT NULL,
    `reviewer` INTEGER NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `rating` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
