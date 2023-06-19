import React from 'react';
import Link from 'next/link';

const Custom404 = () => {
  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center' }}
    >
      <div>
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link href="/">Go back to the homepage</Link>
      </div>
    </div>
  );
};

export default Custom404;
