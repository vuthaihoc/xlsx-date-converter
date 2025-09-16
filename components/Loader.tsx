
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div
      className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-primary dark:border-brand-secondary"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loader;
