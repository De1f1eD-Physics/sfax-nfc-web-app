/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SOME_KEY: string;
    // Add other environment variables here as needed.  For example:
    // readonly VITE_API_BASE_URL: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }