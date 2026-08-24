import { GoogleGenerativeAI } from '@google/generative-ai';
async function run() { try { const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=AQ.Ab8RN6LWZKC76jUVltdrTuHhLG2gUXVBTttIcQ0invxBWndRzg'); const data = await response.json(); console.log(data.models.map(m => m.name)); } catch (e) { console.error(e); } } run();
