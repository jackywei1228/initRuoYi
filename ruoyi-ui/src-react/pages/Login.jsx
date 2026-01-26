import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Input, Row, message } from 'antd'
import { LockOutlined, UserOutlined, SafetyOutlined } from '@ant-design/icons'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useUserStore } from '@/store'
import { getCodeImg } from '@/api/login'
import './Login.scss'

const Login = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [captcha, setCaptcha] = useState({ img: '', uuid: '' })
  const [loading, setLoading] = useState(false)
  const login = useUserStore(state => state.login)

  const fetchCaptcha = async () => {
    const res = await getCodeImg()
    setCaptcha({ img: res.img, uuid: res.uuid })
  }

  useEffect(() => {
    fetchCaptcha()
  }, [])

  const onFinish = async (values) => {
    setLoading(true)
    try {
      await login({
        username: values.username,
        password: values.password,
        code: values.code,
        uuid: captcha.uuid
      })
      message.success('登录成功')
      const redirect = searchParams.get('redirect') || '/'
      navigate(redirect)
    } catch (error) {
      message.error('登录失败，请检查账号信息')
      fetchCaptcha()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ruoyi-login">
      <Card className="ruoyi-login-card" bordered={false}>
        <div className="ruoyi-login-title">JK管理系统</div>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" rules={[{ required: true, message: '请输入账号' }]}>
            <Input prefix={<UserOutlined />} placeholder="账号" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Row gutter={12}>
            <Col span={16}>
              <Form.Item name="code" rules={[{ required: true, message: '请输入验证码' }]}>
                <Input prefix={<SafetyOutlined />} placeholder="验证码" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <div className="ruoyi-login-captcha" onClick={fetchCaptcha}>
                {captcha.img ? <img src={`data:image/gif;base64,${captcha.img}`} alt="captcha" /> : '加载中'}
              </div>
            </Col>
          </Row>
          <Button type="primary" htmlType="submit" loading={loading} block>
            登录
          </Button>
        </Form>
      </Card>
    </div>
  )
}

export default Login
