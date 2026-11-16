import { useState, useEffect } from 'react';
import { Link2, Copy, Check, ExternalLink, Clock, MousePointerClick, Sparkles, ArrowRight } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL;

export default function App() {
  const [urlInput, setUrlInput] = useState('');
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Fetch all shortened URLs from PostgreSQL on load
  const fetchUrls = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/urls`);
      if (!res.ok) throw new Error('Failed to load URLs');
      const data = await res.json();
      setUrls(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  // Handle form submission
  const handleShorten = async (e) => {
    e.preventDefault();
    setError('');
    if (!urlInput.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to shorten URL');
      } else {
        setUrls((prev) => [data, ...prev]);
        setUrlInput('');
      }
    } catch (err) {
      setError('Cannot connect to server. Make sure backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (shortCode, id) => {
    const fullShortUrl = `${API_BASE}/${shortCode}`;
    navigator.clipboard.writeText(fullShortUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Just now';
    return new Date(isoString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalClicks = urls.reduce((sum, item) => sum + (item.clicks || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">SnapLink</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <a href="#shorten" className="hover:text-white transition">Shorten</a>
            <a href="#dashboard" className="hover:text-white transition">Dashboard</a>
          </div>
        </div>
      </nav>

      {/* Landing Page Hero Section */}
      <section id="shorten" className="relative pt-20 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950" />
        
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast, PostgreSQL-Backed URL Shortener</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Shorten your links. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              Track every click.
            </span>
          </h1>

          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Transform long, messy URLs into clean, shareable links in milliseconds and monitor real-time performance right from your dashboard.
          </p>

          {/* Shortener Form */}
          <form onSubmit={handleShorten} className="mt-8 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl focus-within:border-indigo-500 transition">
              <input
                type="text"
                placeholder="Paste your long URL here (e.g., https://github.com/Kalpana0107/...)"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 bg-transparent px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none text-sm sm:text-base"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 font-semibold text-white transition cursor-pointer"
              >
                {loading ? 'Shortening...' : 'Shorten URL'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <p className="mt-3 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg py-2 px-4">
                {error}
              </p>
            )}
          </form>
        </div>
      </section>

      {/* Dashboard Section */}
      <section id="dashboard" className="max-w-6xl mx-auto px-6 pb-24">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <p className="text-slate-400 text-sm">Total Links Created</p>
            <p className="text-3xl font-bold mt-1">{urls.length}</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <p className="text-slate-400 text-sm">Total Redirect Clicks</p>
            <p className="text-3xl font-bold mt-1 text-cyan-400">{totalClicks}</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <p className="text-slate-400 text-sm">Database Status</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-emerald-400">PostgreSQL Connected</span>
            </div>
          </div>
        </div>

        {/* Links Table */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Shortened URLs</h2>
            <button
              onClick={fetchUrls}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
            >
              Refresh Data
            </button>
          </div>

          {fetching ? (
            <div className="p-12 text-center text-slate-400">Loading links from database...</div>
          ) : urls.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              No links shortened yet. Paste a URL above to create your first link!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs uppercase text-slate-400 bg-slate-900/40">
                    <th className="py-3.5 px-6">Short Link</th>
                    <th className="py-3.5 px-6">Original Destination</th>
                    <th className="py-3.5 px-6">Created Timing</th>
                    <th className="py-3.5 px-6 text-center">Clicks</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 text-sm">
                  {urls.map((item) => {
                    const fullShortUrl = `${API_BASE}/${item.short_url}`;
                    return (
                      <tr key={item.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-4 px-6 font-medium text-indigo-400 whitespace-nowrap">
                          <a
                            href={fullShortUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => setTimeout(fetchUrls, 500)}
                            className="inline-flex items-center gap-1.5 hover:underline"
                          >
                            localhost:5000/{item.short_url}
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </td>
                        <td className="py-4 px-6 max-w-xs truncate text-slate-300" title={item.original_url}>
                          {item.original_url}
                        </td>
                        <td className="py-4 px-6 text-slate-400 whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            {formatDate(item.created_at)}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 font-medium text-xs">
                            <MousePointerClick className="w-3 h-3" />
                            {item.clicks ?? 0}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleCopy(item.short_url, item.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
                          >
                            {copiedId === item.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}