
// import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import SobreMim from './pages/SobreMim'
import Especialidades from './pages/Especialidades'
import Artigos from './pages/Artigos'
import ArtigoDetalhes from './pages/ArtigoDetalhes'
import Videos from './pages/Videos'
import Contato from './pages/Contato'
import Admin from './pages/Admin'
// import "./index.css"

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#2d3748',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
          },
          success: {
            style: {
              background: '#f0fff4',
              color: '#22543d',
              border: '1px solid #68d391',
            },
          },
          error: {
            style: {
              background: '#fff5f5',
              color: '#742a2a',
              border: '1px solid #fc8181',
            },
          },
        }}
      />
      
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sobre-mim" element={<SobreMim />} />
              <Route path="/especialidades" element={<Especialidades />} />
              <Route path="/artigos" element={<Artigos />} />
              <Route path="/artigos/:id" element={<ArtigoDetalhes />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/admin/*" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </>
  )
}

export default App
