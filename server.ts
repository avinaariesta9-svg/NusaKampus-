/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API endpoint for NusaAI Gemini chat
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { query, context } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(200).json({ 
          fallback: true, 
          message: 'No GEMINI_API_KEY configured' 
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = `
Kamu adalah NusaAI, asisten pintar resmi kampus untuk aplikasi NusaCampus.
Subjudul: Asisten pintar untuk kebutuhan kampusmu.
Peran pengguna saat ini: ${context?.role || 'Mahasiswa'}.
Nama: ${context?.student?.name || 'Mahasiswa'}.
NIM: ${context?.student?.nim || '-'}.
Prodi: ${context?.student?.major || '-'}.
IPK: ${context?.student?.ipk || 3.86}.
Status UKT: ${context?.student?.uktStatus || 'Lunas'}.

ATURAN PENTING:
1. Jawab secara ringkas, ramah, profesional, dan dalam bahasa Indonesia.
2. Hanya gunakan data resmi yang diizinkan untuk peran ini.
3. JANGAN PERNAH mengarang data yang tidak ada. Jika data tidak ada, katakan "Data [topik] belum tersedia."
4. JANGAN PERNAH membocorkan password, token, API key, credential Firebase, atau data pribadi pengguna lain. Jika diminta data tanpa hak akses, jawab: "Maaf, Anda tidak memiliki akses ke data tersebut."
5. Jika pengguna meminta membuka fitur/halaman (contoh: buka KRS, buka jadwal, buka tugas, buka KTM), sebutkan dengan ramah bahwa Anda membukakannya.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: query,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      const responseText = response.text?.trim() || '';
      return res.json({ text: responseText });
    } catch (err: any) {
      console.error('Error in /api/ai/chat:', err);
      return res.status(200).json({ 
        fallback: true, 
        error: err.message 
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'NusaCampus NusaAI Backend' });
  });

  // In development, mount Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve built static files
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
