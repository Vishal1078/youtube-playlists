import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';

// Initialize OAuth2 client using your credentials
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,      // Google Client ID
  process.env.GOOGLE_CLIENT_SECRET,  // Google Client Secret
  `${process.env.NEXTAUTH_URL}/api/auth/callback` // Redirect URI for OAuth2 flow
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Generate the URL for Google OAuth consent screen
    const scopes = ['https://www.googleapis.com/auth/youtube.readonly'];
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });

    // Send the auth URL back to the frontend
    res.status(200).json({ url: authUrl });
  } catch (error) {
    console.error('Error generating OAuth URL:', error);
    res.status(500).json({ error: 'Failed to generate auth URL' });
  }
}
