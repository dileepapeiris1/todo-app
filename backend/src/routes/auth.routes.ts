// Third-party Libraries
import { Router } from "express";

// Internal Modules
import { googleSignIn } from "@/controllers/auth.controller";

/** Auth routes. */
const router = Router();

router.post("/google", googleSignIn);

export default router;
