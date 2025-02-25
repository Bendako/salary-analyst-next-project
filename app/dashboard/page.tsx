'use client';

import React from 'react';
import { motion } from 'framer-motion';

import { Card, CardContent } from "@/components/ui/card";
import AddShiftWorkForm from '@/components/add-shift-form';


const DashboardPage = () => {


  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 md:py-16"
    >      
      <div className="w-full">
        <Card className="bg-transparent border-none shadow-none max-w-sm mx-auto">
          <CardContent className="p-2">
            <AddShiftWorkForm />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default DashboardPage;