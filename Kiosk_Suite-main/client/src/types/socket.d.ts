declare namespace io {
	export interface UserIdTag {
		id: number
		createdAt: Date
		updatedAt: Date
		userId: string
		idTag: string
		userName: string
		associatedDevices: string[]
	}

	export interface DeviceInfo {
		id: number
		createdAt: Date
		updatedAt: Date
		serialNumber: string
		macAddress: string
		deviceId: string
		groupId: string
		lastContact: Date
		firmwareVersion: string
		configVersion: string
		isDeployed: boolean
		ipAddress: string
		uwbCapable: boolean
		lteCapable: boolean
		bleMac: string
		userId?: string
		uwbId?: string
		bleId?: string
		rfid?: string
		imei?: string
	}
}