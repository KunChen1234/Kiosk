import React, { createContext, useContext } from "react";
import io from "socket.io-client";

const socket = io("ws://localhost:14000");
const SocketContext = createContext(socket);

export default function useSocket() {
	return useContext(SocketContext);
}