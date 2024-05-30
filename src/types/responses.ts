export interface textResponse {
    text: string
    sessionId: string 
    images?: string[];
    }

  export interface Message {
    type: 'inbound' | 'outbound'
    message: string
    images?: string[];
    timestamp: string
  }

  export interface UserState {
    name: string
    API_KEY: string
    conversation: {
      loading: boolean
      error?: string
      data?: Message[]
    },
    proxy?: string
    theme: 'dark' | 'light'
    sessionid: string
    images: string[] // Move images to the UserState object
  }