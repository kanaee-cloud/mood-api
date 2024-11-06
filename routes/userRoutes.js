const express = require("express");
const db = require("../firebase");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { to, message_text, spotify_url } = req.body;
    const newMessage = {
      to,
      message_text,
      spotify_url,
      createdAt: new Date(),
    };

    const userRef = await db.collection("message").add(newMessage);
    res.status(201).json({ id: userRef.id, ...newMessage });
  } catch (error) {
    res.status(500).json({ error: "Error Creating User" });
  }
});

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("message").get();
    const message = snapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt.toDate().toISOString();
      return {
        id: doc.id,
        ...data,
        createdAt,
      };
    });
    res.status(200).json({ data: message });
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

module.exports = router;
