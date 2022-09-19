-- CreateTable
CREATE TABLE "DeviceInfo" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "serialNumber" VARCHAR(255) NOT NULL,
    "macAddress" VARCHAR(17) NOT NULL,
    "deviceId" VARCHAR(255) NOT NULL,
    "groupId" VARCHAR(255) NOT NULL,
    "lastContact" TIMESTAMP(3) NOT NULL,
    "firmwareVersion" VARCHAR(255) NOT NULL,
    "configVersion" VARCHAR(255) NOT NULL,
    "isDeployed" BOOLEAN NOT NULL DEFAULT false,
    "ipAddress" VARCHAR(255) NOT NULL,
    "uwbCapable" BOOLEAN NOT NULL DEFAULT false,
    "lteCapable" BOOLEAN NOT NULL DEFAULT false,
    "bleMac" VARCHAR(255) NOT NULL,
    "userId" VARCHAR(255),
    "uwbId" VARCHAR(255),
    "bleId" VARCHAR(255),
    "rfid" VARCHAR(255),
    "imei" VARCHAR(255),

    CONSTRAINT "DeviceInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RfidTags" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rfidTagId" TEXT NOT NULL,
    "tagType" TEXT NOT NULL,
    "lastScannedTime" TIMESTAMP(3) NOT NULL,
    "lastScannedLocation" TEXT NOT NULL,
    "serialNumber" TEXT,
    "macAddress" TEXT,
    "assignedUser" TEXT,
    "vehicleRegistration" TEXT,
    "assetTagType" TEXT,

    CONSTRAINT "RfidTags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RfidScanLog" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "scannerId" TEXT NOT NULL,
    "rfidTagData" TEXT NOT NULL,
    "scanTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT NOT NULL,

    CONSTRAINT "RfidScanLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RfidScanners" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "scannerName" TEXT NOT NULL,
    "scannerId" TEXT NOT NULL,
    "scannerChannel" INTEGER NOT NULL DEFAULT 1,
    "locationName" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "mapCoord" TEXT,
    "gpsCoord" TEXT,

    CONSTRAINT "RfidScanners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeviceInfo_serialNumber_key" ON "DeviceInfo"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceInfo_macAddress_key" ON "DeviceInfo"("macAddress");

-- CreateIndex
CREATE UNIQUE INDEX "RfidTags_id_key" ON "RfidTags"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RfidScanLog_id_key" ON "RfidScanLog"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RfidScanners_id_key" ON "RfidScanners"("id");
