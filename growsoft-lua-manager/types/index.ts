export interface Script {
  id: string;
  name: string;
  content: string;
  status: 'valid' | 'error';
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'developer' | 'user';
  createdAt: Date;
}

export interface DocItem {
  id: string;
  title: string;
  description: string;
  category: string;
  path: string;
}

export interface DocContent {
  title: string;
  content: string;
  lastUpdated: string;
  category: string;
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface DashboardStats {
  totalScripts: number;
  validScripts: number;
  errorScripts: number;
  recentScripts: Script[];
  activeUsers?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LuaSyntaxCheck {
  valid: boolean;
  error?: string;
  warnings: string[];
}

export interface GitHubDoc {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content?: string;
  encoding?: string;
}