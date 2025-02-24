"use client";

import { useState } from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function TestConvexPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Get the mutation and query functions
  const createTestUser = useMutation(api.testData.createTestUser);
  const testUsers = useQuery(api.testData.getTestUsers);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTestUser({ name, email });
      // Clear form after successful creation
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('Failed to create user');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Convex Test Page</h1>
      
      <form onSubmit={handleCreateUser} className="mb-4">
        <div className="mb-2">
          <label className="block mb-1">Name:</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full"
            required 
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Email:</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full"
            required 
          />
        </div>
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Test User
        </button>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Users:</h2>
        {testUsers ? (
          <ul>
            {testUsers.map((user) => (
              <li key={user._id} className="border-b py-2">
                <strong>Name:</strong> {user.name}<br />
                <strong>Email:</strong> {user.email}<br />
                <strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading users...</p>
        )}
      </div>
    </div>
  );
}
