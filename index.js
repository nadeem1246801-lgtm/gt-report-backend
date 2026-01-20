const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

const KTY_CUSTOM_ID = "KTY";
const bannedPlayers = new Set();
const onlinePlayers = new Map();

app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

app.post("/join", (req, res) => {
    const { playerName } = req.body;
    if (!playerName) return res.json({ error: "Missing playerName" });

    onlinePlayers.set(playerName, true);

    if (playerName === KTY_CUSTOM_ID) bannedPlayers.delete(playerName);

    res.json({ banned: bannedPlayers.has(playerName) });
});

app.post("/report", (req, res) => {
    const { targetName } = req.body;
    if (!targetName) return res.json({ error: "Missing targetName" });
    if (targetName === KTY_CUSTOM_ID) return res.json({ success: false, reason: "Protected player" });

    bannedPlayers.add(targetName);
    console.log(`Banned (report): ${targetName}`);

    res.json({ success: true, banned: true });
});

app.post("/isbanned", (req, res) => {
    const { playerName } = req.body;
    if (!playerName) return res.json({ error: "Missing playerName" });
    if (playerName === KTY_CUSTOM_ID) return res.json({ banned: false });

    res.json({ banned: bannedPlayers.has(playerName) });
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
