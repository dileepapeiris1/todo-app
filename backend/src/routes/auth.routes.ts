// Third-party Libraries
import { Router, type IRouter } from "express";

// Internal Modules
import { googleSignIn } from "@/controllers/auth.controller";

/** Auth routes. */
const router: IRouter = Router();

router.post("/google", googleSignIn);

export default router;
