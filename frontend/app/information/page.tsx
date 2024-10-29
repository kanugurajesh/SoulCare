'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Youtube, FileText } from 'lucide-react'

export default function Component() {
  const router = useRouter()
  const [hoveredBox, setHoveredBox] = useState<string | null>(null)

  const boxes = [
    { title: 'YouTube RAG', icon: Youtube, route: 'information/video', color: 'text-red-500' },
    { title: 'Document RAG', icon: FileText, route: 'information/document', color: 'text-blue-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <header className="w-full max-w-4xl mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">RAG Navigation</h1>
        <p className="text-lg text-gray-600">Select a Retrieval-Augmented Generation option</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {boxes.map((box) => (
          <motion.div
            key={box.title}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-shadow duration-300 ease-in-out hover:shadow-lg"
            whileHover={{ y: -5 }}
            whileTap={{ y: 0 }}
            onClick={() => router.push(box.route)}
            onMouseEnter={() => setHoveredBox(box.title)}
            onMouseLeave={() => setHoveredBox(null)}
          >
            <div className="h-48 p-6 flex flex-col items-center justify-center relative">
              <motion.div
                className={`${box.color} mb-4`}
                initial={{ scale: 1 }}
                animate={{ scale: hoveredBox === box.title ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <box.icon size={48} />
              </motion.div>
              <h2 className="text-xl font-semibold text-gray-800 text-center">{box.title}</h2>
              <motion.div
                className="absolute inset-0 bg-gray-800 opacity-0"
                initial={false}
                animate={{ opacity: hoveredBox === box.title ? 0.05 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}