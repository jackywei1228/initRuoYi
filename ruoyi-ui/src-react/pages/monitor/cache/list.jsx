import React, { useEffect, useMemo, useState } from 'react'
import { Button, Card, Col, Form, Input, Row, Table, message } from 'antd'
import { ReloadOutlined, DeleteOutlined } from '@ant-design/icons'
import {
  listCacheName,
  listCacheKey,
  getCacheValue,
  clearCacheName,
  clearCacheKey,
  clearCacheAll
} from '@/api/monitor/cache'

const CacheList = () => {
  const [cacheNames, setCacheNames] = useState([])
  const [cacheKeys, setCacheKeys] = useState([])
  const [cacheForm, setCacheForm] = useState({})
  const [loading, setLoading] = useState(false)
  const [subLoading, setSubLoading] = useState(false)
  const [nowCacheName, setNowCacheName] = useState('')

  const getCacheNames = async () => {
    setLoading(true)
    try {
      const res = await listCacheName()
      setCacheNames(res.data || [])
    } finally {
      setLoading(false)
    }
  }

  const refreshCacheNames = () => {
    getCacheNames()
    message.success('刷新缓存列表成功')
  }

  const handleClearCacheName = async (row) => {
    await clearCacheName(row.cacheName)
    message.success(`清理缓存名称[${row.cacheName}]成功`)
    getCacheKeys(row)
  }

  const getCacheKeys = async (row) => {
    const cacheName = row?.cacheName || nowCacheName
    if (!cacheName) return
    setSubLoading(true)
    try {
      const res = await listCacheKey(cacheName)
      setCacheKeys(res.data || [])
      setNowCacheName(cacheName)
    } finally {
      setSubLoading(false)
    }
  }

  const refreshCacheKeys = () => {
    getCacheKeys()
    message.success('刷新键名列表成功')
  }

  const handleClearCacheKey = async (cacheKey) => {
    await clearCacheKey(cacheKey)
    message.success(`清理缓存键名[${cacheKey}]成功`)
    getCacheKeys()
  }

  const handleCacheValue = async (cacheKey) => {
    const res = await getCacheValue(nowCacheName, cacheKey)
    setCacheForm(res.data || {})
  }

  const handleClearCacheAll = async () => {
    await clearCacheAll()
    message.success('清理全部缓存成功')
  }

  useEffect(() => {
    getCacheNames()
  }, [])

  const nameColumns = useMemo(() => [
    {
      title: '序号',
      width: 60,
      align: 'center',
      render: (_, __, index) => index + 1
    },
    {
      title: '缓存名称',
      dataIndex: 'cacheName',
      align: 'center',
      ellipsis: true,
      render: (value) => value.replace(':', '')
    },
    { title: '备注', dataIndex: 'remark', align: 'center', ellipsis: true },
    {
      title: '操作',
      width: 60,
      align: 'center',
      render: (_, record) => (
        <Button size="small" type="link" icon={<DeleteOutlined />} onClick={() => handleClearCacheName(record)} />
      )
    }
  ], [])

  const keyColumns = useMemo(() => [
    {
      title: '序号',
      width: 60,
      align: 'center',
      render: (_, __, index) => index + 1
    },
    {
      title: '缓存键名',
      align: 'center',
      ellipsis: true,
      render: (_, record) => record.replace(nowCacheName, '')
    },
    {
      title: '操作',
      width: 60,
      align: 'center',
      render: (_, record) => (
        <Button size="small" type="link" icon={<DeleteOutlined />} onClick={() => handleClearCacheKey(record)} />
      )
    }
  ], [nowCacheName])

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card
          title="缓存列表"
          extra={<Button type="text" icon={<ReloadOutlined />} onClick={refreshCacheNames} />}
          style={{ height: 'calc(100vh - 125px)' }}
        >
          <Table
            rowKey="cacheName"
            loading={loading}
            dataSource={cacheNames}
            columns={nameColumns}
            pagination={false}
            size="small"
            onRow={(record) => ({ onClick: () => getCacheKeys(record) })}
            scroll={{ y: 400 }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card
          title="键名列表"
          extra={<Button type="text" icon={<ReloadOutlined />} onClick={refreshCacheKeys} />}
          style={{ height: 'calc(100vh - 125px)' }}
        >
          <Table
            rowKey={(record) => record}
            loading={subLoading}
            dataSource={cacheKeys}
            columns={keyColumns}
            pagination={false}
            size="small"
            onRow={(record) => ({ onClick: () => handleCacheValue(record) })}
            scroll={{ y: 400 }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card
          title="缓存内容"
          extra={<Button type="text" icon={<ReloadOutlined />} onClick={handleClearCacheAll}>清理全部</Button>}
          style={{ height: 'calc(100vh - 125px)' }}
        >
          <Form layout="vertical">
            <Form.Item label="缓存名称">
              <Input value={cacheForm.cacheName} readOnly />
            </Form.Item>
            <Form.Item label="缓存键名">
              <Input value={cacheForm.cacheKey} readOnly />
            </Form.Item>
            <Form.Item label="缓存内容">
              <Input.TextArea value={cacheForm.cacheValue} rows={8} readOnly />
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  )
}

export default CacheList
