import { NextResponse } from 'next/server';
import manifest from '../../../../public/.well-known/farcaster.json';

export async function GET() {
  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}