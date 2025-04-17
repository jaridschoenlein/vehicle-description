'use client';

import { useState, FormEvent } from 'react';

export default function VehicleForm() {
  const [year, setYear] = useState<string>('');
  const [make, setMake] = useState<string>('');
  const [vehiclemodel, setModel] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/getVehicleDescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, make, vehiclemodel })
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data: { description: string } = await res.json();
      setDescription(data.description);
    } catch (err: unknown | any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-400 m-auto">
      <form onSubmit={handleSubmit} className="space-y-2">
        <input 
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Year"
          className="border p-2 rounded w-full"
          required
        />
        <input 
          value={make}
          onChange={(e) => setMake(e.target.value)}
          placeholder="Make"
          className="border p-2 rounded w-full"
          required
        />
        <input 
          value={vehiclemodel}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Model"
          className="border p-2 rounded w-full"
          required
        />
        <button 
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Get Description'}
        </button>
      </form>

      {error && <p className="text-red-600 mt-2">{error}</p>}
      {description && <p className="text-stone-950 mt-4 p-2 bg-gray-100 rounded">{description}</p>}
    </div>
  );
}