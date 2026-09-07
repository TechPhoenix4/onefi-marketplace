import React from 'react';

interface Props {
  message: string;
  onRetry: () => void;
}

export const ErrorView: React.FC<Props> = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto my-8">
    <p className="text-sm text-red-600 font-semibold mb-3">{message}</p>
    <button onClick={onRetry} className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700">
      Retry
    </button>
  </div>
);