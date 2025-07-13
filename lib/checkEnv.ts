export function missingEnvVars(): string[] {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    // Add more required env vars here as needed
  ];
  return required.filter((key) => !process.env[key]);
} 