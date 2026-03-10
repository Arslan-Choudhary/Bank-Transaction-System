import app from "#server";
import { userRouter } from "#routes";

app.get("/", (req, res) => {
  res.send("Backend is live and running");
});

app.use("/api/auth", userRouter);
