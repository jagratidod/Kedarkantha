export const env = {
  appName: import.meta.env.VITE_APP_NAME || 'Treki Travels',
  siteUrl: import.meta.env.VITE_SITE_URL || 'http://localhost:5173',
  apiUrl: import.meta.env.VITE_API_URL || '',
  mockDelay: Number(import.meta.env.VITE_MOCK_DELAY ?? 350),
}
