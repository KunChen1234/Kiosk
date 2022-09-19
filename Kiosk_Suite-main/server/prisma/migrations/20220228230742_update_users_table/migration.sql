/*
  Warnings:

  - A unique constraint covering the columns `[idTag]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Users_idTag_key" ON "Users"("idTag");
