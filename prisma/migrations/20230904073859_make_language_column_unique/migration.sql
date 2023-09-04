/*
  Warnings:

  - A unique constraint covering the columns `[language]` on the table `translations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `translations_language_key` ON `translations`(`language`);
