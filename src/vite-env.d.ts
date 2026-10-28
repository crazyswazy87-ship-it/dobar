/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DOBA_WHATSAPP?: string;
  readonly VITE_DOBA_EMAIL?: string;
  readonly VITE_DOBA_INSTAGRAM?: string;
  readonly VITE_DATA_PROVIDER?: 'static' | 'appwrite';
  readonly VITE_APPWRITE_ENDPOINT?: string;
  readonly VITE_APPWRITE_PROJECT_ID?: string;
  readonly VITE_APPWRITE_DATABASE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
