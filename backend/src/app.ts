import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Carregar variáveis de ambiente
dotenv.config();

const app: Express = express();

// Middlewares globais
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Middleware para servir arquivos estáticos (uploads)
app.use("/uploads", express.static("uploads"));

// Rotas básicas
app.get("/", (req, res) => {
  res.json({
    message: "API Brechó do Futuro!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Importar rotas
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import contactRoutes from "./routes/contactRoutes";

// Usar rotas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/contato", contactRoutes);
// app.use('/api/categories', categoryRoutes); // Para implementação futura

// Middleware de tratamento de erros
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Erro:", err);

    res.status(err.status || 500).json({
      error: {
        message: err.message || "Erro interno do servidor",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
      },
    });
  }
);

// Middleware para rotas não encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    error: {
      message: "Rota não encontrada",
      path: req.originalUrl,
    },
  });
});

export default app;
