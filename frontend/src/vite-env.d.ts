/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_ENV: string
  readonly VITE_ENABLE_REAL_TIME_EVALUATION: string
  readonly VITE_ENABLE_ADAPTIVE_TESTS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
