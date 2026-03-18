import app from "#server";
import { userRouter, accountRouter, transactionRoutes } from "#routes";

app.get("/", (_, res) => {
  res.send("Backend ledger is live and running");
});

/**
 * - Use Routes
 */
app.use("/api/auth", userRouter);

app.use("/api/accounts", accountRouter);

app.use("/api/transactions", transactionRoutes);
