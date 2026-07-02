import { GoogleGenerativeAI } from '@google/generative-ai';
import { searchSimilar } from './src/lib/ai/vectorStore';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

async function run() {
  try {
    const results = await searchSimilar('Kenya tours', 2);
    console.log('Search results length:', results.length);
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    const chat = model.startChat({ history: [] });
    console.log('Starting stream...');
    const result = await chat.sendMessageStream('Hi');
    for await (const chunk of result.stream) {
      process.stdout.write(chunk.text());
    }
    console.log('\nDone');
  } catch(e) {
    console.error('CHAT ERROR:', e);
  }
}
run();
