import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css' apaguei
import App from './App.tsx'
import Header from './Header.tsx'
import Body from './Body.tsx'
import Footer from './Footer.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Header />
    <Body />
    <Footer />
  </StrictMode>,
)
