import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { addProblemToPlaylist, createPlaylist, getPlaylist, getPlayListDetials, deletePlaylist, deleteProblemFromPlaylist} from "../controllers/playlist.controller.js";

const playlistRoutes= express.Router()


playlistRoutes.get("/getplaylist", authMiddleware, getPlaylist);

playlistRoutes.get("/:playlistId", authMiddleware, getPlayListDetials);


playlistRoutes.post("/createplaylist", authMiddleware, createPlaylist);


playlistRoutes.post("/:problemId/addtoplaylist", authMiddleware, addProblemToPlaylist );


playlistRoutes.delete("/delete/:playlistId", authMiddleware, deletePlaylist)

playlistRoutes.delete("/:playlistId/deleteproblem", authMiddleware, deleteProblemFromPlaylist)

export default playlistRoutes;