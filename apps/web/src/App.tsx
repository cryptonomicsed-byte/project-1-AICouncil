import { useState, useEffect } from 'react'
import ChatInterface from './components/ChatInterface'
import './App.css'

function App() {
  const [apiHealth, setApiHealth] = useState<boolean>(false)
  const [loadingHealth, setLoadingHealth] = useState(true)

  useEffect(() => {
    checkHealth()
    const interval = setInterval(checkHealth, 5000)
    return () => clearInterval(interval)
  }, [])

  const checkHealth = async () => {
    try {
      const res = await fetch('http://localhost:8000/health')
      setApiHealth(res.ok)
    } catch {
      setApiHealth(false)
    } finally {
      setLoadingHealth(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/10 to-slate-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <header className="relative border-b border-purple-500/20 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <div className="text-4xl">🏛️</div>
                <div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    AICouncil
                  </h1>
                  <p className="text-purple-300/70 text-sm font-medium">Epistemic Consensus Engine</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${apiHealth ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></div>
                <span className={`text-sm font-medium ${apiHealth ? 'text-emerald-400' : 'text-red-400'}`}>
                  {apiHealth ? 'Online' : 'Offline'}
                </span>
              </div>
              <a
                href="http://localhost:8000/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-purple-600/80 hover:bg-purple-500 text-white font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-purple-500/50 text-sm"
              >
                API Docs →
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="group bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-purple-300/60 text-xs font-semibold uppercase tracking-wide">Backend</div>
                <div className="text-2xl font-bold text-white mt-2">8000</div>
              </div>
              <div className="text-3xl group-hover:scale-110 transition-transform">⚡</div>
            </div>
            <a href="http://localhost:8000" className="text-purple-400 text-xs mt-3 hover:text-purple-300 inline-block">
              localhost:8000 →
            </a>
          </div>

          <div className="group bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20 rounded-xl p-6 hover:border-pink-500/40 transition-all hover:shadow-lg hover:shadow-pink-500/10 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-pink-300/60 text-xs font-semibold uppercase tracking-wide">Agents</div>
                <div className="text-2xl font-bold text-white mt-2">3+</div>
              </div>
              <div className="text-3xl group-hover:scale-110 transition-transform">🤖</div>
            </div>
            <div className="text-pink-400 text-xs mt-3">Multi-perspective consensus</div>
          </div>

          <div className="group bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-all hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-blue-300/60 text-xs font-semibold uppercase tracking-wide">Endpoints</div>
                <div className="text-2xl font-bold text-white mt-2">5+</div>
              </div>
              <div className="text-3xl group-hover:scale-110 transition-transform">🔌</div>
            </div>
            <div className="text-blue-400 text-xs mt-3">REST API ready</div>
          </div>

          <div className={`group bg-gradient-to-br ${apiHealth ? 'from-emerald-500/10 to-transparent border border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-emerald-500/10' : 'from-red-500/10 to-transparent border border-red-500/20 hover:border-red-500/40 hover:shadow-red-500/10'} rounded-xl p-6 transition-all hover:shadow-lg cursor-pointer`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-xs font-semibold uppercase tracking-wide ${apiHealth ? 'text-emerald-300/60' : 'text-red-300/60'}`}>Status</div>
                <div className={`text-2xl font-bold mt-2 ${apiHealth ? 'text-emerald-400' : 'text-red-400'}`}>
                  {loadingHealth ? '...' : apiHealth ? 'Live' : 'Offline'}
                </div>
              </div>
              <div className={`text-3xl group-hover:scale-110 transition-transform ${apiHealth ? 'animate-pulse' : ''}`}>
                {apiHealth ? '✅' : '❌'}
              </div>
            </div>
          </div>
        </div>

        {/* Main Panel */}
        <div className="space-y-8">
          {/* Deliberation Section */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-2xl p-8 backdrop-blur-sm hover:border-purple-500/40 transition-all shadow-xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Council Deliberation</h2>
              <p className="text-slate-400">Submit a topic and watch multiple AI agents debate and reach consensus</p>
            </div>
            <ChatInterface />
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <span className="text-2xl">🧠</span>
                <span>How It Works</span>
              </h3>
              <ul className="space-y-3 text-slate-300 text-sm">
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 font-bold mt-1">1.</span>
                  <span>Submit a topic for deliberation</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 font-bold mt-1">2.</span>
                  <span>Multiple agents evaluate from different perspectives</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 font-bold mt-1">3.</span>
                  <span>Votes are aggregated into consensus score</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 font-bold mt-1">4.</span>
                  <span>Chairman synthesizes summary and recommendations</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-pink-500/5 to-transparent border border-pink-500/20 rounded-xl p-6 hover:border-pink-500/40 transition-all">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <span className="text-2xl">🤝</span>
                <span>Agent Perspectives</span>
              </h3>
              <ul className="space-y-3 text-slate-300 text-sm">
                <li className="flex items-start space-x-3">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-bold">LA</span>
                  <span><strong className="text-blue-300">Logical Analyzer</strong> - Consistency & Structure</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs font-bold">PR</span>
                  <span><strong className="text-green-300">Pragmatist</strong> - Feasibility & Resources</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-xs font-bold">DA</span>
                  <span><strong className="text-orange-300">Devil's Advocate</strong> - Critique & Risks</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-all">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <span className="text-2xl">📊</span>
                <span>Metrics</span>
              </h3>
              <ul className="space-y-3 text-slate-300 text-sm">
                <li className="flex items-center justify-between">
                  <span>Consensus Score</span>
                  <span className="text-emerald-400 font-bold">0-100%</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Disagreement Severity</span>
                  <span className="text-orange-400 font-bold">0-100%</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Agent Confidence</span>
                  <span className="text-blue-400 font-bold">Per Vote</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Vote Positions</span>
                  <span className="text-pink-400 font-bold">Agree/Partial/Disagree</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/40 transition-all">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <span className="text-2xl">🔗</span>
                <span>Integration</span>
              </h3>
              <div className="space-y-3">
                <a
                  href="http://localhost:8000/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium"
                >
                  → Swagger API Documentation
                </a>
                <a
                  href="http://localhost:8000/health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium"
                >
                  → Health Check Endpoint
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-purple-500/10 bg-slate-900/40 backdrop-blur-sm mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="http://localhost:8000" className="hover:text-purple-400 transition">Backend Service</a></li>
                <li><a href="http://localhost:8000/docs" className="hover:text-purple-400 transition">API Documentation</a></li>
                <li><a href="http://localhost:8000/health" className="hover:text-purple-400 transition">Health Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">API Endpoints</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><code className="text-purple-400">POST /api/council/deliberate</code></li>
                <li><code className="text-purple-400">GET /api/council/agents</code></li>
                <li><code className="text-purple-400">GET /api/council/status</code></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">Technology</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>Python FastAPI Backend</li>
                <li>React 18 Frontend</li>
                <li>Tailwind CSS Styling</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-purple-500/10 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between text-slate-400 text-sm">
              <p>Built with ⚡ by Ọbàtálá & AIcouncil Contributors</p>
              <p className="mt-4 md:mt-0">Version 1.0.0 | Localhost Edition | December 2025</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
