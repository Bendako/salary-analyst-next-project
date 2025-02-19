'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ChartsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-16"
    >
      <h1 className="text-3xl font-bold mb-6">Charts and Analysis</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-gray-600 dark:text-gray-300">
          Visualize and analyze your salary and financial data.
        </p>
      </div>
    </motion.div>
  );
}
