import { db } from "../libs/db.js";
import playlistRoutes from "../routes/playlist.routes.js";


export const getAllListDetials= async(req, res)=>{
    try {
        const playlists = await db.playlist.findMany({
            where:{
                userId:req.user.id
            }, include:{
                problems:{
                    include:true
                }
            }
        })

        res.status(200).json({
            success:true,
            message:"Fecting successful",
            playlists
        })
    } catch (error) {
        console.log(" fetching playlist error",error)
        res.status(500).json({error:"error while fetching"})
    }
}

export const getPlayListDetials= async(req, res)=>{
    try {
        const {playlistId}= req.params;
        const playlist = await db.playlist.findUnique({
            where:{
                id: playlistId,
                userId:req.user.id
            }, include:{
                problems:{
                    include:true
                }
            }
        })

        res.status(200).json({
            success:true,
            message:"Fecting Playlist successful",
            playlist
        })
    } catch (error) {
        console.log(" playlist error",error)
        res.status(500).json({error:"error while fetching playlist"})
    }
}

export const createPlaylist= async(req, res)=>{
    try {
         const { name, description}= req.body;
         const userId= req.user.id;

         const createPlaylist= await db.playlist.create({
            data:{
                name,
                description,
                userId
            }
         })

         res.status(201).json({
            success: true,
            message: " Playlist Created Successfully",
            createPlaylist
         })
    } catch (error) {
        console.log(" create playlist error",error)
        res.status(500).json({error:"error while creating"})
    }
}

export const addProblemToPlaylist= async(req, res)=>{
    try {
        
        const {playlistId}= req.params;
        const {problemIds}= req.body;

        if (!Array.isArray(problemIds||problemIds.length===0)) {
            return res.status(404).json({error:"Invalid problem Ids"})
        }

        const problemInPlaylist= await db.problemInPlaylist.createMany({
            data:problemIds.map((problemId)=>({
                playlistId,
                problemId
            }))
        })

        res.status(201).json({
            success: true,
            message: " Problem Added in Playlist Successfully",
            problemInPlaylist
        })
    } catch (error) {
        console.log(" add problem to playlist error",error)
        res.status(500).json({error:"error while add problem to playlist"})
    }
}

export const deletePlaylist= async(req, res)=>{
    try {
        const {playlistId}= req.params;

        const deletePlaylist= await db.playlist.delete({
            where:{
                id:playlistId,
            }
        })

        res.status(200).json({
            success:true,
            message:"Playlist Deleted Successfully",
            deletePlaylist
        })
    } catch (error) {
        console.log(" delete playlist error",error)
        res.status(500).json({error:"error while delete playlist"})
    }
}

export const deleteProblemFromPlaylist= async(req, res)=>{
    try {
        const {playlistId }=req.params;
        const {problemIds }=req.body;
        if (!Array.isArray(problemIds||problemIds.length===0)) {
            return res.status(404).json({error:"Invalid problem Ids"})
        }
        const deleteProblem= await db.problemInPlaylist.deleteMany({
            where:{
                playlistId,
                problemId:{
                    in:problemIds
                }
            }
        })
        res.status(200).json({
            success:true,
            message:"Problen in Playlist Deleted Successfully",
            deleteProblem
        })

    } catch (error) {
        console.log(" delete problem playlist error",error)
        res.status(500).json({error:"error while delete  problem in playlist"})
    }
}