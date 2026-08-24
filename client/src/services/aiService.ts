import { GoogleGenerativeAI } from '@google/generative-ai';
import type { CurrentWeather, HourlyForecast, WeatherInsight } from '../types/weather';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

export async function generateAIInsights(
  current: CurrentWeather,
  hourly: HourlyForecast[]
): Promise<WeatherInsight | null> {
  if (!genAI) return null;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    // Construct a dense, minimal prompt to save tokens and ensure strict JSON response
    const prompt = `You are an expert meteorologist. I will provide you with the current weather and a 12-hour forecast for a specific location.
    
Location: ${current.city}, ${current.country}
Current: ${current.temperature}°C, ${current.condition.label}, Humidity: ${current.humidity}%, Wind: ${current.windSpeed}km/h
Forecast (Next 12h):
${hourly
  .slice(0, 12)
  .map(
    (h) =>
      `- ${new Date(h.time).getHours()}:00 - ${Math.round(h.temperature)}°C, ${h.condition.label}, Rain Prob: ${h.precipitation}%`
  )
  .join('\n')}

Task: Analyze this data and provide a highly personalized, practical weather briefing.
Return ONLY a raw JSON object with this exact structure (no markdown formatting, no code blocks):
{
  "summary": "A concise 1-2 sentence overview of the current conditions and what to expect today.",
  "details": [
    "Actionable insight 1 (e.g. carry an umbrella later).",
    "Actionable insight 2 (e.g. high UV index, wear sunscreen).",
    "Actionable insight 3 (e.g. temp drops tonight, bring a jacket)."
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Extract JSON block in case the AI added conversational text or markdown
    const match = text.match(/\{[\s\S]*\}/);
    const jsonStr = match ? match[0] : text;
    
    const parsed = JSON.parse(jsonStr) as { summary: string; details: string[] };

    if (!parsed.summary || !Array.isArray(parsed.details)) {
      throw new Error('Invalid JSON structure from AI');
    }

    return {
      summary: parsed.summary,
      details: parsed.details,
      source: 'ai',
    };
  } catch (error) {
    console.error('Failed to generate AI insights:', error);
    return null; // Graceful fallback
  }
}
