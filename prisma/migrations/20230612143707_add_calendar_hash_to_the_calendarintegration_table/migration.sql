/*
  Warnings:

  - Added the required column `calendarHash` to the `CalendarIntegration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `CalendarIntegration` ADD COLUMN `calendarHash` VARCHAR(191) NOT NULL;
