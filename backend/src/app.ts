import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Carregar variáveis de ambiente
dotenv.config();

const app: Express = express();

// Configuração de CORS para aceitar múltiplas origens
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:4173", // Vite preview
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "https://loose-href-ion-champagne.trycloudflare.com", // Cloudflare tunnel
];

// Middlewares globais
app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir requisições sem origin (como Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Não permitido pelo CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Middleware para servir arquivos estáticos (uploads)
app.use("/uploads", express.static("uploads"));

// Middleware de debug para logar todas as requisições
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
//   next();
// });

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
import categoryRoutes from "./routes/categoryRoutes";
import cartRoutes from "./routes/cartRoutes";
import productReviewRoutes from "./routes/productReviewRoutes";
import melhorEnvioRoutes from "./routes/melhorEnvioRoutes";
import shippingRoutes from "./routes/shippingRoutes";

// Usar rotas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/melhorenvio", melhorEnvioRoutes);
app.use("/contato", contactRoutes);
app.use("/api", productReviewRoutes);

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
