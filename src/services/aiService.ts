import OpenAI from 'openai';

// Ensure the OpenAI API key is set
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const aiService = {
    /**
     * Generates a structured experiment report based on title, subject, and description.
     */
    async generateReport(title: string, subject?: string, description?: string) {
        const prompt = `
Generate a structured laboratory experiment report.
Title: ${title}
Subject: ${subject || 'General Science'}
Description: ${description || 'Standard laboratory experiment'}

Please provide a JSON response with the following exact keys:
- "title": The title of the experiment
- "aim": The aim or objective
- "apparatus": The apparatus and materials required
- "theory": The theoretical background
- "procedure": Step-by-step procedure
- "result": Expected or simulated results
- "precautions": Necessary precautions to take
- "conclusion": The final conclusion

Ensure the response is valid JSON only.
`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini', // or gpt-3.5-turbo depending on preference
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.7,
        });

        const content = response.choices[0].message.content;
        if (!content) {
            throw new Error('No content received from OpenAI');
        }

        return JSON.parse(content);
    },

    /**
     * Generates Viva questions based on an experiment title.
     */
    async generateVivaQuestions(experimentTitle: string) {
        const prompt = `
Generate 5 common viva (oral examination) questions and their concise answers for a laboratory experiment titled: "${experimentTitle}".

Please provide a JSON response with the following exact structure:
{
  "questions": [
    {
      "question": "Question text here",
      "answer": "Answer text here"
    }
  ]
}

Ensure the response is valid JSON only.
`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.7,
        });

        const content = response.choices[0].message.content;
        if (!content) {
            throw new Error('No content received from OpenAI');
        }

        const parsed = JSON.parse(content);
        return parsed.questions || [];
    }
};
