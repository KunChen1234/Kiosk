"use strict";
import { Prisma, PrismaClient, RfidTags } from "@prisma/client";
import SerialPort from "serialport";
import nodeConfig from "config";

type PrismaClientInstance = PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation>

interface RoobuckTag {
	SN: string;
	MAC: string;
}

function spErrCB(err: Error | null | undefined): void {
	if (err) {
		console.error(err.message);
		console.log("Unable to write to SerialPort");
	}
	return;
}

/**
 * 
 * @param {Bufer} data - Buffer output of RFID/NFC Scanner
 * @param {boolean} readTag - Boolean determining if the data is expected to be the encoded data from the NFC card.
 * @param {string | null} tagId - If readTag is true, this is the ID of the RFID/NFC card being read. Otherwise Null
 * @param {string} ipAddress - IP Address of the host machine
 * @param {PrismaClientInstance} prismaClient - The instance of the prisma client to read/write data.
 * @param {SerialPort} comPort - Serial port for reading/writing to the RFID reader
 * @returns {[string | null, boolean, RfidTags | null]} - Output for the rfid read.
 */
async function parseData(
	data: Buffer,  
	readTag: boolean, 
	tagId: string | null, 
	ipAddress: string,
	prismaClient: PrismaClientInstance,
	comPort: SerialPort
): Promise<[string | null, boolean, RfidTags | null]> {
	console.log("Data Received");
	console.log(`FreshData: ${data}`);
	let tag: RfidTags | null = null;
	if (data && Buffer.isBuffer(data) && data.subarray(0, 4).toString() === "0001" && data.length > 4) {
		if (readTag && tagId) {
			console.log("Updating Tags With Values");
			readTag = false;
			if (data.subarray(0, 4).toString() === "0001") {
				console.log(true);
			}
			let datastr = data.toString();
			console.log(`Data: ${datastr}`);
			console.log(`len: ${datastr.length}`);

			data = Buffer.from(datastr, "hex");
			// console.log(tmp);
			const index = data.toString().indexOf("}");
			datastr = data.subarray(12, index + 1).toString();
			let dataObj: RoobuckTag | null = null;
			try {
				dataObj = JSON.parse(datastr);

			} catch (err) {
				console.error("Not Roobuck Tag");
			}
			if (!dataObj || !dataObj["MAC"] || !dataObj["SN"]) {
				console.error("Bad Tag Read");
				tagId = null;
				comPort.write("0407646009F401F401\r", spErrCB);
				return [tagId, readTag, null];
			}
			if (dataObj && dataObj["MAC"] && typeof dataObj["MAC"] === "string") {
				let lastChar = dataObj["MAC"][dataObj["MAC"].length - 1];
				console.log(`Last Character: ${lastChar}`);
				lastChar = (parseInt(lastChar, 16) - 2).toString(16);
				dataObj["MAC"] = dataObj["MAC"].substring(0, dataObj["MAC"].length - 1) + lastChar.toUpperCase();
			}
			console.log(dataObj);
			if (dataObj["MAC"] && dataObj["SN"]) {
				tag = await prismaClient.rfidTags.upsert({
					where: {
						rfidTagId: tagId
					},
					update: {
						lastScannedTime: new Date(),
						lastScannedLocation: "Roobuck Lab"
					},
					create: {
						rfidTagId: tagId,
						tagType: "Test Tag",
						serialNumber: dataObj["SN"],
						macAddress: dataObj["MAC"],
						lastScannedTime: new Date(),
						lastScannedLocation: "Roobuck Lab"
					}
				});
				comPort.write("0407646009F401F401\r", spErrCB); // Sound Beeper
				console.log(tag);
			}
			tagId = null;
		} else {
			tagId = data.subarray(4).toString();
			//Add to scan log;
			await prismaClient.rfidScanLog.create({
				data: {
					scannerId: `kiosk_${nodeConfig.get("shortId")}`,
					rfidTagId: tagId,
					ipAddress: ipAddress
				}
			});
			// Add tag to database
			console.log("Finding Tags");
			tag = await prismaClient.rfidTags.findUnique({
				where: {
					rfidTagId: tagId
				}
			});
			if (tag && (tag.tagType === "idCard" || tag.tagType === "Roobuck Caplamp" || tag.tagType === "Test Tag")) {
				comPort.write("0407646005F400F400\r", spErrCB);
				comPort.write("0407646007F401F401\r", spErrCB);
			} else {
				readTag = true;
				comPort.write("0407646006F400F400\r", spErrCB);
				comPort.write("0407646004F401F401\r", spErrCB);
			}
			console.log(tag);
		}
	}
	return [tagId, readTag, tag];
}

export default parseData;