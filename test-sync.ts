import { syncAllKnowledge } from './src/lib/ai/knowledgeSync';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  console.log('Running sync...');
  const result = await syncAllKnowledge();
  console.log(JSON.stringify(result, null, 2));
}
run().catch(console.error);
