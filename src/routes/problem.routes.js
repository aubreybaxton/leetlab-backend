import express from "express";
import { authMiddleware, checkAdmin } from "../middleware/auth.middleware";
import createProblem from "../controllers/probelm.controller.js";

const problemRoutes= express.Router();

problemRoutes.post("/create-problem", authMiddleware,checkAdmin, createProblem)


export default problemRoutes;