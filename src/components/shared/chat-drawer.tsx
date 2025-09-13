import Link from 'next/link'
import remarkGfm from 'remark-gfm'
import Markdown from 'react-markdown'
import { twMerge } from 'tailwind-merge'
import { useTranslation } from 'next-i18next'
import { useState, useRef, useEffect } from 'react'
import { InView } from 'react-intersection-observer'
import { AnimatePresence, motion } from 'framer-motion'
import { Drawer, Input, Button, Spin, Avatar } from 'antd'
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'

import { MessageCircleIcon, MessageSquare } from 'lucide-react'

import { API_HOST } from '@/config'
import useAuthStore from '@/store/auth-store'
import { formatAmount } from '@/utils/format-amount'
import { getAuthCurrent } from '@/views/profile/services'
import { deleteChatHistory, getChatHistory, sendMessage } from '@/services'

import Loader from './loader'
import TypingEffectMarkdown from './typing-effect-markdown'

import CImage from '../ui/cimage'
import NoPhoto from '@/assets/nophoto.png'
import SendOutlineIcon from '../icons/send-outline'
import CircleLogo from '../../assets/circle-ai-logo.gif'
import CloseSquareOutlineIcon from '../icons/close-square-outline'

import type { ReactNode } from 'react'

type Message = {
  id: number | string
  content: string
  type: 'ai' | 'human'
  timestamp: Date
  products?: any[]
  isLiked?: boolean
  isDisliked?: boolean
  isSaved?: boolean
}

type SuggestionType = {
  text: string
  icon?: ReactNode
}

export default function ChatDrawer() {
  const { t } = useTranslation()
  const isSignedIn = useAuthStore((state) => state.isSignedIn)

  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { data } = useQuery({
    queryKey: ['auth-current'],
    queryFn: getAuthCurrent,
    enabled: isSignedIn,
  })

  const {
    data: historyPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isHistoryLoading,
    refetch,
  } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ['chat-history', data?.id, isSignedIn, open],
    queryFn: ({ pageParam = 1 }) =>
      getChatHistory({
        user_id: data?.id as number,
        company_id: 1,
        page: pageParam,
        page_size: 20,
      }),
    enabled: Boolean(open && isSignedIn && data && data?.id),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < 5 ? undefined : allPages.length + 1,
  })

  const suggestions: SuggestionType[] = [
    { text: t('common:chat-suggestions.increase_sales'), icon: <MessageSquare size={14} /> },
    { text: t('common:chat-suggestions.top_products'), icon: <MessageSquare size={14} /> },
    { text: t('common:chat-suggestions.product_types'), icon: <MessageSquare size={14} /> },
    { text: t('common:chat-suggestions.new_arrivals'), icon: <MessageSquare size={14} /> },
  ]

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [open])

  useEffect(() => {
    if (!isSignedIn) setMessages([])
  }, [isSignedIn])

  useEffect(() => {
    if (!isHistoryLoading && isSignedIn)
      messagesEndRef.current?.scrollIntoView({ behavior: 'instant' })
  }, [open, isHistoryLoading, isSignedIn])

  const chatMutation = useMutation({
    mutationFn: (values: any) => sendMessage({ ...values, company_id: 1 }),
  })

  const deleteChatMutation = useMutation({
    mutationFn: deleteChatHistory,
    onSuccess: () => {
      refetch()
      setMessages([])
    },
  })

  const handleSendMessage = async (messageText = input) => {
    if ((data && data.is_address) || !isSignedIn || !messageText.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      content: messageText,
      type: 'human',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' })

    try {
      const response = await chatMutation.mutateAsync({
        query: messageText,
        user_id: String(data?.id),
      })

      const aiMessage: Message = {
        id: Date.now() + 1,
        content: response?.llm_answer,
        type: 'ai',
        timestamp: new Date(),
        products: response?.products,
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          content: t('common:chat-error-message') as string,
          type: 'ai',
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const historyMessages = historyPages?.pages
    .flat()
    .map((val) => {
      if (val.type === 'ai') {
        const content: any = val?.content

        try {
          return {
            ...val,
            content: content.llm_answer,
            products: content.products || [],
          }
        } catch (error) {
          console.error('Error parsing JSON:', error)
          return val
        }
      }
      return val
    })
    .reverse()

  const allMessages = [...(historyMessages || []), ...messages]

  return (
    <>
      <button
        className="text-black outline-none dark:text-white bg-white px-2 py-0.5 rounded-md border border-primary inline-flex duration-200 hover:text-primary-light gap-2 items-center"
        onClick={() => setOpen(true)}
      >
        <CImage src={CircleLogo} width={24} height={24} alt="homo logo" />
        <span
          style={{
            fontWeight: '600',
            lineHeight: '20px',
            backgroundImage: 'linear-gradient(to right, #4285f4, #9b72cb, #d96570)',
            WebkitMaskImage: 'linear-gradient(to right, #4285f4, #9b72cb, #d96570)',
            maskImage: 'linear-gradient(to right, #4285f4, #9b72cb, #d96570)',
            WebkitMaskClip: 'text',
            maskClip: 'text',
            color: 'transparent',
          }}
        >
          hoomo AI
        </span>
      </button>

      <Drawer
        placement="bottom"
        onClose={() => setOpen(false)}
        open={open}
        maskClosable={true}
        closeIcon={null}
        classNames={{
          body: twMerge(
            'dark:bg-[#232932ff] py-0',
            isFetchingNextPage ? 'overflow-hidden' : 'overflow-y-auto'
          ),
          content: 'dark:bg-[#232932ff] rounded-t-2xl',
          header: '[&_.ant-drawer-header-title]:justify-end',
          mask: 'backdrop-blur-sm',
        }}
        height={'100%'}
      >
        <Button
          type="text"
          className="text-[24px] text-black dark:text-white absolute right-3 top-3 z-10"
          icon={<CloseSquareOutlineIcon />}
          onClick={() => setOpen(false)}
        />
        <div className="flex flex-col h-full w-full max-w-[1000px] mx-auto">
          <div
            className={twMerge(
              'flex-1 flex flex-col p-4 space-y-4',
              allMessages && allMessages.length ? '' : 'items-center justify-center'
            )}
          >
            {allMessages && allMessages?.length > 0 ? null : (
              <>
                <div className="flex justify-center items-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CImage width={200} height={200} alt="logo" src={CircleLogo} />
                  </motion.div>
                </div>
                <motion.h1
                  className="text-center font-medium items-center w-full text-[26px] inline-flex flex-col"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <span
                    style={{
                      fontWeight: '600',
                      lineHeight: '40px',
                      backgroundImage: 'linear-gradient(to right, #4285f4, #9b72cb, #d96570)',
                      WebkitMaskImage: 'linear-gradient(to right, #4285f4, #9b72cb, #d96570)',
                      maskImage: 'linear-gradient(to right, #4285f4, #9b72cb, #d96570)',
                      WebkitMaskClip: 'text',
                      maskClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    {t('common:greeting.line1')}
                  </span>
                  <span
                    style={{
                      fontWeight: '600',
                      lineHeight: '40px',
                      backgroundImage: 'linear-gradient(to right, #4285f4, #9b72cb, #d96570)',
                      WebkitMaskImage: 'linear-gradient(to right, #4285f4, #9b72cb, #d96570)',
                      maskImage: 'linear-gradient(to right, #4285f4, #9b72cb, #d96570)',
                      WebkitMaskClip: 'text',
                      maskClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    {t('common:greeting.line2')}
                  </span>
                </motion.h1>
                <AnimatePresence>
                  {suggestions.length > 0 && allMessages && allMessages?.length < 1 && (
                    <motion.div
                      className="flex w-full gap-2 pb-2 px-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      {/* <motion.p
                  className="text-black dark:text-white flex-1 text-[18px] max-w-[400px] text-center mx-auto"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {t('common:chat-intro-learning')}
                </motion.p> */}
                      <motion.p
                        className="text-black dark:text-white flex-1 text-[18px] max-w-[400px] text-center mx-auto"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        {data && data.is_address
                          ? t('common:category_not_found.page_restricted')
                          : t('common:chat-intro-info')}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
            {allMessages && allMessages?.length ? (
              <InView
                onChange={(val) => !isHistoryLoading && hasNextPage && val && fetchNextPage()}
              >
                {({ ref }) => (
                  <div ref={ref} className="text-center h-[200px] py-4 col-span-full">
                    {isFetchingNextPage ? <Loader /> : null}
                  </div>
                )}
              </InView>
            ) : null}

            {isHistoryLoading ? (
              <div className="flex justify-center py-8">
                <Spin size="large" />
              </div>
            ) : allMessages?.length === 0 ? null : (
              <div className="flex-1 space-y-6 pr-2" ref={chatContainerRef}>
                {allMessages?.map((message: any, i) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message?.type === 'human' ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* {message?.type === 'ai' && (
                      <Avatar src={CircleLogo.src} className="mr-2 mt-1" size={36} />
                    )} */}

                    <div className="flex flex-col max-w-[80%]">
                      <div
                        className={`rounded-xl py-2 ${
                          message?.type === 'human'
                            ? 'bg-primary px-4 text-white rounded-br-none'
                            : 'text-white'
                        }`}
                      >
                        {message?.type === 'human' ? (
                          <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        ) : (
                          <div className="flex flex-col">
                            <div className="text-black flex flex-col gap-2 [&_ul]:list-disc [&_ul]:list-inside contain-style dark:text-white">
                              {allMessages.length === i + 1 ? (
                                <TypingEffectMarkdown content={message.content} />
                              ) : (
                                <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
                              )}
                            </div>

                            {message?.products && message?.products?.length > 0 && (
                              <div className="flex flex-col gap-4 mt-4">
                                {message?.products?.map((product: any) => (
                                  <motion.div
                                    key={product.id}
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <Link
                                      href={`/products/${product?.title_slug}`}
                                      className="dark:bg-dsecondary bg-gray-100 overflow-hidden max-w-[500px] gap-4 h-full text-white flex p-2 rounded-xl border dark:border-dborder hover:border-primary hover:dark:border-primary transition-colors duration-200 cursor-pointer"
                                      onClick={() => setOpen(false)}
                                    >
                                      <div className="relative shrink-0 size-[100px] bg-white rounded-lg overflow-hidden">
                                        <CImage
                                          src={
                                            product?.image_url
                                              ? API_HOST + product.image_url
                                              : NoPhoto.src
                                          }
                                          width={250}
                                          height={250}
                                          alt={product.name}
                                          className="w-full h-full object-contain"
                                        />
                                      </div>
                                      <div className="flex flex-col gap-1.5">
                                        <small className="text-[12px] text-black dark:text-white font-mono font-thin line-clamp-1">
                                          {t('fields:vendor_code.label')}: {product?.vendor_code}
                                        </small>
                                        <div
                                          className="font-semibold dark:text-white text-black
                                         break-all line-clamp-2"
                                        >
                                          {product?.name}
                                        </div>
                                        {/* <div className="text-xs line-clamp-2 break-all text-white/70">
                                          {product.description}
                                        </div> */}
                                        <div className="flex-1" />
                                        {product?.order_count ? (
                                          <small className="text-[12px] text-black dark:text-white line-clamp-1">
                                            {t('fields:order_count.label')}: {product?.order_count}
                                          </small>
                                        ) : null}
                                        <div className="font-bold text-primary dark:text-white">
                                          {formatAmount(product.price)} {t('common:uzs')}
                                        </div>
                                      </div>
                                    </Link>
                                  </motion.div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* {message?.type === 'ai' && (
                        <div className="flex items-center gap-2 mt-2 text-black dark:text-white/60">
                          <Tooltip title="Like">
                            <Button
                              type="text"
                              size="small"
                              className={`p-1 ${message.isLiked ? 'text-primary' : 'text-black dark:text-white/60'}`}
                              icon={<ThumbsUp size={16} />}
                              onClick={() => handleFeedback(message.id, 'like')}
                            />
                          </Tooltip>
                          <Tooltip title="Dislike">
                            <Button
                              type="text"
                              size="small"
                              className={`p-1 ${message.isDisliked ? 'text-primary' : 'text-black dark:text-white/60'}`}
                              icon={<ThumbsDown size={16} />}
                              onClick={() => handleFeedback(message.id, 'dislike')}
                            />
                          </Tooltip>
                          <Tooltip title="Save">
                            <Button
                              type="text"
                              size="small"
                              className={`p-1 ${message.isSaved ? 'text-primary' : 'text-black dark:text-white/60'}`}
                              icon={<Bookmark size={16} />}
                              onClick={() => handleFeedback(message.id, 'save')}
                            />
                          </Tooltip>
                          <Tooltip title="Share">
                            <Button
                              type="text"
                              size="small"
                              className="p-1 text-black dark:text-white/60"
                              icon={<Share2 size={16} />}
                            />
                          </Tooltip>
                          <span className="text-xs ml-auto">
                            {message?.timestamp?.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      )} */}
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-black dark:text-white">
                    <Avatar src={CircleLogo.src} size={36} />{' '}
                    {/* <span className="ml-2">{t('common:chat-thinking')}...</span> */}
                  </div>
                )}
              </div>
            )}

            <div className={allMessages?.length ? 'pt-[200px]' : ''}>
              <div ref={messagesEndRef} className="h-[1px] w-full" />
            </div>
          </div>

          <div className="sticky bottom-0 bg-gradient-to-t dark:from-[#232932ff] to-transparent px-4 pt-3 pb-6">
            {!isSignedIn ? (
              <div className="text-center text-[18px] mb-10 text-primary py-10 border-t border-b border-primary">
                {t('common:chat-auth-required')}
              </div>
            ) : null}

            <div className="border rounded-2xl shadow-2xl relative bg-white dark:shadow-[#232932ff] p-4 dark:border-dborder dark:bg-[#232932ff]">
              {allMessages && allMessages?.length > 0 ? (
                <Button
                  className="px-3 py-2 absolute flex items-center shadow-md hover:border-primary hover:dark:border-primary gap-2 top-[-50px] dark:border-dprimary text-xs left-[50%] rounded-xl dark:bg-dprimary dark:text-white translate-x-[-50%]"
                  onClick={() =>
                    deleteChatMutation.mutate({ user_id: String(data?.id), company_id: 1 })
                  }
                  loading={deleteChatMutation.isPending}
                  icon={<MessageCircleIcon size={18} />}
                  disabled={isLoading || isHistoryLoading || isFetchingNextPage}
                >
                  {t('actions:new-chat')}
                </Button>
              ) : null}
              <div className="flex flex-col gap-3">
                <AnimatePresence>
                  {suggestions.length > 0 && allMessages?.length === 0 && (
                    <motion.div
                      className="flex w-full gap-2 overflow-x-auto pb-2 px-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      {suggestions.map((suggestion, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="px-3 whitespace-nowrap cursor-pointer hover:bg-primary-light hover:dark:bg-primary duration-200 py-2 border rounded-lg dark:bg-dsecondary dark:border-dsecondary text-black dark:text-white flex items-center gap-1.5"
                          onClick={() => {
                            if (!chatMutation.isPending) {
                              handleSendMessage(suggestion.text)
                            }
                          }}
                        >
                          {suggestion.icon}
                          {suggestion.text}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex space-x-2 relative">
                  <Input.TextArea
                    ref={inputRef as any}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t('common:chat-input-placeholder')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.shiftKey) {
                        e.preventDefault()
                        setInput((prev) => prev + '\n')
                      } else if (e.key === 'Enter') {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    disabled={(data && data.is_address) || !isSignedIn || isLoading}
                    className="dark:bg-dsecondary resize-none rounded-xl"
                    size="large"
                    autoFocus
                    autoSize={{ minRows: 1, maxRows: 10 }}
                  />

                  <Button
                    type="primary"
                    onClick={() => handleSendMessage()}
                    size="large"
                    className="disabled:dark:bg-dsecondary text-[24px] disabled:dark:border-dborder disabled:dark:text-white/50"
                    disabled={!isSignedIn || !input.trim() || isLoading}
                    icon={<SendOutlineIcon />}
                  />
                </div>

                {/* <motion.div
                  className="text-xs text-center text-black dark:text-white/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {t('common:chat-warning')}
                </motion.div> */}
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  )
}
