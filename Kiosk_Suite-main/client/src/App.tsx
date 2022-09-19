"use strict";
import React, { useEffect, useState } from "react";
// import useWebSocket, { ReadyState } from "react-use-websocket";
import { useNavigate } from "react-router-dom";
import "./App.css";
import Home from "./Components/Home/Home";
import Loading from "./Components/Loading/Loading";
import useSocket from "./context/socket";
// import io from "./types/socket";

function App() {
	const socket = useSocket();
	const navigate = useNavigate();
	// const params = useParams();
	const [connStatus, setConnStatus] = useState(socket.connected);

	useEffect(() => {
		socket?.on("connect", () => {
			setConnStatus(socket.connected);
		});

		socket?.on("disconnect", () => {
			console.log("disconnected");
			setConnStatus(socket.connected);
		});

		socket?.on("userScanData", (data1: io.UserIdTag, data2: io.DeviceInfo) => {
			// console.log(data1);
			// console.log(data2);
			if (data1 && data2) {
				navigate("/tag-scan", { state: { userData: data1, associatedDevices: data2, conn: connStatus } });
			}
		});
		return function socketCleanup() {
			socket?.removeAllListeners("userScanData");
			socket?.removeAllListeners("disconnect");
			socket?.removeAllListeners("connect");
			return;
		};
	}, [connStatus, socket]);

	if (connStatus) {
		return (
			<div className="">
				<Home />
			</div>
		);
	} else {
		return (
			<Loading />
		);
	}
}

export default App;