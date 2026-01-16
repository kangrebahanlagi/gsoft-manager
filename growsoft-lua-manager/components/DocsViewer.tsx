'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpenIcon,
  DocumentIcon,
  CodeBracketIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon 
} from '@heroicons/react/24/outline';

interface DocsViewerProps {
  docPath: string;
}

interface DocContent {
  title: string;
  content: string;
  lastUpdated: string;
  category: string;
}

export default function DocsViewer({ docPath }: DocsViewerProps) {
  const [doc, setDoc] = useState<DocContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (docPath) {
      fetchDocContent();
    }
  }, [docPath]);

  const fetchDocContent = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/docs?path=${encodeURIComponent(docPath)}`);
      if (!response.ok) {
        throw new Error('Failed to load documentation');
      }
      const data = await response.json();
      setDoc(data);
      
      // Expand all sections by default
      const sections = data.content.match(/^#{2,3}\s+.+$/gm) || [];
      const newExpanded = new Set<string>();
      sections.forEach((section: string) => {
        const title = section.replace(/^#+\s+/, '');
        newExpanded.add(title);
      });
      setExpandedSections(newExpanded);
    } catch (err) {
      setError('Failed to load documentation');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (title: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(title)) {
      newExpanded.delete(title);
    } else {
      newExpanded.add(title);
    }
    setExpandedSections(newExpanded);
  };

  const renderMarkdown = (content: string) => {
    // Simple markdown parser
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeLanguage = '';

    lines.forEach((line, index) => {
      // Code blocks
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.slice(3).trim() || 'lua';
        } else {
          inCodeBlock = false;
          elements.push(
            <pre key={`code-${index}`} className="bg-gray-900 rounded-lg p-4 overflow-x-auto my-4">
              <code className={`language-${codeLanguage} text-sm`}>
                {codeBlockContent.join('\n')}
              </code>
            </pre>
          );
          codeBlockContent = [];
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Headers
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={`h1-${index}`} className="text-3xl font-bold mt-6 mb-4">
            {line.slice(2)}
          </h1>
        );
        return;
      }

      if (line.startsWith('## ')) {
        const title = line.slice(3);
        const isExpanded = expandedSections.has(title);
        elements.push(
          <div key={`h2-${index}`} className="my-4">
            <button
              onClick={() => toggleSection(title)}
              className="flex items-center w-full text-left text-xl font-semibold hover:text-blue-400"
            >
              <span className="mr-2">{isExpanded ? '▼' : '▶'}</span>
              {title}
            </button>
            {!isExpanded && (
              <div className="text-sm text-gray-500 mt-1">
                Click to expand...
              </div>
            )}
          </div>
        );
        return;
      }

      if (line.startsWith('### ')) {
        const title = line.slice(4);
        const isExpanded = expandedSections.has(title);
        elements.push(
          <div key={`h3-${index}`} className="my-3">
            <button
              onClick={() => toggleSection(title)}
              className="flex items-center w-full text-left text-lg font-medium hover:text-blue-400"
            >
              <span className="mr-2 text-xs">{isExpanded ? '▼' : '▶'}</span>
              {title}
            </button>
          </div>
        );
        return;
      }

      // Only show content if parent section is expanded
      const currentSection = getCurrentSection(lines, index);
      if (currentSection && !expandedSections.has(currentSection)) {
        return;
      }

      // Lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li key={`li-${index}`} className="ml-4 mb-1">
            {line.slice(2)}
          </li>
        );
        return;
      }

      // Code inline
      if (line.includes('`')) {
        const parts = line.split('`');
        const processedLine = parts.map((part, i) => {
          if (i % 2 === 1) {
            return <code key={`code-${i}`} className="bg-gray-900 px-1 rounded text-sm">{part}</code>;
          }
          return part;
        });
        elements.push(
          <p key={`p-${index}`} className="my-2">
            {processedLine}
          </p>
        );
        return;
      }

      // Empty line
      if (line.trim() === '') {
        elements.push(<br key={`br-${index}`} />);
        return;
      }

      // Regular text
      elements.push(
        <p key={`p-${index}`} className="my-2 text-gray-300">
          {line}
        </p>
      );
    });

    return elements;
  };

  const getCurrentSection = (lines: string[], index: number): string | null => {
    for (let i = index; i >= 0; i--) {
      if (lines[i].startsWith('## ')) {
        return lines[i].slice(3);
      }
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="card h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="flex items-center space-x-3 text-red-400">
          <ExclamationTriangleIcon className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Error Loading Documentation</h3>
            <p className="text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="card h-64 flex items-center justify-center">
        <div className="text-center">
          <BookOpenIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Documentation</h3>
          <p className="text-gray-400">Select a documentation topic to view</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            {doc.category === 'API' && <CodeBracketIcon className="w-6 h-6 text-blue-400" />}
            {doc.category === 'Tutorials' && <DocumentIcon className="w-6 h-6 text-green-400" />}
            <h1 className="text-2xl font-bold">{doc.title}</h1>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span className="px-2 py-1 bg-gray-700 rounded">{doc.category}</span>
            <span>Last updated: {doc.lastUpdated}</span>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-700 rounded-lg">
          <ArrowDownTrayIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="prose prose-invert max-w-none">
        <div className="border-l-4 border-blue-500 pl-4 mb-6 bg-blue-900/10 p-4 rounded">
          <p className="text-blue-300 font-medium">Growsoft Lua Documentation</p>
          <p className="text-sm text-gray-400">
            This documentation is specific to Growsoft Lua scripting API. Refer to these docs when writing scripts.
          </p>
        </div>

        <div className="docs-content">
          {renderMarkdown(doc.content)}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-700">
        <div className="flex justify-between text-sm text-gray-400">
          <div>
            Source: <a 
              href="https://github.com/kangrebahanlagi/docsToDownload" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              GitHub Repository
            </a>
          </div>
          <div>
            Used by AI Assistant as context
          </div>
        </div>
      </div>
    </div>
  );
}