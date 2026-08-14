import { Router } from "express";
import {
  createAddress,
  getAddresses,
  // getAddressById,
  // updateAddress,
  // deleteAddress,
  // setDefaultAddress,
} from "../controllers/addressController";
import { authenticate } from "../middleware/auth";

const router: Router = Router();

router.post("/", authenticate, createAddress);
router.get("/", authenticate, getAddresses);
// router.get("/:id", authenticate, getAddressById);
// router.put("/:id", authenticate, updateAddress);
// router.delete("/:id", authenticate, deleteAddress);
// router.post("/:id/default", authenticate, setDefaultAddress);

export default router;
