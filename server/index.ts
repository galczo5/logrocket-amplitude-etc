import express from "express";

const app = express();
const PORT = 3001;

app.use(express.json());
app.use((_req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

import productsRouter from "./routes/products.js";
import authRouter from "./routes/auth.js";
import ordersRouter from "./routes/orders.js";

app.use("/api/products", productsRouter);
app.use("/api/auth", authRouter);
app.use("/api/orders", ordersRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
