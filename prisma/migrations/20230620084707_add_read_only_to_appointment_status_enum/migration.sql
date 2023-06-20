-- AlterTable
ALTER TABLE `Appointment` MODIFY `status` ENUM('new', 'confirmed', 'completed', 'canceled', 'rescheduled', 'readOnly') NOT NULL;
