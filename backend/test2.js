const express = require("express");
const app = express();
app.use(express.json());

app.put("/api/profile/update", (req,res) => {
  res.json({ ok: true, body: req.body });
});

app.listen(5000, () => console.log("TEST OK 5000"));
