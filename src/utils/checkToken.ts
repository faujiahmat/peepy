import { cookies } from 'next/headers';

export async function checkToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  if (!token) return false;
  return true;
}
