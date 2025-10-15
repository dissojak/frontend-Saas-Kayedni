export async function mockFetch(path: string) {
  // simple placeholder that forwards to next 'actions' or returns an empty placeholder
  // This will be replaced by real API calls later.
  return { path, data: null };
}
