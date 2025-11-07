'use client'

import { motion } from 'framer-motion'
import { Brain, Menu, X, User, LogOut } from 'lucide-react'
import { useState, useRef } from 'react'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'
interface HeaderProps {
  onLogout: () => void;
  user: any;
  isAuthenticated: boolean;
  onOpenAuthModal: () => void;
}

export function Header({ onLogout, user, isAuthenticated, onOpenAuthModal }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(userMenuRef, () => setShowUserMenu(false))

  return (
    <header className="sticky top-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Periscan AI</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">
              Características
            </a>
            <a href="#about" className="text-gray-600 hover:text-primary-600 transition-colors">
              Acerca de
            </a>
            
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>{user?.name}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-100">
                      {user?.email}
                    </div>
                    <button
                      onClick={onLogout}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={onOpenAuthModal} className="btn-primary">
                Comenzar
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-gray-200"
          >
            <nav className="flex flex-col gap-4">
              <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">
                Características
              </a>
              <a href="#about" className="text-gray-600 hover:text-primary-600 transition-colors">
                Acerca de
              </a>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="px-4 text-sm">
                      <p className="font-semibold text-gray-800">{user?.name}</p>
                      <p className="text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={onLogout}
                      className="w-full btn-secondary flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <button onClick={onOpenAuthModal} className="btn-primary w-full">
                    Comenzar
                  </button>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}
