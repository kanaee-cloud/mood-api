require("dotenv").config();
const express = require("express");
const cors = require('cors');
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use("/api/v1", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
