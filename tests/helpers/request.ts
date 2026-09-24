import { NextRequest } from 'next/server';

export function createJsonRequest(url: string, body: object, method = 'POST') {
  return new NextRequest(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
