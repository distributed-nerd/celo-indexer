'use client'

import Link from 'next/link'
import { Github, Twitter } from 'lucide-react'
import { FaDiscord } from "react-icons/fa6";

const navigation = {
  explorer: [
    { name: 'Transactions', href: '/transactions' },
    { name: 'Blocks', href: '/blocks' },
    { name: 'Addresses', href: '/addresses' },
    { name: 'Tokens', href: '/tokens' },
    { name: 'NFTs', href: '/nfts' },
  ],
  resources: [
    { name: 'Documentation', href: '#' },
    { name: 'API', href: '#' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Statistics', href: '/stats' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '#' },
    { name: 'Partners', href: '#' },
    { name: 'Contact', href: '#' },
  ],
  legal: [
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
  ],
  social: [
    {
      name: 'GitHub',
      href: '#',
      icon: Github,
    },
    {
      name: 'Twitter',
      href: '#',
      icon: Twitter,
    },
    {
      name: 'Discord',
      href: '#',
      icon: FaDiscord,
    },
  ],
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-12">
          <div className="space-y-8">
            <div className="flex items-center gap-2 group">
              <span className="h-10 w-10 rounded-full bg-linear-to-br from-base-blue-500 to-celo-green flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <span className="text-white font-bold text-lg">C</span>
              </span>
              <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Celo<span className="text-base-blue-500">Indexer</span>
              </span>
            </div>
            <p className="text-base leading-7 text-gray-600 dark:text-gray-400 max-w-sm">
              Empowering the Celo ecosystem with high-performance indexing and 
              <span className="font-semibold text-base-blue-500"> AI-driven </span> 
              blockchain insights.
            </p>
            <div className="flex space-x-5">
              {navigation.social.map((item) => (
                <a 
                  key={item.name} 
                  href={item.href} 
                  className="p-2 rounded-full glass hover:bg-base-blue-500/10 dark:hover:bg-base-blue-500/20 text-gray-500 hover:text-base-blue-600 dark:text-gray-400 dark:hover:text-base-blue-400 transition-all duration-300"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">Explorer</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.explorer.map((item) => (
                    <li key={item.name}>
                      <Link 
                        href={item.href} 
                        className="text-sm leading-6 text-gray-600 hover:text-base-blue-600 dark:text-gray-400 dark:hover:text-base-blue-400"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">Resources</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.resources.map((item) => (
                    <li key={item.name}>
                      <Link 
                        href={item.href} 
                        className="text-sm leading-6 text-gray-600 hover:text-base-blue-600 dark:text-gray-400 dark:hover:text-base-blue-400"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link 
                        href={item.href} 
                        className="text-sm leading-6 text-gray-600 hover:text-base-blue-600 dark:text-gray-400 dark:hover:text-base-blue-400"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">Legal</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link 
                        href={item.href} 
                        className="text-sm leading-6 text-gray-600 hover:text-base-blue-600 dark:text-gray-400 dark:hover:text-base-blue-400"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-900/10 dark:border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
            &copy; {currentYear} CeloIndexer. Built for Celo Hackathon. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0">
            <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
              Powered by Celo Network
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}