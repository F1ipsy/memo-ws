/*
  Warnings:

  - A unique constraint covering the columns `[alt]` on the table `cards` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `categories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cards_alt_key" ON "cards"("alt");

-- CreateIndex
CREATE UNIQUE INDEX "categories_title_key" ON "categories"("title");
