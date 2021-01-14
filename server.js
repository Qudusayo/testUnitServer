const express = require("express");
const cors = require("cors");

const server = express();
server.use(cors());

const api = require("./route/api");
server.use("/api", api);

server.get("*", (req, res) => {
    res.status(404).json({ error: "Invalid route. Route not found" });
});

const PORT = 5000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
