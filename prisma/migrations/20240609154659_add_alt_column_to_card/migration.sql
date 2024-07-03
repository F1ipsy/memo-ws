/*
  Warnings:

  - Added the required column `alt` to the `cards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "alt" TEXT NOT NULL;
