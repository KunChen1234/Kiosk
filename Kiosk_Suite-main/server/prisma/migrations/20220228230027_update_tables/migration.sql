/*
  Warnings:

  - Added the required column `rfidTagId` to the `RfidScanLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RfidScanLog" ADD COLUMN     "rfidTagId" TEXT NOT NULL,
ALTER COLUMN "rfidTagData" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "idTag" TEXT NOT NULL,
    "associatedDevices" TEXT[],

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "Users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_userId_key" ON "Users"("userId");
