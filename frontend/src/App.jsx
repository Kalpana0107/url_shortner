
import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleShorten() {
    setLoading(true);
    setShortUrl("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/shorten",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      setShortUrl(data.shortUrl);

    } catch (error) {
      alert("Unable to connect to backend");
    } finally {
      setLoading(false);
    }
  }

  const completeShortUrl = `http://localhost:5000/${shortUrl}`;

  function handleCopy() {
    navigator.clipboard.writeText(completeShortUrl);
    alert("URL copied!");
  }

  return (
    <div>
      <h1>URL Shortener</h1>

      <input
        type="text"
        placeholder="Enter your long URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button onClick={handleShorten} disabled={loading}>
        {loading ? "Shortening..." : "Shorten URL"}
      </button>

      {shortUrl && (
        <div>
          <p>Your shortened URL:</p>

          <a
            href={completeShortUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {completeShortUrl}
          </a>

          <button onClick={handleCopy}>
            Copy URL
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
