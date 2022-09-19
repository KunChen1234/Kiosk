import React, { useEffect, useState } from "react";
import useSocket from "../../context/socket";
import Error from "../Error/Error";


function Home() {
	// props.sendMessageCB is SendJsonMessage;
	const socket = useSocket();
	const [errorVisibility, setErrorVisibility] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		socket.on("disconnect", () => {
			console.log("Disconnected");
			setErrorMessage("Connection Lost. Please Restart Service.");
			setErrorVisibility(true);
		});
		socket.on("connect", () => {
			console.log("Connected");
			setErrorMessage("");
			setErrorVisibility(false);
		});
		return function socketCleanup() {
			socket?.removeAllListeners("connect");
			socket?.removeAllListeners("disconnect");
		};
	});

	function wsSend() {
		console.log("Button Clicked");
	}
	return (
		<div className=" pt-40 text-center ">
			<Error visible={errorVisibility} message={errorMessage} />
			<h1 className=" text-5xl ">Welcome!</h1>
			<h2 className=" text-4xl ">Scan ID Card to Begin.</h2>
			<div className=" p-20 " >
				<button 
					className=" p-2 bg-roobuck-onyx max-w-sm mx-auto rounded-xl shadow-lg space-x-4 hover:bg-neutral-800 active:bg-neutral-900 " 
					onClick={wsSend}
				>
					User Management
				</button>
			</div>

		</div>
	);
}

export default Home;