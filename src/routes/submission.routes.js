import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getAllSubmission , getSubmissionByProblem, getSubmissionCount} from "../controllers/submission.controller.js";


const submissionRoutes= express.Router();

submissionRoutes.get('/get-all-submission', authMiddleware, getAllSubmission)

submissionRoutes.get('/get-submission/:problemId', authMiddleware, getSubmissionByProblem)

submissionRoutes.get('/get-submission-count/:problemId', authMiddleware, getSubmissionCount)


export default submissionRoutes;
