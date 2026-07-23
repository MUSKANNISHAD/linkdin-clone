import { Router } from "express";
import { activeCheck } from "../controller/post.controller.js";

const router=Router();

router.route("/").get(activeCheck);

export  default router;