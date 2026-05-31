#!/usr/bin/env node
// Generate _KO_FALLBACK entries for a list of Korean words using local Llama.
//
// Usage:
//   node scripts/gen_fallback.js scripts/words.txt
//
// Output: paste-ready JS lines, one per word:
//   '생일': {reading:'saengil', meaning:'birthday'},
//
// Requires: Ollama running (node server.js starts it automatically).

const http = require('http');
const fs   = require('fs');

const OLLAMA_HOST  = '127.0.0.1';
const OLLAMA_PORT  = 11434;
const OLLAMA_MODEL = 'llama3.1:8b';

function ask(word) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: OLLAMA_MODEL,
      stream: false,
      messages: [{
        role: 'user',
        content:
          `Korean word: ${word}\n` +
          `Reply with exactly two lines, nothing else:\n` +
          `ROMAN: <romanization in English letters>\n` +
          `MEANING: <one short English phrase, no articles, no "to" prefix for verbs>`,
      }],
    });

    const req = http.request(
      { host: OLLAMA_HOST, port: OLLAMA_PORT, path: '/api/chat', method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } },
      res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          try {
            const text = JSON.parse(data).message?.content || '';
            const roman   = text.match(/ROMAN:\s*(.+)/)?.[1]?.trim() || '?';
            const meaning = text.match(/MEANING:\s*(.+)/)?.[1]?.trim() || '?';
            resolve({ roman, meaning });
          } catch (e) { reject(e); }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const file = process.argv[2];
  if (!file) { console.error('Usage: node scripts/gen_fallback.js <words.txt>'); process.exit(1); }

  const words = fs.readFileSync(file, 'utf8')
    .split('\n')
    .map(w => w.trim())
    .filter(w => w && !w.startsWith('//'));

  console.log('      // ── auto-generated ────────────────────────────────────────────────');
  for (const word of words) {
    try {
      const { roman, meaning } = await ask(word);
      // Pad the key field to 12 chars for alignment
      const key = `'${word}':`.padEnd(12);
      console.log(`      ${key} {reading:'${roman}', meaning:'${meaning}'},`);
    } catch (e) {
      console.error(`// ERROR: ${word}: ${e.message}`);
    }
  }
}

main();
