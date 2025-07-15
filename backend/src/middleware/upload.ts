import multer from "multer";
import path from "path";
import { Request } from "express";

// Configuração do storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Gera nome único para o arquivo
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = file.fieldname + "-" + uniqueSuffix + ext;
    cb(null, name);
  },
});

// Filtro para tipos de arquivo
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Aceita apenas imagens
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Apenas arquivos de imagem são permitidos!"));
  }
};

// Configuração do multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || "5242880"), // 5MB por padrão
    files: 5, // Máximo 5 arquivos por vez
  },
});

// Middleware para upload de uma única imagem
export const uploadSingle = upload.single("image");

// Middleware para upload de múltiplas imagens
export const uploadMultiple = upload.array("images", 5);

// Middleware para upload de imagens de produto
export const uploadProductImages = upload.array("images", 5);

// Middleware para tratamento de erros de upload
export const handleUploadError = (
  error: any,
  req: Request,
  res: any,
  next: any
) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: { message: "Arquivo muito grande. Tamanho máximo: 5MB" },
      });
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        error: { message: "Muitos arquivos. Máximo: 5 arquivos" },
      });
    }
  }

  if (error.message === "Apenas arquivos de imagem são permitidos!") {
    return res.status(400).json({
      success: false,
      error: { message: error.message },
    });
  }

  next(error);
};
