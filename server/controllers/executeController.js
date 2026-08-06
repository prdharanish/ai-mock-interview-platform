const axios = require('axios');

const JUDGE0_URL = 'https://ce.judge0.com';

exports.execute = async (req, res) => {
  const { sourceCode, languageId, stdin = '' } = req.body;

  const headers = {
    'Content-Type': 'application/json'
  };

  try {
    // Step 1: Submit code (wait=false so we can poll)
    const submitRes = await axios.post(
      `${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`,
      { source_code: sourceCode, language_id: languageId, stdin },
      { headers, timeout: 15000 }
    );

    const { token } = submitRes.data;
    if (!token) {
      return res.status(502).json({ error: true, status: { description: 'Error' }, stderr: 'Judge0 did not return a submission token.' });
    }

    // Step 2: Poll until done (max ~22s for community server tolerance)
    for (let i = 0; i < 15; i++) {
      await new Promise((r) => setTimeout(r, 1500));
      const pollRes = await axios.get(
        `${JUDGE0_URL}/submissions/${token}?base64_encoded=false`,
        { headers, timeout: 10000 }
      );
      const data = pollRes.data;
      if (data.status?.id > 2) {
        return res.json(data);
      }
    }

    return res.status(504).json({ error: true, status: { description: 'Timeout' }, stderr: 'Execution timed out — no result after 22 seconds.' });
  } catch (err) {
    const status = err.response?.status;

    if (status === 429) {
      return res.status(429).json({
        error: true,
        status: { description: 'Rate Limited' },
        stderr: 'Judge0 rate limit hit. The public API might be heavily loaded. Please wait a moment before running again.',
      });
    }

    if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
      return res.status(504).json({
        error: true,
        status: { description: 'Timeout' },
        stderr: 'Request to Judge0 timed out. The public service may be temporarily unavailable or overloaded.',
      });
    }

    console.error('Judge0 proxy error:', err.message);
    return res.status(502).json({
      error: true,
      status: { description: 'Error' },
      stderr: `Code execution service error: ${err.message}`,
    });
  }
};
