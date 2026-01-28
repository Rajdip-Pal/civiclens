import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface AIAnalysisResult {
    category: string;
    priority: string;
    urgency: number; // 0-10
    summary: string;
    suggestedActions: string[];
}

export const analyzeReportText = async (description: string): Promise<AIAnalysisResult> => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `Analyze this civic issue report and provide a structured response:

Report: "${description}"

Please categorize this issue into ONE of these categories:
- ROAD_DAMAGE (potholes, cracks, damaged roads)
- SANITATION (garbage, cleanliness, waste management)
- STREET_LIGHTS (broken lights, outages)
- WATER_SUPPLY (leaks, water quality, supply issues)
- TRAFFIC (signals, congestion, road safety)
- PUBLIC_SAFETY (hazards, emergencies, safety risks)
- PARKS (maintenance, vandalism, park facilities)
- OTHER (anything else)

Assign a priority level:
- CRITICAL (immediate danger to life/property)
- HIGH (significant impact, needs urgent attention)
- MEDIUM (moderate issue, should be addressed soon)
- LOW (minor inconvenience, low urgency)

Also provide:
- Urgency score (0-10)
- Brief summary (1 sentence)
- 2-3 suggested actions for authorities

Respond in JSON format:
{
  "category": "CATEGORY_NAME",
  "priority": "PRIORITY_LEVEL",
  "urgency": 7,
  "summary": "Brief summary",
  "suggestedActions": ["Action 1", "Action 2"]
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Invalid AI response format');
        }

        const analysis = JSON.parse(jsonMatch[0]);
        return analysis;
    } catch (error) {
        console.error('AI analysis error:', error);
        // Return default values if AI fails
        return {
            category: 'OTHER',
            priority: 'MEDIUM',
            urgency: 5,
            summary: description.substring(0, 100),
            suggestedActions: ['Review the issue', 'Assign to appropriate department'],
        };
    }
};

export const analyzeImage = async (imageBase64: string): Promise<string> => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

        const prompt = `Analyze this civic issue image and describe what you see. Focus on:
- Type of infrastructure problem
- Severity of the issue
- Location context (road, park, building, etc.)
- Any safety hazards visible

Provide a brief, factual description in 2-3 sentences.`;

        const imagePart = {
            inlineData: {
                data: imageBase64.split(',')[1] || imageBase64,
                mimeType: 'image/jpeg',
            },
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Image analysis error:', error);
        return 'Image uploaded successfully';
    }
};

export const detectDuplicates = async (
    newDescription: string,
    existingReports: Array<{ description: string; id: string }>
): Promise<string[]> => {
    try {
        if (existingReports.length === 0) return [];

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `Compare this new report with existing reports and identify potential duplicates:

New Report: "${newDescription}"

Existing Reports:
${existingReports.map((r, i) => `${i + 1}. [ID: ${r.id}] ${r.description}`).join('\n')}

Return ONLY the IDs of reports that describe the SAME issue (same type and likely same location).
Respond with a JSON array of IDs: ["id1", "id2"] or [] if no duplicates found.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) return [];

        const duplicateIds = JSON.parse(jsonMatch[0]);
        return duplicateIds;
    } catch (error) {
        console.error('Duplicate detection error:', error);
        return [];
    }
};
