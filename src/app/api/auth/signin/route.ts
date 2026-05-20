import { signIn } from '@logto/next/server-actions';
import { logtoConfig } from '../../../logto';

const parseCsv = (value?: string) =>
  value
    ? value.split(',').map((item) => item.trim()).filter(Boolean)
    : [];

export async function GET() {
  const scopes = parseCsv(process.env.LOGTO_SCOPES) || ['openid'];
  const resources = parseCsv(process.env.LOGTO_RESOURCES);

  await signIn(logtoConfig, {
    redirectUri: `${logtoConfig.baseUrl}/callback`,
    scopes: scopes.length ? scopes : ['openid'],
    resources: resources.length ? resources : undefined,
    includeReservedScopes: false,
  });
}
