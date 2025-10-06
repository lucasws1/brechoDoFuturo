import { Router } from "express";
import {
  createAddress,
  // listAddresses,
  // getAddressById,
  // updateAddress,
  // deleteAddress,
  // setDefaultAddress,
} from "../controllers/addressController";
import { authenticate } from "../middleware/auth";

const router: Router = Router();

router.post("/", authenticate, createAddress);
router.get("/", (_req, res) => {
  res.status(501).json({ message: "Route not implemented" });
});
// router.get("/:id", authenticate, getAddressById);
// router.put("/:id", authenticate, updateAddress);
// router.delete("/:id", authenticate, deleteAddress);
// router.post("/:id/default", authenticate, setDefaultAddress);

export default router;
