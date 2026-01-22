/*
  Warnings:

  - Made the column `country_id` on table `USERS` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "USERS" ALTER COLUMN "country_id" SET NOT NULL;
