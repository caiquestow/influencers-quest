// src/app/api/instagram-agent/route.ts
import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: Request): Promise<Response> {
  try {
    const { influencerName, apiKey } = await request.json();
    const scriptPath = path.join(process.cwd(), 'scripts', 'instagram_agent.py');

    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python3', [scriptPath, influencerName, apiKey]);
      let dataString = '';
      let errorString = '';

      pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
        console.error('Python stderr:', data.toString());
      });

      pythonProcess.on('close', () => {
        try {
          const jsonMatches = dataString.match(/\{[^]*\}/g);
          if (jsonMatches) {
            const lastJson = jsonMatches[jsonMatches.length - 1];
            const parsedData = JSON.parse(lastJson);
            resolve(NextResponse.json(parsedData));
          } else {
            reject(
              NextResponse.json(
                { error: 'No valid JSON found in output', details: errorString },
                { status: 500 }
              )
            );
          }
        } catch (error) {
          console.error('Parse error:', error);
          console.error('Raw output:', dataString);
          console.error('Error output:', errorString);

          reject(
            NextResponse.json(
              {
                name: influencerName,
                username: influencerName,
                bio: 'Profile information not available',
                followers: 'N/A',
                role: 'Digital Influencer',
                posts: 0,
                profilePicture: 'https://via.placeholder.com/150',
                website: null,
                error: 'Failed to parse Instagram data',
              },
              { status: 500 }
            )
          );
        }
      });
    });
  } catch (error) {
    console.error('Route error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
