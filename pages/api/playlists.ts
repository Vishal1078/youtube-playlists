import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const youtube = google.youtube('v3');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session?.accessToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const youtubeApi = google.youtube({
    version: 'v3',
    auth: session.accessToken,
  });

  try {
    // Fetch playlists from the authenticated user's YouTube account
    const playlistsResponse = await youtubeApi.playlists.list({
      part: 'snippet',
      mine: true, // Use `mine: true` to get playlists from the authenticated user's account
    });

    const playlists = playlistsResponse.data.items;

    // Fetch playlist items (videos) for each playlist
    const playlistItemsPromises = playlists?.map(async (playlist) => {
      const itemsResponse = await youtubeApi.playlistItems.list({
        part: 'snippet',
        playlistId: playlist.id!,
      });

      return {
        playlist: playlist.snippet?.title!,
        items: itemsResponse.data.items!,
      };
    });

    const playlistsWithItems = await Promise.all(playlistItemsPromises || []);

    res.json(playlistsWithItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
