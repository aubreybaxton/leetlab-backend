export const getJudge0LanguageId=(language)=>{
    const languageMap= {
        "PYTHON": 71,
        "JAVA":62,
        "JAVASCRIPT":63,
    }
    return languageMap[language.toUpperCase()]
    //using square bracket because the object keys are in "" format
}

export const submitBatch= async (submissions) => {
    const {data} =await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,{submissions})
}