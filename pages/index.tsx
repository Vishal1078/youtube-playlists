import { useState, useEffect } from 'react';

interface PlaylistItem {
  snippet: {
    title: string;
    resourceId: {
      videoId: string;
    };
  };
}

interface Playlist {
  playlist: string;
  items: PlaylistItem[];
}

const Home = () => {
  const [authUrl, setAuthUrl] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Check for the access token in the URL when the component is mounted
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('access_token');

    // If there's a token, set it and fetch playlists
    if (token) {
      setAccessToken(token);
      fetchPlaylists(token);
    } else {
      fetchAuthUrl();
    }
  }, []);

  // Fetch authentication URL to authenticate with YouTube
  const fetchAuthUrl = async () => {
    try {
      const res = await fetch('/api/auth');
      const data = await res.json();
      setAuthUrl(data.url);
    } catch (error) {
      setError('Failed to fetch authorization URL');
    }
  };

  // Fetch playlists using the access token
  const fetchPlaylists = async (token: string) => {
    try {
      const res = await fetch(`/api/playlists?accessToken=${token}`);
      const data = await res.json();
      setPlaylists(data);
    } catch (error) {
      setError('Failed to fetch playlists');
    }
  };

  return (
    <div className="container">
      <h1 className="header">YouTube Playlists</h1>
      {error && <p className="error">{error}</p>}

      {!accessToken ? (
        <div className="auth-container">
          <p>To view your playlists, please authenticate with YouTube:</p>
          <a href={authUrl} className="auth-button">Authenticate with YouTube</a>
        </div>
      ) : (
        <div className="playlists-container">
          <h2>Playlists</h2>
          {playlists.length === 0 ? (
            <p>No playlists found.</p>
          ) : (
            playlists.map((playlist, index) => (
              <div key={index} className="playlist-card">
                <h3>{playlist.playlist}</h3>
                <ul>
                  {playlist.items.map((item, idx) => (
                    <li key={idx} className="video-item">
                      <a
                        href={`https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="video-link"
                      >
                        {item.snippet.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
      <style jsx>{`
        .container {
          font-family: 'Arial', sans-serif;
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .header {
          text-align: center;
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 20px;
        }

        .auth-container {
          text-align: center;
          margin-top: 50px;
        }

        .auth-button {
          padding: 12px 20px;
          background-color: #ff0000;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-size: 16px;
          display: inline-block;
          margin-top: 10px;
        }

        .auth-button:hover {
          background-color: #d90000;
        }

        .playlists-container {
          margin-top: 30px;
        }

        .playlist-card {
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          padding: 20px;
          margin-bottom: 20px;
          border-radius: 8px;
        }

        .playlist-card h3 {
          margin: 0;
          font-size: 1.5rem;
          color: #444;
        }

        .video-item {
          margin-bottom: 10px;
        }

        .video-link {
          color: #1a73e8;
          text-decoration: none;
        }

        .video-link:hover {
          text-decoration: underline;
        }

        .error {
          color: red;
          text-align: center;
          font-size: 1.2rem;
        }
      `}</style>
    </div>
  );
};

export default Home;
