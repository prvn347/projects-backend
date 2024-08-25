"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __importDefault(require("net"));
const redis_1 = require("redis");
// Redis client setup
const client = (0, redis_1.createClient)();
client.on("error", (err) => console.log("Redis Client Error", err));
const PORT = process.env.PORT || 8080;
console.log("Proxy Server Port:", PORT);
// Create the proxy server
const app = net_1.default.createServer();
app.on("connection", (clientToProxySocket) => {
    console.log("Connection Established");
    clientToProxySocket.once("data", (data) => {
        const dataStr = data.toString();
        console.log("Data received from client:", dataStr);
        const isConnectionTLS = dataStr.indexOf("CONNECT") !== -1;
        let serverAddress;
        let serverPort;
        if (isConnectionTLS) {
            // Handling TLS connections (e.g., HTTPS)
            serverPort = 443;
            serverAddress = dataStr.split("CONNECT ")[1].split(" ")[0].split(":")[0];
            clientToProxySocket.write("HTTP/1.1 200 OK\r\n\r\n");
        }
        else {
            // Handling non-TLS connections (e.g., HTTP)
            serverPort = 80;
            serverAddress = dataStr.split("Host: ")[1].split("\r\n")[0];
            clientToProxySocket.write(data); // Forward the initial data for non-TLS
        }
        // Establish connection to the server
        const proxyToServerSocket = net_1.default.createConnection({ host: serverAddress, port: serverPort }, () => {
            console.log("Proxy connected to server:", serverAddress, ":", serverPort);
        });
        // Forward the data from client to the server
        if (!isConnectionTLS) {
            proxyToServerSocket.write(data); // Initial data was already written for TLS
        }
        console.log("Data sent to server:", dataStr);
        // Pipe data between client and server
        clientToProxySocket.pipe(proxyToServerSocket);
        proxyToServerSocket.pipe(clientToProxySocket);
        // Error handling
        proxyToServerSocket.on("error", (err) => {
            console.error("Proxy to server error:", err.message);
            clientToProxySocket.end(); // Close client connection on server error
        });
        clientToProxySocket.on("error", (err) => {
            console.error("Client to proxy error:", err.message);
            proxyToServerSocket.end(); // Close server connection on client error
        });
        proxyToServerSocket.on("close", () => {
            console.log("Server connection closed");
        });
        clientToProxySocket.on("close", () => {
            console.log("Client connection closed");
        });
    });
});
// Start the proxy server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        console.log("Connected to Redis");
        app.listen({ host: "0.0.0.0", port: 3000 }, () => {
            console.log("Proxy server running on port:", PORT);
        });
    }
    catch (error) {
        console.error("Failed to connect to Redis:", error);
    }
});
startServer();
