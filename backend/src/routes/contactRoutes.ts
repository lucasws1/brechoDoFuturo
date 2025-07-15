import { Router, Request, Response } from "express";

const router: Router = Router();

/**
 * @route GET /contato
 * @desc Redirecionar para WhatsApp
 * @access Public
 */
router.get("/", (req: Request, res: Response) => {
  // Número do WhatsApp da empresa (você pode colocar em variável de ambiente)
  const whatsappNumber = process.env.WHATSAPP_NUMBER || "5511999999999";
  const message = encodeURIComponent(
    "Olá! Vim através do site do Brechó do Futuro."
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  res.redirect(whatsappUrl);
});

/**
 * @route GET /api/contact
 * @desc Informações de contato (API)
 * @access Public
 */
router.get("/api", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      whatsapp: process.env.WHATSAPP_NUMBER || "5511999999999",
      email: process.env.CONTACT_EMAIL || "contato@brechodofuturo.com",
      message: "Entre em contato conosco pelo WhatsApp ou email!",
    },
  });
});

export default router;
