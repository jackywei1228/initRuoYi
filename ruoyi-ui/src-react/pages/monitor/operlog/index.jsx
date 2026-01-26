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
  Tag,
  message
} from 'antd'
import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined
} from '@ant-design/icons'
import RightToolbar from '@/components/RightToolbar'
import { list, delOperlog, cleanOperlog } from '@/api/monitor/operlog'
import { getDicts } from '@/api/system/dict/data'
import { addDateRange, parseTime } from '@/utils/ruoyi'
import { download } from '@/utils/request'
import { checkPermi } from '@/utils/permission'

const { RangePicker } = DatePicker

const defaultQueryParams = {
  pageNum: 1,
  pageSize: 10,
  operIp: undefined,
  title: undefined,
  operName: undefined,
  businessType: undefined,
  status: undefined,
  orderByColumn: 'operTime',
  isAsc: 'descending'
}

const Operlog = () => {
  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(true)
  const [listData, setListData] = useState([])
  const [total, setTotal] = useState(0)
  const [queryParams, setQueryParams] = useState({ ...defaultQueryParams })
  const [dateRange, setDateRange] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [dictOperType, setDictOperType] = useState([])
  const [dictStatus, setDictStatus] = useState([])
  const [open, setOpen] = useState(false)
  const [detail, setDetail] = useState({})

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
    const [typeRes, statusRes] = await Promise.all([
      getDicts('sys_oper_type'),
      getDicts('sys_common_status')
    ])
    setDictOperType(typeRes.data || [])
    setDictStatus(statusRes.data || [])
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

  const handleSelectionChange = (keys) => {
    setSelectedRowKeys(keys)
  }

  const handleSortChange = (sorter) => {
    const nextParams = {
      ...queryParams,
      orderByColumn: sorter.field || 'operTime',
      isAsc: sorter.order || 'descending'
    }
    setQueryParams(nextParams)
    getList(nextParams)
  }

  const handleView = (row) => {
    setDetail(row)
    setOpen(true)
  }

  const handleDelete = (row) => {
    const operIds = row?.operId || selectedRowKeys.join(',')
    Modal.confirm({
      title: '系统提示',
      content: `是否确认删除日志编号为"${operIds}"的数据项？`,
      onOk: async () => {
        await delOperlog(operIds)
        message.success('删除成功')
        getList()
      }
    })
  }

  const handleClean = () => {
    Modal.confirm({
      title: '系统提示',
      content: '是否确认清空所有操作日志数据项？',
      onOk: async () => {
        await cleanOperlog()
        message.success('清空成功')
        getList()
      }
    })
  }

  const handleExport = () => {
    download('monitor/operlog/export', { ...queryParams }, `operlog_${Date.now()}.xlsx`)
  }

  useEffect(() => {
    getList()
    fetchDicts()
  }, [])

  const columns = useMemo(() => [
    { title: '日志编号', dataIndex: 'operId', align: 'center' },
    { title: '系统模块', dataIndex: 'title', align: 'center', ellipsis: true },
    {
      title: '操作类型',
      dataIndex: 'businessType',
      align: 'center',
      render: (value) => {
        const target = dictOperType.find((item) => item.value === value)
        return target ? target.label : value
      }
    },
    { title: '操作人员', dataIndex: 'operName', align: 'center', width: 110, sorter: true },
    { title: '操作地址', dataIndex: 'operIp', align: 'center', width: 130 },
    { title: '操作地点', dataIndex: 'operLocation', align: 'center', ellipsis: true },
    {
      title: '操作状态',
      dataIndex: 'status',
      align: 'center',
      render: (value) => {
        const target = dictStatus.find((item) => item.value === value)
        return target ? target.label : value
      }
    },
    { title: '操作日期', dataIndex: 'operTime', align: 'center', width: 160, sorter: true, render: (value) => <span>{parseTime(value)}</span> },
    { title: '消耗时间', dataIndex: 'costTime', align: 'center', width: 110, sorter: true, render: (value) => `${value}毫秒` },
    {
      title: '操作',
      align: 'center',
      render: (_, record) => (
        <Space>
          {checkPermi(['monitor:operlog:query']) && (
            <Button size="small" type="link" icon={<EyeOutlined />} onClick={() => handleView(record)}>
              详细
            </Button>
          )}
        </Space>
      )
    }
  ], [dictOperType, dictStatus])

  return (
    <Card>
      {showSearch && (
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item label="操作地址">
            <Input
              placeholder="请输入操作地址"
              value={queryParams.operIp}
              onChange={(e) => setQueryParams({ ...queryParams, operIp: e.target.value })}
              onPressEnter={handleQuery}
              style={{ width: 240 }}
            />
          </Form.Item>
          <Form.Item label="系统模块">
            <Input
              placeholder="请输入系统模块"
              value={queryParams.title}
              onChange={(e) => setQueryParams({ ...queryParams, title: e.target.value })}
              onPressEnter={handleQuery}
              style={{ width: 240 }}
            />
          </Form.Item>
          <Form.Item label="操作人员">
            <Input
              placeholder="请输入操作人员"
              value={queryParams.operName}
              onChange={(e) => setQueryParams({ ...queryParams, operName: e.target.value })}
              onPressEnter={handleQuery}
              style={{ width: 240 }}
            />
          </Form.Item>
          <Form.Item label="类型">
            <Select
              placeholder="操作类型"
              allowClear
              value={queryParams.businessType}
              onChange={(value) => setQueryParams({ ...queryParams, businessType: value })}
              style={{ width: 240 }}
            >
              {dictOperType.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="状态">
            <Select
              placeholder="操作状态"
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
          <Form.Item label="操作时间">
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
          {checkPermi(['monitor:operlog:remove']) && (
            <Button icon={<DeleteOutlined />} danger disabled={multiple} onClick={() => handleDelete()}>
              删除
            </Button>
          )}
          {checkPermi(['monitor:operlog:remove']) && (
            <Button icon={<DeleteOutlined />} danger onClick={handleClean}>
              清空
            </Button>
          )}
          {checkPermi(['monitor:operlog:export']) && (
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              导出
            </Button>
          )}
        </Space>
        <RightToolbar showSearch={showSearch} onShowSearchChange={setShowSearch} onQuery={getList} />
      </Row>

      <Table
        rowKey="operId"
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

      <Modal
        title="操作日志详细"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={800}
      >
        <Row gutter={16}>
          <div style={{ width: '100%', marginBottom: 16 }}>
            <div>操作模块：{detail.title} / {dictOperType.find(item => item.value === detail.businessType)?.label || detail.businessType}</div>
            <div>登录信息：{detail.operName} / {detail.operIp} / {detail.operLocation}</div>
          </div>
          <div style={{ width: '100%', marginBottom: 16 }}>
            <div>请求地址：{detail.operUrl}</div>
            <div>请求方式：{detail.requestMethod}</div>
          </div>
          <div style={{ width: '100%', marginBottom: 16 }}>操作方法：{detail.method}</div>
          <div style={{ width: '100%', marginBottom: 16 }}>请求参数：{detail.operParam}</div>
          <div style={{ width: '100%', marginBottom: 16 }}>返回参数：{detail.jsonResult}</div>
          <div style={{ width: '100%', marginBottom: 16 }}>
            操作状态：{detail.status === 0 ? '正常' : detail.status === 1 ? '失败' : ''}
          </div>
          <div style={{ width: '100%', marginBottom: 16 }}>消耗时间：{detail.costTime}毫秒</div>
          <div style={{ width: '100%', marginBottom: 16 }}>操作时间：{parseTime(detail.operTime)}</div>
          {detail.status === 1 && (
            <div style={{ width: '100%', marginBottom: 16 }}>异常信息：{detail.errorMsg}</div>
          )}
        </Row>
      </Modal>
    </Card>
  )
}

export default Operlog
