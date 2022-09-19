/*
  Warnings:

  - A unique constraint covering the columns `[rfidTagId]` on the table `RfidTags` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RfidTags_rfidTagId_key" ON "RfidTags"("rfidTagId");
