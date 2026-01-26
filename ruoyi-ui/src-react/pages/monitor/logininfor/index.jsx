import React, { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  message
} from 'antd'
import {
  DeleteOutlined,
  DownloadOutlined,
  UnlockOutlined
} from '@ant-design/icons'
import RightToolbar from '@/components/RightToolbar'
import { list, delLogininfor, cleanLogininfor, unlockLogininfor } from '@/api/monitor/logininfor'
import { getDicts } from '@/api/system/dict/data'
import { addDateRange, parseTime } from '@/utils/ruoyi'
import { download } from '@/utils/request'
import { checkPermi } from '@/utils/permission'

const { RangePicker } = DatePicker

const defaultQueryParams = {
  pageNum: 1,
  pageSize: 10,
  ipaddr: undefined,
  userName: undefined,
  status: undefined,
  orderByColumn: 'loginTime',
  isAsc: 'descending'
}

const Logininfor = () => {
  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(true)
  const [listData, setListData] = useState([])
  const [total, setTotal] = useState(0)
  const [queryParams, setQueryParams] = useState({ ...defaultQueryParams })
  const [dateRange, setDateRange] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedNames, setSelectedNames] = useState([])
  const [dictStatus, setDictStatus] = useState([])

  const single = selectedRowKeys.length !== 1
  const multiple = selectedRowKeys.length === 0

  const getList = async (override = {}) => {
    setLoading(true)
    try {
      const params = addDateRange(
        { ...queryParams, ...override },
        dateRange.length ? dateRange.map(item => item.format('YYYY-MM-DD HH:mm:ss')) : []
      )
      const res = await list(params)
      setListData(res.rows || [])
      setTotal(res.total || 0)
    } finally {
      setLoading(false)
    }
  }

  const fetchDicts = async () => {
    const res = await getDicts('sys_common_status')
    setDictStatus(res.data || [])
  }

  const handleQuery = () => {
    const nextParams = { ...queryParams, pageNum: 1 }
    setQueryParams(nextParams)
    getList(nextParams)
  }

  const resetQuery = () => {
    setDateRange([])
    const nextParams = { ...defaultQueryParams }
    setQueryParams(nextParams)
    getList(nextParams)
  }

  const handleSelectionChange = (keys, rows) => {
    setSelectedRowKeys(keys)
    setSelectedNames(rows.map(item => item.userName))
  }

  const handleSortChange = (sorter) => {
    const nextParams = {
      ...queryParams,
      orderByColumn: sorter.field || 'loginTime',
      isAsc: sorter.order || 'descending'
    }
    setQueryParams(nextParams)
    getList(nextParams)
  }

  const handleDelete = (row) => {
    const infoIds = row?.infoId || selectedRowKeys.join(',')
    Modal.confirm({
      title: '系统提示',
      content: `是否确认删除访问编号为"${infoIds}"的数据项？`,
      onOk: async () => {
        await delLogininfor(infoIds)
        message.success('删除成功')
        getList()
      }
    })
  }

  const handleClean = () => {
    Modal.confirm({
      title: '系统提示',
      content: '是否确认清空所有登录日志数据项？',
      onOk: async () => {
        await cleanLogininfor()
        message.success('清空成功')
        getList()
      }
    })
  }

  const handleUnlock = () => {
    const username = selectedNames.join(',')
    Modal.confirm({
      title: '系统提示',
      content: `是否确认解锁用户"${username}"数据项?`,
      onOk: async () => {
        await unlockLogininfor(username)
        message.success(`用户${username}解锁成功`)
      }
    })
  }

  const handleExport = () => {
    download('monitor/logininfor/export', { ...queryParams }, `logininfor_${Date.now()}.xlsx`)
  }

  useEffect(() => {
    getList()
    fetchDicts()
  }, [])

  const columns = useMemo(() => [
    { title: '访问编号', dataIndex: 'infoId', align: 'center' },
    { title: '用户名称', dataIndex: 'userName', align: 'center', ellipsis: true, sorter: true },
    { title: '登录地址', dataIndex: 'ipaddr', align: 'center', width: 130 },
    { title: '登录地点', dataIndex: 'loginLocation', align: 'center', ellipsis: true },
    { title: '浏览器', dataIndex: 'browser', align: 'center', ellipsis: true },
    { title: '操作系统', dataIndex: 'os', align: 'center' },
    {
      title: '登录状态',
      dataIndex: 'status',
      align: 'center',
      render: (value) => {
        const target = dictStatus.find((item) => item.value === value)
        return target ? target.label : value
      }
    },
    { title: '操作信息', dataIndex: 'msg', align: 'center', ellipsis: true },
    { title: '登录日期', dataIndex: 'loginTime', align: 'center', width: 180, sorter: true, render: (value) => <span>{parseTime(value)}</span> }
  ], [dictStatus])

  return (
    <Card>
      {showSearch && (
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item label="登录地址">
            <Input
              placeholder="请输入登录地址"
              value={queryParams.ipaddr}
              onChange={(e) => setQueryParams({ ...queryParams, ipaddr: e.target.value })}
              onPressEnter={handleQuery}
              style={{ width: 240 }}
            />
          </Form.Item>
          <Form.Item label="用户名称">
            <Input
              placeholder="请输入用户名称"
              value={queryParams.userName}
              onChange={(e) => setQueryParams({ ...queryParams, userName: e.target.value })}
              onPressEnter={handleQuery}
              style={{ width: 240 }}
            />
          </Form.Item>
          <Form.Item label="状态">
            <Select
              placeholder="登录状态"
              allowClear
              value={queryParams.status}
              onChange={(value) => setQueryParams({ ...queryParams, status: value })}
              style={{ width: 240 }}
            >
              {dictStatus.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="登录时间">
            <RangePicker
              value={dateRange}
              onChange={(values) => setDateRange(values || [])}
              style={{ width: 240 }}
              showTime
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleQuery}>搜索</Button>
              <Button onClick={resetQuery}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      )}

      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Space>
          {checkPermi(['monitor:logininfor:remove']) && (
            <Button icon={<DeleteOutlined />} danger disabled={multiple} onClick={() => handleDelete()}>
              删除
            </Button>
          )}
          {checkPermi(['monitor:logininfor:remove']) && (
            <Button icon={<DeleteOutlined />} danger onClick={handleClean}>
              清空
            </Button>
          )}
          {checkPermi(['monitor:logininfor:unlock']) && (
            <Button icon={<UnlockOutlined />} disabled={single} onClick={handleUnlock}>
              解锁
            </Button>
          )}
          {checkPermi(['monitor:logininfor:export']) && (
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              导出
            </Button>
          )}
        </Space>
        <RightToolbar showSearch={showSearch} onShowSearchChange={setShowSearch} onQuery={getList} />
      </Row>

      <Table
        rowKey="infoId"
        loading={loading}
        dataSource={listData}
        columns={columns}
        rowSelection={{ selectedRowKeys, onChange: handleSelectionChange }}
        pagination={{
          total,
          current: queryParams.pageNum,
          pageSize: queryParams.pageSize,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            const nextParams = { ...queryParams, pageNum: page, pageSize }
            setQueryParams(nextParams)
            getList(nextParams)
          }
        }}
        onChange={(_, __, sorter) => handleSortChange(sorter)}
      />
    </Card>
  )
}

export default Logininfor
