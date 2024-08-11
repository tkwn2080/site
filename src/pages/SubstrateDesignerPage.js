import React from 'react';
import { Link } from 'react-router-dom';
import SubstrateDesigner from '../components/SubstrateDesigner';

function SubstrateDesignerPage() {
  return (
    <div className="p-4">
      <Link to="/" className="text-custom-green-700 hover:text-green-700 mb-4 inline-block">
        Back
      </Link>
      <SubstrateDesigner />
    </div>
  );
}

export default SubstrateDesignerPage;