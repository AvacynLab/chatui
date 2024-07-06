export interface textResponse {
  text: string;
  sessionId: string;
  images?: string[];
  audio?: Blob;
  search?: Search;
}

export interface Search {
  id: string;
  title: string;
  datablock: { h1: string; h2: string[]; p: string[] }[];
  timestamp: string;
  sources: string[];
  questions: string[];
  from: string;
}

export interface Message {
  type: 'inbound' | 'outbound';
  message: string;
  images?: string[];
  audio?: Blob;
  search?: Search;
  timestamp: string;
}

export interface ChatHistory {
  sessionid: string;
  conversation: Message[];
}

export interface UserState {
  name: string;
  API_KEY: string;
  conversation: {
    loading: boolean;
    error?: string;
    data: Message[];
  };
  searches: Search[];
  proxy?: string;
  theme: 'dark' | 'light';
  sessionid: string;
  images: string[];
  chatHistory: ChatHistory[];
}
