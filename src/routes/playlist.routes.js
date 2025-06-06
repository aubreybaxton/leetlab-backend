import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { addProblemToPlaylist, createPlaylist, getAllListDetials, getPlayListDetials, deletePlaylist, deleteProblemFromPlaylist} from "../controllers/playlist.controller.js";

const playlistRoutes= express.Router()


playlistRoutes.get("/", authMiddleware, getAllListDetials);

playlistRoutes.get("/:playlistId", authMiddleware, getPlayListDetials);


playlistRoutes.post("/createplaylist", authMiddleware, createPlaylist);


playlistRoutes.post("/:playlistId/addproblem", authMiddleware, addProblemToPlaylist );


playlistRoutes.delete("/delete/:playlistId", authMiddleware, deletePlaylist)

playlistRoutes.delete("/:playlistId/deleteproblem", authMiddleware, deleteProblemFromPlaylist)

export default playlistRoutes;