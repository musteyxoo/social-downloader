import { useMemo, useState } from 'react'
import './App.css'

const API_ENDPOINT = '/.netlify/functions/cobalt'

function App() {
  const [urlInput, setUrlInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [downloads, setDownloads] = useState([])

  const isValidUrl = useMemo(() => {
    if (!urlInput.trim()) return false
    try {
      const parsedUrl = new URL(urlInput)
      return ['http:', 'https:'].includes(parsedUrl.protocol)
    } catch {
      return false
    }
  }, [urlInput])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setDownloads([])

    if (!isValidUrl) {
      setErrorMessage('Enter a valid Instagram, TikTok, or X link.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: urlInput.trim(),
          vCodec: 'h264',
          vQuality: 'max',
          filenameStyle: 'classic',
          audioFormat: 'best',
        }),
      })

      const data = await response.json()

      if (!response.ok || data.status === 'error') {
        throw new Error(data.text || 'Unable to fetch media for this link.')
      }

      const resolvedUrls = Array.isArray(data.url) ? data.url : [data.url]
      const entries = resolvedUrls
        .filter(Boolean)
        .map((mediaUrl, index) => ({
          id: `${Date.now()}-${index}`,
          url: mediaUrl,
        }))

      if (!entries.length) {
        throw new Error('No downloadable media found for this link.')
      }

      setDownloads(entries)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="badge">All-in-one downloader</div>
        <h1>Social Downloader</h1>
        <p>
          Paste any Instagram, TikTok, or X (Twitter) link to download the
          media without watermarks when possible.
        </p>
      </header>

      <form className="card" onSubmit={handleSubmit}>
        <label className="label" htmlFor="url-input">
          Link
        </label>
        <div className="input-row">
          <input
            id="url-input"
            type="url"
            placeholder="https://www.tiktok.com/@user/video/123..."
            value={urlInput}
            onChange={(event) => setUrlInput(event.target.value)}
            autoComplete="off"
            required
          />
          <button type="submit" disabled={!isValidUrl || isLoading}>
            {isLoading ? 'Fetching…' : 'Download'}
          </button>
        </div>
        <p className="helper">
          Works best with public posts. Private or age-restricted content may
          fail.
        </p>
      </form>

      {errorMessage && <div className="error">{errorMessage}</div>}

      {downloads.length > 0 && (
        <section className="results">
          <h2>Download ready</h2>
          <p>
            Tap each link to download. Files open in a new tab so you can save
            them directly.
          </p>
          <div className="results-grid">
            {downloads.map((entry, index) => (
              <a
                key={entry.id}
                className="result-card"
                href={entry.url}
                target="_blank"
                rel="noreferrer"
              >
                <span>Media {index + 1}</span>
                <span className="result-action">Open file</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="tips">
        <h2>Supported platforms</h2>
        <div className="tips-grid">
          <div>
            <h3>Instagram</h3>
            <p>Posts, reels, and stories when public.</p>
          </div>
          <div>
            <h3>TikTok</h3>
            <p>No-watermark downloads when available.</p>
          </div>
          <div>
            <h3>X / Twitter</h3>
            <p>Public videos and images are supported.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>
          Powered by the Cobalt public API. Use responsibly and respect content
          rights.
        </p>
      </footer>
    </div>
  )
}

export default App
