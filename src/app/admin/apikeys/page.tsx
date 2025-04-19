'use client';

import { useEffect, useState } from 'react';
import { getallkeys, setonekey } from '@/store/apis';

const ApiKeyManagement = () => {
  const [apiKeys, setApiKeys] = useState<{ name: string; value: string; editable?: boolean }[]>([]);

  useEffect(() => {
    const fetchKeys = async () => {
      const keys = await getallkeys();
      console.log('Fetched API keys:', keys);
      const editableKeys = keys.map((k: any) => ({ ...k, editable: false }));
      console.log('Editable API keys:', editableKeys);
      setApiKeys(editableKeys);
    };
    fetchKeys();
  }, []);

  const handleEdit = (index: number) => {
    const newKeys = [...apiKeys];
    newKeys[index].editable = true;
    setApiKeys(newKeys);
  };

  const handleChange = (index: number, newValue: string) => {
    const updated = [...apiKeys];
    updated[index].value = newValue;
    setApiKeys(updated);
  };

  const handleSave = async (index: number) => {
    const key = apiKeys[index];
    await setonekey(key.name, key.value);
    const newKeys = [...apiKeys];
    newKeys[index].editable = false;
    setApiKeys(newKeys);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="h-[64px] flex items-center border-b border-gray-700 mb-6 px-4">
        <h1 className="text-2xl font-semibold">API Key Management</h1>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        {apiKeys.map((key, index) => (
          <div key={key.name} className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-medium">{key.name}</h2>
              {!key.editable ? (
                <button
                  className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
                  onClick={() => handleEdit(index)}
                >
                  Edit
                </button>
              ) : (
                <button
                  className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
                  onClick={() => handleSave(index)}
                >
                  Save
                </button>
              )}
            </div>
            <input
              type="text"
              value={key.value}
              onChange={(e) => handleChange(index, e.target.value)}
              disabled={!key.editable}
              className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiKeyManagement;
