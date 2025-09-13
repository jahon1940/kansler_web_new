import { useState } from 'react'
import { Button, Modal } from 'antd'
import { useTranslation } from 'next-i18next'

import { CopyOutlined, ShareAltOutlined } from '@ant-design/icons'

interface ShareModalProps {
  slug?: string
  title?: string
}

const ShareButtonModal = ({ slug, title }: ShareModalProps) => {
  const { t } = useTranslation('common')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')

  const shareUrl = typeof window !== 'undefined' ? window.location.origin + `/products/${slug}` : ''

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setTimeout(() => setCopyStatus(''), 300)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopyStatus('success')
      setTimeout(() => setCopyStatus(''), 3000)
    } catch (err: any) {
      setCopyStatus('error')
      console.error(err)
      setTimeout(() => setCopyStatus(''), 3000)
    }
  }

  const shareToTelegram = () => {
    const telegramUrl = `https://t.me/share/url?text=${encodeURIComponent(title || t('share.default-title'))}&url=${encodeURIComponent(shareUrl)}`
    window.open(telegramUrl, '_blank')
  }

  return (
    <>
      <Button size="large" icon={<ShareAltOutlined className="text-lg" />} onClick={showModal} />

      <Modal
        centered
        title={t('share.modal-title')}
        open={isModalOpen}
        width={400}
        onCancel={handleCancel}
        footer={null}
        classNames={{ body: 'pt-4' }}
      >
        <Button
          type="default"
          icon={<CopyOutlined />}
          onClick={copyToClipboard}
          style={{ marginBottom: 10, width: '100%' }}
        >
          {t('share.copy-button')}
        </Button>
        <Button type="primary" onClick={shareToTelegram} style={{ width: '100%' }}>
          {t('share.telegram-button')}
        </Button>

        {copyStatus && (
          <div
            style={{
              marginTop: '8px',
              padding: '8px 12px',
              borderRadius: '8px',
              textAlign: 'center',
              backgroundColor: copyStatus === 'success' ? '#f6ffed' : '#fff2f0',
              border: `1px solid ${copyStatus === 'success' ? '#b7eb8f' : '#ffccc7'}`,
            }}
          >
            {t(copyStatus === 'success' ? 'share.copy-success' : 'share.copy-error')}
          </div>
        )}
      </Modal>
    </>
  )
}

export default ShareButtonModal
