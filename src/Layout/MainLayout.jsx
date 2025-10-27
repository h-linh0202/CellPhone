import React from 'react'
import Footer from './Footer.jsx'
import Header from './Header.jsx'

const Layout = ({ children }) => {
  return (
    <div>
      <Header/>
      <div className="pt-24 max-w-6xl mx-auto px-4">
      {children}
    </div>
      <Footer/>
    </div>
  )
}

export default Layout


