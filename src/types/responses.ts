// responses.ts
export interface textResponse {
  text: string;
  sessionId: string;
  images?: string[];
  audio?: Blob; // Add audio property to textResponse
}

export interface Message {
  type: 'inbound' | 'outbound';
  message: string;
  images?: string[];
  audio?: Blob; // Add audio property to Message
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
  proxy?: string;
  theme: 'dark' | 'light';
  sessionid: string;
  images: string[];
  chatHistory: ChatHistory[];
}
// responses.ts
export interface textResponse {
  text: string;
  sessionId: string;
  images?: string[];
  audio?: Blob; // Add audio property to textResponse
}

export interface Message {
  type: 'inbound' | 'outbound';
  message: string;
  images?: string[];
  audio?: Blob; // Add audio property to Message
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
  proxy?: string;
  theme: 'dark' | 'light';
  sessionid: string;
  images: string[];
  chatHistory: ChatHistory[];
}
