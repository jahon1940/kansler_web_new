import ArrowLeftOutlineIcon from '@/components/icons/arrow-left-outline'
import { Button } from 'antd'
import { useRouter } from 'next/router'

import { Card, Row, Col, Typography } from 'antd'
import { EnvironmentOutlined, PhoneOutlined, SendOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const ContactsView = () => {
  const { push } = useRouter()

  return (
    <div className="min-h-screen py-6">
      <div className="custom-container">
        <div className="flex items-center gap-4 mb-6">
          <Button
            icon={<ArrowLeftOutlineIcon />}
            className=" dark:bg-dprimary hover:dark:bg-dprimary/70 dark:text-white dark:border-dborder text-[20px]"
            onClick={() => push('/')}
          />
          <Title level={3} className="m-0">
            Контакты
          </Title>
        </div>
        <Card>
          <Row gutter={32} justify="space-between" align="middle">
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <EnvironmentOutlined style={{ fontSize: 32, color: 'green' }} />
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">Наш адрес</Text>
                  <br />
                  <Text strong>
                    Ташкент,
                    <br />
                    Мирабадский р-он,
                    <br />
                    ул. Авлиё Ота, 7
                  </Text>
                </div>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <PhoneOutlined style={{ fontSize: 32, color: 'green' }} />
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">Контактный телефон</Text>
                  <br />
                  <Text strong>+998 (78) 148-44-44</Text>
                </div>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <SendOutlined style={{ fontSize: 32, color: 'green' }} />
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">telegram</Text>
                  <br />
                  <Text strong>@kansler_support_bot</Text>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  )
}

export default ContactsView
