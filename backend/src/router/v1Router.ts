import { Router } from "express";

const router = Router();

router.use(
  "/algo",
  // #swagger.tags = ['dispositivo']
  algoRouter
);


export default router;
