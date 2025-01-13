import { google } from 'googleapis';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { channelId } = req.query;
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey || !channelId) {
    return res.status(400).json({ error: 'Missing API key or channelId' });
  }

  const youtube = google.youtube({ version: 'v3', auth: apiKey });

  try {
    // Fetch playlists for a given channel
    const playlistsResponse = await youtube.playlists.list({
      part: 'snippet',
      channelId: channelId as string,
    });

    const playlists = playlistsResponse.data.items;

    // Fetch items (videos) for each playlist
    const playlistItemsPromises = playlists?.map(async (playlist) => {
      if (!playlist?.id) return { playlist: 'Unknown', items: [] };

      const itemsResponse = await youtube.playlistItems.list({
        part: 'snippet',
        playlistId: playlist.id,
      });

      return {
        playlist: playlist.snippet?.title || 'Untitled Playlist',
        items: itemsResponse.data.items || [],
      };
    });

    const playlistsWithItems = await Promise.all(playlistItemsPromises || []);

    res.json(playlistsWithItems);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
}
