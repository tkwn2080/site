import React from 'react';
import { Link } from 'react-router-dom';
import SubstrateDesigner from '../components/SubstrateDesigner';

function SubstrateDesignerPage() {
  return (
    <div className="p-4">
      <Link to="/" className="text-green-500 hover:text-green-700 mb-4 inline-block">
        Home
      </Link>
      <SubstrateDesigner />
    </div>
  );
}

export default SubstrateDesignerPage;