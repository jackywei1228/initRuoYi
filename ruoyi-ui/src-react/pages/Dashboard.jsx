import React from 'react'
import { Card, Col, Row, Statistic } from 'antd'
import { UserOutlined, FileTextOutlined, SettingOutlined, ThunderboltOutlined } from '@ant-design/icons'

const Dashboard = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic title="在线用户" value={1128} prefix={<UserOutlined />} />
        </Card>
      </Col>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic title="待办任务" value={87} prefix={<ThunderboltOutlined />} />
        </Card>
      </Col>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic title="系统日志" value={324} prefix={<FileTextOutlined />} />
        </Card>
      </Col>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic title="配置项" value={56} prefix={<SettingOutlined />} />
        </Card>
      </Col>
      <Col span={24}>
        <Card title="概览" bordered={false}>
          欢迎使用 JK 管理系统，当前正在进行 Ant Design React 版 UI 迁移。
        </Card>
      </Col>
    </Row>
  )
}

export default Dashboard
