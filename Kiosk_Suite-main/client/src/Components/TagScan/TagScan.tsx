import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import useSocket from "../../context/socket";
import TableButton from "./DeviceTable/DeviceTable";

interface State {
	conn: boolean
	userData: io.UserIdTag
	associatedDevices: io.DeviceInfo[]
}

function TagScan() {

	const navigate = useNavigate();
	const location = useLocation();
	const state = location.state as State;
	const [userData, setUserData] = useState(state.userData);
	const [deviceInfo, setDeviceInfo] = useState<Array<io.DeviceInfo>>(state.associatedDevices);
	const socket = useSocket();

	useEffect(() => {
		socket?.on("userScanData", (user: io.UserIdTag, devices: io.DeviceInfo[]) => {
			console.log("userScanData");
			setUserData(user);
			setDeviceInfo(devices);
		});
		socket?.on("assetScanData", (msg: io.DeviceInfo[]) => {
			console.log("assetScanData");
			setDeviceInfo(msg);
		});
		return function socketCleanup() {
			socket?.removeAllListeners("assetScanData");
		};
	}, [socket, deviceInfo]);
	useEffect(() => {
		const timerID = setInterval(() => returnHome(), 30000);
		return function cleanup() {
			clearInterval(timerID);
		};
	});

	
	function returnHome() {
		navigate("/");
	}
	return (
		<div className=" min-h-full ">
			<div className="flex flex-col min-h-[30rem]">
				<div className="flex-grow p-5 grid grid-cols-2 gap-4">
					<h1 className="col-span-2 row-start-1 text-center text-3xl"><strong>Scan Device to Pair</strong></h1>
					<div className=" row-start-3 content-center justify-center ">
						<table className="table-fixed w-[20rem] justify-center content-center ">
							<thead className="bg-gray-500">
								<tr>
									<th colSpan={2}>User Information</th>
								</tr>
							</thead>
							<tbody >
								<tr>
									<td><strong>Name:</strong></td>
									<td className="text-right">{userData.userName}</td>
								</tr>
								<tr>
									<td><strong>User ID:</strong></td>
									<td className="text-right">{userData.userId}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className=" row-start-3 content-center justify-center ">
						<TableButton
							buttonName="Unpair Device"
							tableName="Associated Devices"
							data={deviceInfo}
							className=""
						/>
					</div>
				</div>
			</div>
			<div className="bottom-0 content-center justify-center text-center">
				<button
					className=" p-2 bg-roobuck-onyx max-w-sm mx-auto rounded-xl shadow-lg space-x-4 hover:bg-neutral-800 active:bg-neutral-900 content-center"
					onClick={returnHome}
				>
					Finish
				</button>
			</div>
		</div>
	);
}

export default TagScan;