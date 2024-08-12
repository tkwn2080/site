import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-8xl leading-none text-custom-green-700 mb-8" style={{ fontFamily: 'Times New Roman, serif' }}>b's page</h1>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link to="/substrate-designer" className="text-lg text-custom-green-500 hover:custom-green-900">
              HyperNEAT Substrate Designer
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;