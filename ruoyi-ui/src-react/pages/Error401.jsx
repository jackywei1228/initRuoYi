import React from 'react'
import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

const Error401 = () => {
  const navigate = useNavigate()
  return (
    <Result
      status="403"
      title="401"
      subTitle="抱歉，您没有访问权限。"
      extra={<Button type="primary" onClick={() => navigate('/')}>返回首页</Button>}
    />
  )
}

export default Error401
