const { createServer } = require("node:http");
const next = require("next");
const { Server } = require("socket.io");
const { watchAlerts } = require("./lib/watchAlerts");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.HTTP_SERVER_PORT || 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("Client connected");
  });

  watchAlerts((alert) => {
    io.emit("new-alert", alert);
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
