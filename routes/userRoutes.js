const express = require("express");
const db = require("../firebase");
const router = express.Router();

function generateRandomId() {
  return Math.floor(Math.random() * 900000) + 100000;
}

router.post("/message", async (req, res) => {
  try {
    const { to, message_text, spotify_url } = req.body;
    const newId = generateRandomId();
    const newMessage = {
      id: newId,
      to,
      message_text,
      spotify_url,
      createdAt: new Date(),
    };

    const messageRef = await db
      .collection("message")
      .doc(newId.toString())
      .set(newMessage);
    res.status(201).json({ id: messageRef.id, ...newMessage });
  } catch (error) {
    res.status(500).json({ error: "Error Creating Message" });
  }
});

router.get("/message", async (req, res) => {
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
    res.status(500).json({ error: "Error fetching message" });
  }
});

router.get("/message/search", async (req, res) => {
  try {
    const { user } = req.query;
    const snapshot = await db
      .collection("message")
      .where("to", "==", user)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "Post not found" });
    }

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
    res.status(500).json({ error: "Error searching message" });
  }
});

module.exports = router;
