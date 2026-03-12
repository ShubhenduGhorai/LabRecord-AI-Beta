import { openaiClient, MAX_TOKENS } from '@/lib/openai';

export const aiService = {
  /**
   * Generates a structured experiment report.
   */
  async generateReport(title: string, subject?: string, description?: string) {
    const prompt = `
Generate a professional, structured laboratory experiment report.
Title: ${title}
Subject: ${subject || 'General Science'}
Context/Observations: ${description || 'Standard laboratory experiment'}

Please provide a JSON response with the following exact keys:
- "aim": Clear objective
- "theory": Scientific background and laws
- "apparatus": List of equipment
- "procedure": Step-by-step instructions
- "observations": What was noticed
- "calculations": Formulas or mock data processing
- "result": Final findings
- "conclusion": Scientific summary
- "precautions": Safety and error mitigation

Ensure the response is valid JSON only.
`;

    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1500, // Increased for full report
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No content received from OpenAI');
    return JSON.parse(content);
  },

  /**
   * Generates Viva questions and answers.
   */
  async generateVivaQuestions(experimentTitle: string, difficulty: string = "Intermediate") {
    const prompt = `
Generate 5 technical viva questions and detailed answers for: "${experimentTitle}" at ${difficulty} level.
Include a mix of:
1. Conceptual theory
2. Mathematical/Calculation based
3. Graph/Data interpretation

Provide a JSON response:
{
  "questions": [
    {
      "question": "...",
      "answer": "...",
      "type": "Conceptual | Calculation | Graph Analysis",
      "explanation": "Brief explanation of why this matters"
    }
  ]
}
`;

    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: MAX_TOKENS,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No content received from OpenAI');
    return JSON.parse(content).questions || [];
  },

  /**
   * Performs statistical analysis on raw data.
   */
  async analyzeData(data: string) {
    const prompt = `
Analyze the following scientific dataset (CSV/Text):
${data}

Calculate:
1. Mean and Standard Deviation
2. Linear Regression (slope, intercept, R-squared)
3. Correlation Coefficient

Provide a JSON response:
{
  "mean": 0,
  "stdDev": 0,
  "regression": { "slope": 0, "intercept": 0, "r2": 0 },
  "correlation": 0,
  "summary": "Brief scientific interpretation of the data trend"
}
`;

    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.3, // Lower temp for math
      max_tokens: MAX_TOKENS,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No content received from OpenAI');
    return JSON.parse(content);
  },

  /**
   * Recommends a graph configuration for a dataset.
   */
  async recommendGraph(data: string) {
    const prompt = `
Based on this dataset, recommend the best scientific visualization:
${data}

Provide a JSON response:
{
  "type": "scatter | line | bar | histogram",
  "xAxis": "Label",
  "yAxis": "Label",
  "title": "Suggested Title",
  "reasoning": "Why this chart type is best"
}
`;

    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: MAX_TOKENS,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No content received from OpenAI');
    return JSON.parse(content);
  },

  /**
   * Formats raw text into a standard research structure.
   */
  async formatResearch(text: string, style: string = "IEEE") {
    const prompt = `
Format the following research text into a structured ${style} layout.
Identify: Abstract, Introduction, Methodology, Results, and Conclusion.

Provide a JSON response:
{
  "abstract": "...",
  "introduction": "...",
  "methodology": "...",
  "results": "...",
  "conclusion": "...",
  "citations": ["Standard formatted citations if found"]
}

Text: ${text}
`;

    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.5,
      max_tokens: 1500,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No content received from OpenAI');
    return JSON.parse(content);
  }
};
