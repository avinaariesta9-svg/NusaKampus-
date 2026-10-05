import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, context } = req.body || {};
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
}
