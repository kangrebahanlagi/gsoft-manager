'use client';

import { useState, useEffect } from 'react';
import DocsViewer from '@/components/DocsViewer';
import { 
  MagnifyingGlassIcon,
  BookOpenIcon,
  DocumentTextIcon,
  CodeBracketIcon 
} from '@heroicons/react/24/outline';

interface DocItem {
  id: string;
  title: string;
  description: string;
  category: string;
  path: string;
}

export default function DocsPage() {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<DocItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDocsIndex();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = docs.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDocs(filtered);
    } else {
      setFilteredDocs(docs);
    }
  }, [docs, searchTerm]);

  const fetchDocsIndex = async () => {
    try {
      const response = await fetch('/api/docs');
      const data = await response.json();
      setDocs(data.docs || []);
      setFilteredDocs(data.docs || []);
      if (data.docs?.length > 0) {
        setSelectedDoc(data.docs[0].path);
      }
    } catch (error) {
      console.error('Failed to fetch docs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['API', 'Events', 'Packets', 'Hooks', 'Tutorials', 'Reference'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Documentation</h1>
          <p className="text-gray-400">Growsoft Lua API reference and guides</p>
        </div>
        <div className="text-sm px-3 py-1 bg-blue-900/30 border border-blue-700 rounded-full">
          Source: GitHub
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSearchTerm(category)}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
              >
                {category}
              </button>
            ))}
          </div>

          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <BookOpenIcon className="w-5 h-5 mr-2" />
              Documentation
            </h3>
            <div className="space-y-1">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-8 bg-gray-700/50 rounded animate-pulse"></div>
                ))
              ) : (
                filteredDocs.map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc.path)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2 ${
                      selectedDoc === doc.path
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-700'
                    }`}
                  >
                    {doc.category === 'API' && <CodeBracketIcon className="w-4 h-4" />}
                    {doc.category === 'Tutorials' && <DocumentTextIcon className="w-4 h-4" />}
                    <span className="truncate">{doc.title}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {selectedDoc ? (
            <DocsViewer docPath={selectedDoc} />
          ) : (
            <div className="card h-64 flex items-center justify-center">
              <div className="text-center">
                <BookOpenIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a Document</h3>
                <p className="text-gray-400">Choose a documentation topic from the list</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}