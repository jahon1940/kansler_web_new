import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { memo, useEffect, useState } from 'react'

const TypingEffectMarkdown = ({ content }: { content: string }) => {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    if (!content) return

    let currentIndex = 0
    const characters = content.split(' ')

    const typingInterval = setInterval(() => {
      setDisplayedText((prevText) => prevText + ' ' + (characters[currentIndex] || ''))
      currentIndex++

      if (currentIndex !== undefined && currentIndex === characters.length) {
        clearInterval(typingInterval)
      }
    }, 50)

    return () => clearInterval(typingInterval)
  }, [content])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col gap-2"
    >
      <ReactMarkdown>{displayedText}</ReactMarkdown>
    </motion.div>
  )
}

export default memo(TypingEffectMarkdown)
