const axios = require('axios');

const generateFeedback = async (question, userAnswer, codeSnippet) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  
  const prompt = `
    You are an expert technical interviewer. Evaluate the following candidate answer.
    Question: ${question.content}
    Candidate Answer: ${userAnswer}
    ${codeSnippet ? `Code Snippet: ${codeSnippet}` : ''}
    
    Provide structured JSON feedback with the following schema:
    {
      "score": <number between 0 and 10>,
      "strengths": ["list of strengths"],
      "weaknesses": ["list of areas to improve"],
      "correctAnswer": "a brief description of the ideal answer"
    }
    
    Respond ONLY with the JSON object.
  `;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${process.env.LLM_MODEL || 'gemini-3.5-flash'}:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 seconds timeout
      }
    );

    let textResponse = response.data.candidates[0].content.parts[0].text;
    
    // Clean up potential markdown formatting in JSON response
    textResponse = textResponse.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    
    return JSON.parse(textResponse);
  } catch (error) {
    const isTimeout = error.code === 'ECONNABORTED';
    const status = error.response?.status || 'No status';
    const errorData = error.response?.data || error.message;
    
    console.error("=== GEMINI API FAILURE ===");
    console.error("URL Hit:", `https://generativelanguage.googleapis.com/v1beta/models/${process.env.LLM_MODEL || 'gemini-3.5-flash'}:generateContent?key=...`);
    console.error("API Key configured?", !!GEMINI_API_KEY, "Length:", GEMINI_API_KEY?.length);
    console.error("Is Timeout?", isTimeout);
    console.error("Response Status:", status);
    console.error("Detailed Error Response:", JSON.stringify(errorData, null, 2));
    console.error("==========================");
    
    // Return a graceful fallback instead of crashing
    return {
      score: 0,
      strengths: [],
      weaknesses: ["Error: Could not generate feedback due to API failure or timeout."],
      correctAnswer: "Please try again later. The LLM service is currently unavailable."
    };
  }
};

module.exports = { generateFeedback };
