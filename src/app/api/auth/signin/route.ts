import { signIn } from '@logto/next/server-actions';
import { logtoConfig } from '../../../logto';

const parseCsv = (value?: string) =>
  value
    ? value.split(',').map((item) => item.trim()).filter(Boolean)
    : [];

export async function GET() {
  // Use the redirectUri overload to match the library types
  // scopes/resources are handled by Logto defaults or client configuration
  await signIn(logtoConfig, `${logtoConfig.baseUrl}/callback`);
}
