// src/app/api/instagram-agent/route.ts
import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { influencerName, apiKey } = await request.json();
    const scriptPath = path.join(process.cwd(), 'scripts', 'instagram_agent.py');

    return new Promise((resolve) => {
      const pythonProcess = spawn('python3', [scriptPath, influencerName, apiKey]);
      let dataString = '';
      let errorString = '';

      pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
        // Mantemos o log de erro para debug
        console.error('Python stderr:', data.toString());
      });

      pythonProcess.on('close', (code) => {
        try {
          // Procura pelo último JSON válido na saída
          const jsonMatches = dataString.match(/\{[^]*\}/g);
          if (jsonMatches) {
            const lastJson = jsonMatches[jsonMatches.length - 1];
            const parsedData = JSON.parse(lastJson);
            resolve(NextResponse.json(parsedData));
          } else {
            throw new Error('No valid JSON found in output');
          }
        } catch (error) {
          console.error('Parse error:', error);
          console.error('Raw output:', dataString);
          console.error('Error output:', errorString);

          // Retorna o que o script Python retornou, mesmo que com erro
          try {
            // Tenta extrair o JSON da mensagem de erro, que pode conter o response default
            const jsonMatch = errorString.match(/\{[^]*\}/);
            if (jsonMatch) {
              const parsedError = JSON.parse(jsonMatch[0]);
              resolve(NextResponse.json(parsedError));
              return;
            }
          } catch {
            // Se não conseguir extrair JSON do erro, usa o default
            resolve(NextResponse.json({
              name: influencerName,
              username: influencerName,
              bio: "Profile information not available",
              followers: "N/A",
              role: "Digital Influencer",
              posts: 0,
              profilePicture: "https://via.placeholder.com/150",
              website: null,
              error: "Failed to parse Instagram data"
            }));
          }
        }
      });
    });
  } catch (error) {
    console.error('Route error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}