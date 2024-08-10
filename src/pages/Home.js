import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-10xl text-green-900 mb-8" style={{ fontFamily: 'Times New Roman, serif' }}>تكوين</h1>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link to="/substrate-designer" className="text-xl text-green-700 hover:text-green-500">
              HyperNEAT Substrate Designer
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;