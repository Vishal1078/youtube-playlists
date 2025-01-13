import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';

// Initialize OAuth2 client using your credentials
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/auth/callback` // Redirect URI for OAuth2 flow
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is missing' });
  }

  try {
    // Exchange the authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    // Send access token as query param in the redirect URL
    res.redirect(`${process.env.NEXTAUTH_URL}?access_token=${tokens.access_token}`);
  } catch (error) {
    console.error('Error during OAuth token exchange:', error);
    res.status(500).json({ error: 'Failed to exchange authorization code for token' });
  }
}
