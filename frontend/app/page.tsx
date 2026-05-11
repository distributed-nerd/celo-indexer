import React from 'react'
import Hero from '@/components/home/Hero'
import LiveStats from '@/components/home/LiveStats'
import AIShowcase from '@/components/home/AIShowcase'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import Features from '@/components/home/Features'

const page = () => {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col">
        <Hero />
        <LiveStats />
        <Features />
        <AIShowcase />
      </main>
      <Footer />
    </>
  )
}

export default page