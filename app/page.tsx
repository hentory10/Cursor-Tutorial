import React from 'react';
import Link from 'next/link';
import { content } from '../content';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-4">{content.landing.headline}</h1>
      <p className="mb-8 text-lg text-center max-w-xl">{content.landing.subheadline}</p>
      <Link
        href="/checkout/1-package"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label={content.landing.cta}
      >
        {content.landing.cta}
      </Link>
      <div className="mt-8 text-sm text-gray-500">{content.landing.reassurance}</div>
    </main>
  );
} 