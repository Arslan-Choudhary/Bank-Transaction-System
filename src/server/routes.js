import app from "#server";

app.get("/", (req, res) => {
  res.send("Backend is live and running");
});
