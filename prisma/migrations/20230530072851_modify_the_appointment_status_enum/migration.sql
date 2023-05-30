-- AlterTable
ALTER TABLE `Appointment` MODIFY `status` ENUM('new', 'confirmed', 'completed', 'canceled', 'rescheduled') NOT NULL,
    MODIFY `transaction` INTEGER NULL,
    MODIFY `isConfirmed` BOOLEAN NOT NULL DEFAULT false;
