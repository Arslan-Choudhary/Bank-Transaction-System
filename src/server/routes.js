import app from "#server";
import { userRouter, accountRouter } from "#routes";

app.get("/", (req, res) => {
  res.send("Backend is live and running");
});

/**
 * - Use Routes
 */
app.use("/api/auth", userRouter);

app.use("/api/accounts", accountRouter);
