import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { accessToken } = req.query;

  if (!accessToken) {
    return res.status(400).json({ error: 'Access token is missing' });
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

  try {
    // Fetch the playlists from the authenticated user's channel
    const playlistsResponse = await youtube.playlists.list({
      part: 'snippet',
      mine: true, // Fetch playlists from the authenticated user's channel
    });

    const playlists = playlistsResponse.data.items;

    if (!playlists) {
      return res.status(404).json({ error: 'No playlists found' });
    }

    // Fetch items (videos) for each playlist
    const playlistItemsPromises = playlists.map(async (playlist) => {
      const itemsResponse = await youtube.playlistItems.list({
        part: 'snippet',
        playlistId: playlist.id!,
      });

      return {
        playlist: playlist.snippet?.title ?? 'Untitled Playlist',
        items: itemsResponse.data.items ?? [],
      };
    });

    const playlistsWithItems = await Promise.all(playlistItemsPromises);

    res.status(200).json(playlistsWithItems);
  } catch (error) {
    console.error('Error fetching playlists or items:', error);
    res.status(500).json({ error: 'Failed to fetch playlists or items' });
  }
}
