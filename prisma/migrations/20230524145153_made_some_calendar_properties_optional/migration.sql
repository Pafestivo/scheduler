-- AlterTable
ALTER TABLE `Calendar` MODIFY `appointments` JSON NULL,
    MODIFY `integration` INTEGER NULL,
    MODIFY `padding` INTEGER NULL,
    MODIFY `availability` JSON NULL;
