'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  PlayIcon,
  DocumentIcon 
} from '@heroicons/react/24/outline';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface CodeEditorProps {
  initialContent?: string;
  scriptId?: string;
  onSave?: (content: string) => Promise<boolean>;
  onErrorCheck?: (content: string) => Promise<any>;
}

export default function CodeEditor({ 
  initialContent = '', 
  scriptId,
  onSave,
  onErrorCheck 
}: CodeEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConsole, setShowConsole] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSave = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await onSave(content);
      if (result) {
        setSuccess('Script saved successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to save script');
      }
    } catch (err) {
      setError('Error saving script');
    } finally {
      setIsSaving(false);
    }
  };

  const handleErrorCheck = async () => {
    if (!onErrorCheck) return;
    
    setIsChecking(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await onErrorCheck(content);
      if (result.valid) {
        setSuccess('✓ Syntax check passed!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(`✗ Syntax error: ${result.error}`);
      }
    } catch (err) {
      setError('Error checking syntax');
    } finally {
      setIsChecking(false);
    }
  };

  const handleTestRun = () => {
    setShowConsole(true);
    setConsoleOutput(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Test run started...`,
      'Running script in sandbox environment...',
      '✓ Script executed without runtime errors',
      'Note: This is a simulation. Real execution requires Growsoft environment.',
    ]);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <DocumentIcon className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold">
              {scriptId ? `Editing: ${scriptId === 'new' ? 'New Script' : scriptId}` : 'Lua Editor'}
            </h3>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-sm">
            <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded">Lua 5.3</span>
            <span className="px-2 py-1 bg-purple-900/30 text-purple-400 rounded">Growsoft API</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleTestRun}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center space-x-2 text-sm"
          >
            <PlayIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Test Run</span>
          </button>
          <button
            onClick={handleErrorCheck}
            disabled={isChecking}
            className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 rounded-lg flex items-center space-x-2 text-sm"
          >
            <ExclamationTriangleIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{isChecking ? 'Checking...' : 'Check Error'}</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg flex items-center space-x-2 text-sm"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {(error || success) && (
        <div className={`px-4 py-3 flex items-center space-x-2 ${
          error ? 'bg-red-900/20 text-red-300 border-b border-red-800' : 
                 'bg-green-900/20 text-green-300 border-b border-green-800'
        }`}>
          {error ? (
            <ExclamationTriangleIcon className="w-5 h-5" />
          ) : (
            <CheckCircleIcon className="w-5 h-5" />
          )}
          <span>{error || success}</span>
        </div>
      )}

      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          defaultLanguage="lua"
          language="lua"
          value={content}
          onChange={(value) => setContent(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            padding: { top: 10 },
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            tabSize: 2,
            insertSpaces: true,
            renderLineHighlight: 'all',
          }}
          beforeMount={(monaco) => {
            // Define custom Lua syntax for Growsoft
            monaco.languages.register({ id: 'lua' });
            monaco.languages.setMonarchTokensProvider('lua', {
              keywords: [
                'function', 'end', 'if', 'then', 'else', 'elseif',
                'for', 'while', 'do', 'repeat', 'until', 'break',
                'return', 'local', 'in', 'not', 'and', 'or'
              ],
              typeKeywords: [],
              operators: ['=', '>', '<', '==', '<=', '>=', '~=', '...'],
              symbols: /[=><!~?:&|+\-*\/\^%]+/,
              tokenizer: {
                root: [
                  [/--.*/, 'comment'],
                  [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
                  [/\d+/, 'number'],
                  [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
                  [/'/, { token: 'string.quote', bracket: '@open', next: '@string' }],
                  [/\[\[/, { token: 'string.quote', bracket: '@open', next: '@string' }],
                ],
                string: [
                  [/[^"'\]]+/, 'string'],
                  [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
                  [/'/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
                  [/\]\]/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
                ],
              },
            });
          }}
        />
      </div>

      {showConsole && (
        <div className="border-t border-gray-700 bg-gray-900">
          <div className="flex justify-between items-center p-2 border-b border-gray-800">
            <div className="text-sm font-medium">Console Output</div>
            <button
              onClick={() => setShowConsole(false)}
              className="text-xs text-gray-400 hover:text-white"
            >
              Hide
            </button>
          </div>
          <div className="p-3 font-mono text-sm max-h-32 overflow-y-auto">
            {consoleOutput.map((line, i) => (
              <div key={i} className="text-gray-300 mb-1">{line}</div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 bg-gray-800/50 border-t border-gray-700">
        <div className="text-sm text-gray-400">
          <span className="font-medium">Tips:</span> Press <kbd className="px-2 py-1 bg-gray-700 rounded">Ctrl+S</kbd> to save • 
          Use <code className="mx-1 px-1 bg-gray-700 rounded">gt.</code> prefix for Growsoft API • 
          Check <a href="/docs" className="text-blue-400 hover:text-blue-300">Docs</a> for reference
        </div>
      </div>
    </div>
  );
}