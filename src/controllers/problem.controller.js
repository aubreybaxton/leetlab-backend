import axios from "axios"
import { db } from "../libs/db.js"
import { getJudge0LanguageId } from "../libs/languageid.libs.js";
import { submitBatch, pollBatchResults } from "../libs/languageid.libs.js";

export const createProblem = async (req, res) => {

  const { title, description, difficulty,
    tags, examples, constraints, testcases, codeSnippets, referenceSolutions,hints, editorial
  } = req.body;
  console.log("problem create", req.body.title)

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "You are not allowed" })
  }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);
      console.log("language id, solutionCode ", languageId, solutionCode)
      if (!languageId) {
        return res.status(400).json({ error: `Language ${language} is not supported` })

      }
      const submissions = testcases.map(({ input, output }) => (
        console.log("language id, solutionCode ", languageId, solutionCode, input, output),
        {
          source_code: solutionCode,
          language_id: languageId,
          stdin: input,
          expected_output: output,
        }

      ))
      console.log("Sending to Judge0:", {
        source_code: req.body.referenceSolutions["JAVASCRIPT"],
        language_id: 63,
        stdin: "100 200",
        expected_output: "300\n"
      });

      const submissionResult = await submitBatch(submissions);
      console.log("Submission results ", submissionResult)
      //get the token after submissions
      const token = submissionResult.map(res => res.token)
      console.log("Submission results token", token)
      // polling now
      const results = await pollBatchResults(token);

      for (let i = 0; i < results.length; i++) {
        console.log("result ----------", results)
        const result = results[i];

        console.log(
          `Testcase ${i + 1} and Language ${language} ----- result ${JSON.stringify(result.status.description)}`
        );
        if (result.status.id !== 3) {
          return res.status(400).json({ error: `Testcase ${i + 1} is failed for the ${language}` })
        }
      }

      //now save the problem to the DB
      const newproblem = await db.problem.create({
        data: {
          title, description, difficulty,
          tags, examples, constraints, testcases, codeSnippets, referenceSolutions,hints,editorial
          , userId: req.user.id,
        }
      })

      return res.status(201).json({
        success: true,
        message: "Problem created Succesfully",
        problem: newproblem,
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: "Error while creating problem"
    })
  }

}

export const getAllProblems = async (req, res) => {
  try {
    const getProblems = await db.problem.findMany(
      {
        include:{
          solvedBy:{
            where:{
              userId:req.user.id
            }
          }
        }
      }
    )
    //console.log(getProblems)

    if (!getProblems) {
      return res.status(404).json(
        {
          error: "No problem found"
        }
      )
    }
    return res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      getProblems,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: "Error while fetching problem"
    })
  }
}

export const getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    const findById = await db.problem.findUnique({
      where: {
        id
      }
    })
    if (!findById) {
      return res.status(404).json({
        error: "Problem not found"
      })
    }
    return res.status(200).json({
      success: true,
      message: " Problem Fetched successfully",
      findById
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: "Error while fetching problem by Id"
    })
  }
}

export const updateProblem = async (req, res) => {
  const { id } = req.params;
  if (!id && id === null) {
    return res.status(400).json({ error: "Id not found" })
  }


  const { title, description, difficulty,
    tags, examples, constraints, testcases, codeSnippets, referenceSolutions
  } = req.body;
  console.log("problem create", req.body.title)

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "You are not allowed" })
  }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);
      console.log("language id, solutionCode ", languageId, solutionCode)
      if (!languageId) {
        return res.status(400).json({ error: `Language ${language} is not supported` })

      }
      const submissions = testcases.map(({ input, output }) => (
        console.log("language id, solutionCode ", languageId, solutionCode, input, output),
        {
          source_code: solutionCode,
          language_id: languageId,
          stdin: input,
          expected_output: output,
        }

      ))
      console.log("Sending to Judge0:", {
        source_code: req.body.referenceSolutions["JAVASCRIPT"],
        language_id: 63,
        stdin: "100 200",
        expected_output: "300\n"
      });

      const submissionResult = await submitBatch(submissions);
      console.log("Submission results ", submissionResult)
      //get the token after submissions
      const token = submissionResult.map(res => res.token)
      console.log("Submission results token", token)
      // polling now
      const results = await pollBatchResults(token);

      for (let i = 0; i < results.length; i++) {
        console.log("result ----------", results)
        const result = results[i];

        console.log(
          `Testcase ${i + 1} and Language ${language} ----- result ${JSON.stringify(result.status.description)}`
        );
        if (result.status.id !== 3) {
          return res.status(400).json({ error: `Testcase ${i + 1} is failed for the ${language}` })
        }
      }

      //now save the problem to the DB
      const updateproblem = await db.problem.update({
        where: {
          id
        },
        data: {
          title, description, difficulty,
          tags, examples, constraints, testcases, codeSnippets, referenceSolutions
          , userId: req.user.id,
        }
      })

      return res.status(201).json({
        success: true,
        message: "Problem updated Succesfully",
        problem: updateproblem,
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: "Error while creating problem"
    })
  }
}

export const deleteProblem = async (req, res) => {
    const {id}= req.params;
    console.log(id)
    try {
       const deleteProblem = await db.problem.delete({
        where:{id}
       })

       if(!id){
        return res.status(404).json({error:"Problem not found"})
       }

       return res.status(200).json({
        success: true,
        message: " Problem Deleted successfully"
        
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        error: "Error while delete"
      })
    }

}
 export const getAllProblemSolvedByUser = async (req, res) => {
     const getUserId= req.user.id;
     //console.log(getUserId)

     try {
      const problems = await db.problem.findMany({
        where:{
          solvedBy:{
            some:{
              userId:getUserId
            }
          }
        },
        include:{
          solvedBy:{
            where:{
              userId:getUserId
            }
          }
        }
      })
      res.status(200).json({
        success:true,
        message:"Problem Fetched Successfully",
        problems
      })
     } catch (error) {
      console.log(error)
      return res.status(500).json({
        error: "Error while fetching Problem"
      })
     }
 }