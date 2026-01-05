export async function getJwtToken() {
  const res = await fetch('/api/auth/tenant-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tenantId: process.env.NEXT_PUBLIC_TENANT_ID }),
  });

  console.debug('[auth] /api/auth/tenant-login response', {
    ok: res.ok,
    status: res.status,
    statusText: res.statusText,
  });

  if (!res.ok) {
    let bodyText: string | undefined;
    try {
      bodyText = await res.text();
    } catch {
      // ignore
    }
    console.debug('[auth] /api/auth/tenant-login error body', bodyText);
    throw new Error('Failed to get JWT');
  }

  const { access_token } = await res.json();

  return access_token;
}
