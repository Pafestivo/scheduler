/*
  Warnings:

  - A unique constraint covering the columns `[watchChannelId]` on the table `Calendar` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Calendar_watchChannelId_key` ON `Calendar`(`watchChannelId`);
