import axios from "axios";

export const getJudge0LanguageId = (language) => {
    const languageMap = {
        "PYTHON": 71,
        "JAVA": 62,
        "JAVASCRIPT": 63,
    }
    return languageMap[language.toUpperCase()]
    //using square bracket because the object keys are in "" format
}

const sleep = (ms) => new Promise((resolve) => setImmediate(resolve, ms))

export const pollBatchResults = async (tokens) => {
    while (true) {
        const { data } = await axios.get(`${process.env.ONLINE_JUDGE0_API_URL}/submissions/batch`, {
            params: {
                tokens:tokens.join(","),
                base64_encoded:false,
            }
        })

        const results = data.submissions;
        //The every() method executes a function for each array element.
        const isAllDone = results.every((res) => res.status.id !== 1 && res.status.id !== 2)

        if (isAllDone) {
            return results
        }
        await sleep(1000)// 1sec 
    }
}

export const submitBatch = async (submissions) => {
    console.log("submissions to be sent", submissions)
    const { data } = await axios.post(`${process.env.ONLINE_JUDGE0_API_URL}/submissions/batch?base64_encoded=false`, { submissions })
    console.log("submit batch log", data);
    return data;
}

export function getLanguageName (languageId){
    const languageName = {
        74: "TypeScript",
        63: "JavaScript",
        71: "Python",
        62: "Java",
    }
    return languageName[languageId] || "Unknown"
}