import {db} from "../libs/db.js"

export const getAllSubmission= async(req, res)=>{
    try {
         const userId= req.user.id;
         const userSubmission= await db.submission.findMany({
            where:{
                userId: userId
            }
         })

         res.status(200).json({
            success:true,
            message:"Submissions fetched successfully",
            userSubmission
        })
    } catch (error) {
        console.error(" Submissions Error while fetching :-", error);
        res.status(500).json({ error: "Failed to fetch submissions" });
        
    }
}
export const getSubmissionByProblem= async(req, res)=>{
    try {
        const userId= req.user.id;
        const problemId= req.params.problemId;
        const submissionbyProblem= await db.submission.findMany({
            where:{
                userId:userId,
                problemId:problemId
            }
        })

        res.status(200).json({
            success:true,
            message:"Fetched the Submission By Problem ID",
            submissionbyProblem
        })
    } catch (error) {
        console.error(" Submissions Error while fetching :-", error);
        res.status(500).json({ error: "Failed to fetch submissions by Problem" });
    }
}
export const getSubmissionCount= async(req, res)=>{

    try {
        const problemId= req.params.problemId;
        const submissionCount= await db.submission.count({
            where:{
                problemId:problemId
            }
        }) 

        res.status(200).json({
            success: true,
            message: "Submission fetch successfully",
            submissionCount
        })
    } catch (error) {
        console.error(" Submissions Error while fetching :-", error);
        res.status(500).json({ error: "Failed to fetch submissions by Problem" });
    }
}