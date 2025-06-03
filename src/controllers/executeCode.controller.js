import { pollBatchResults, submitBatch } from "../libs/languageid.libs.js";


export const executeCode = async (req, res) => {
    const { source_code, language_id, stdin, expected_outputs, problemId } = req.body;
        const userId = req.user.id;
        console.log("body log", { source_code, language_id, stdin, expected_outputs, problemId })
    try {

        // validate the test cases
        if (!Array.isArray(stdin) ||
            stdin.length === 0 ||
            !Array.isArray(expected_outputs) ||
            expected_outputs.length !== stdin.length) {

            return res.status(400).json({ error: "Invalid or Missing test cases" })
        }

        // prepare the batch to judge0
        const submissions = stdin.map((input) => ({
            source_code,
            language_id,
            stdin: input,
            // base64_encoded: false,
            // wait:false
        }))

        // send batch of submission to judge0

        const submitResponse = await submitBatch(submissions)

        const tokens = submitResponse.map((res) => (res.token))

        // pool the Judge0 for the all submitted testcases

        const results = await pollBatchResults(tokens)

        console.log("Restuls-----------------------");
        console.log(results);

        res.status(200).json({ message: "Code Executed" })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Error while execution"
        })
    }
}