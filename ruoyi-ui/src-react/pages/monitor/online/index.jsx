import React, { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Table,
  message
} from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { list, forceLogout } from '@/api/monitor/online'
import { parseTime } from '@/utils/ruoyi'
import { checkPermi } from '@/utils/permission'

const defaultQueryParams = {
  ipaddr: undefined,
  userName: undefined
}

const Online = () => {
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [listData, setListData] = useState([])
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [queryParams, setQueryParams] = useState({ ...defaultQueryParams })

  const getList = async () => {
    setLoading(true)
    try {
      const res = await list(queryParams)
      setListData(res.rows || [])
      setTotal(res.total || 0)
    } finally {
      setLoading(false)
    }
  }

  const handleQuery = () => {
    setPageNum(1)
    getList()
  }

  const resetQuery = () => {
    setQueryParams({ ...defaultQueryParams })
    setPageNum(1)
    getList()
  }

  const handleForceLogout = (row) => {
    Modal.confirm({
      title: '系统提示',
      content: `是否确认强退名称为"${row.userName}"的用户？`,
      onOk: async () => {
        await forceLogout(row.tokenId)
        message.success('强退成功')
        getList()
      }
    })
  }

  useEffect(() => {
    getList()
  }, [])

  const columns = useMemo(() => [
    {
      title: '序号',
      align: 'center',
      render: (_, __, index) => (pageNum - 1) * pageSize + index + 1
    },
    { title: '会话编号', dataIndex: 'tokenId', align: 'center', ellipsis: true },
    { title: '登录名称', dataIndex: 'userName', align: 'center', ellipsis: true },
    { title: '部门名称', dataIndex: 'deptName', align: 'center' },
    { title: '主机', dataIndex: 'ipaddr', align: 'center', ellipsis: true },
    { title: '登录地点', dataIndex: 'loginLocation', align: 'center', ellipsis: true },
    { title: '浏览器', dataIndex: 'browser', align: 'center' },
    { title: '操作系统', dataIndex: 'os', align: 'center' },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
      align: 'center',
      width: 180,
      render: (value) => <span>{parseTime(value)}</span>
    },
    {
      title: '操作',
      align: 'center',
      render: (_, record) => (
        checkPermi(['monitor:online:forceLogout']) ? (
          <Button size="small" type="link" icon={<DeleteOutlined />} danger onClick={() => handleForceLogout(record)}>
            强退
          </Button>
        ) : null
      )
    }
  ], [pageNum, pageSize])

  const pagedData = useMemo(() => {
    const start = (pageNum - 1) * pageSize
    return listData.slice(start, start + pageSize)
  }, [listData, pageNum, pageSize])

  return (
    <Card>
      <Form layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item label="登录地址">
          <Input
            placeholder="请输入登录地址"
            value={queryParams.ipaddr}
            onChange={(e) => setQueryParams({ ...queryParams, ipaddr: e.target.value })}
            onPressEnter={handleQuery}
          />
        </Form.Item>
        <Form.Item label="用户名称">
          <Input
            placeholder="请输入用户名称"
            value={queryParams.userName}
            onChange={(e) => setQueryParams({ ...queryParams, userName: e.target.value })}
            onPressEnter={handleQuery}
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" onClick={handleQuery}>搜索</Button>
            <Button onClick={resetQuery}>重置</Button>
          </Space>
        </Form.Item>
      </Form>

      <Table
        rowKey="tokenId"
        loading={loading}
        dataSource={pagedData}
        columns={columns}
        pagination={{
          total,
          current: pageNum,
          pageSize,
          showSizeChanger: true,
          onChange: (page, size) => {
            setPageNum(page)
            setPageSize(size)
          }
        }}
      />
    </Card>
  )
}

export default Online
