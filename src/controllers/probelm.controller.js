import { db } from "../libs/db.js"
import { submitBatch } from "../libs/languageid.libs.js";

export const createProblem = async (req, res) => {

  const { title, description, difficulty,
    tags, examples, constraints, testcases, codeSnippets, referenceSolutions
  } = req.body;

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "You are not allowed" })
  }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res.status(400).json({ error: `Language ${language} is not supported` })

      }
      const submissions = testcases.map(({ input, output }) => (
        {
          source_code: solutionCode,
          language_id: languageId,
          stdin: input,
          expected_output: output,
        }
      ))

      const submissionResult = await submitBatch(submissions);

      //get the token after submissions
      const token = submissionResult.map(res => res.token)
      console.log("Submission results token", token)
      // polling now
      const results = await pollBatchResults(token);

      for (i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.status.id !== 3) {
          return res.status(400).json({ error: `Testcase ${i + 1} is failed for the ${language}` })
        }
      }
      //now save the problem to the DB
      const newproblem = await db.problem.create({
        data: {
          title, description, difficulty,
          tags, examples, constraints, testcases, codeSnippets, referenceSolutions
          , userId: req.user.id,
        }
      })

      return res.status(201).json(newproblem)
    }
  } catch (error) {

  }

}

export const getAllProblems = async (req, res) => {

}
export const getProblemById = async (req, res) => {

}
export const updateProblem = async (req, res) => {

}
export const deleteProblem = async (req, res) => {

}
export const getAllProblemSolvedByUser = async (req, res) => {

}