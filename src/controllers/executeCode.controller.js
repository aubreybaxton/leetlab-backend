import { pollBatchResults, submitBatch, getLanguageName } from "../libs/languageid.libs.js";
import {db} from "../libs/db.js"


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

        // details test cases result
        let allPassed = true;
        const detailedResult = results.map((result, i) => {
            const stdout = result.stdout?.trim();
            const expected_output = expected_outputs[i]?.trim();
            const passed = stdout === expected_output;

            
            if (!passed) {
             allPassed = false;
            }
            console.log(`test case : #${i+1}`)
             console.log(` Input test case - #${i+1}: ${stdin[i]}`)
             console.log(`expected output for the test case - #${i+1} : ${expected_output}`)
             console.log(`Actual output for the test case - #${i+1}: ${stdout}`)
             console.log(` Matched test case - #${i+1} : ${passed}`)

            return {
                testCase: i + 1,
                passed,
                stdout,
                expected: expected_output,
                stderr: result.stderr || null,
                compileOutput: result.compile_output,
                status: result.status.description,
                memory: result.memory ? `${result.memory} KB` : undefined,
                time: result.time ? `${result.time} s` : undefined,

            }
             
        })
        console.log("Detailed output", detailedResult)

        const submission = await db.submission.create({
            data: {
                userId,
                problemId,
                sourceCode: source_code,
                language: getLanguageName(language_id),
                stdin: stdin.join("\n"),
                stdout: JSON.stringify(detailedResult.map((r) => r.stdout)),
                stderr: detailedResult.some((r) => r.stderr)
                    ? JSON.stringify(detailedResult.map((r) => r.stderr))
                    : null,
                compileOutput: detailedResult.some((r) => r.compile_output)
                    ? JSON.stringify(detailedResult.map((r) => r.compile_output))
                    : null,
                status: allPassed ? "Accepted" : "Wrong Answer",
                memory: detailedResult.some((r) => r.memory)
                    ? JSON.stringify(detailedResult.map((r) => r.memory))
                    : null,
                time: detailedResult.some((r) => r.time)
                    ? JSON.stringify(detailedResult.map((r) => r.time))
                    : null,
            }

        })

        // If All passed = true mark problem as solved for the current user

        if (allPassed) {
            await db.problemSolved.upsert({
                where: {
                    userId_problemId: {
                        userId,
                        problemId,
                    },
                },
                update: {},
                create: {
                    userId,
                    problemId,
                },
            });
        }

        // now save each tesst cases
        const testCaseResults = detailedResult.map((result) => ({
            submissionId: submission.id,
            testCase: result.testCase,
            passed: result.passed,
            stdout: result.stdout,
            expected: result.expected,
            stderr: result.stderr,
            compileOutput: result.compile_output,
            status: result.status,
            memory: result.memory,
            time: result.time,
          }));
      
          await db.testCasesResult.createMany({
            data: testCaseResults,
          });
      
          const submissionWithTestCase = await db.submission.findUnique({
            where: {
              id: submission.id,
            },
            include: {
              testCases: true,
            },
          });

          res.status(200).json({
            success: true,
            message: "Code Executed! Successfully!",
            submission: submissionWithTestCase,
          });
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Error while execution"
        })
    }
}