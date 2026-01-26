import React, { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Table,
  message
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import RightToolbar from '@/components/RightToolbar'
import { listType, getType, delType, addType, updateType, refreshCache } from '@/api/system/dict/type'
import { getDicts } from '@/api/system/dict/data'
import { addDateRange, parseTime } from '@/utils/ruoyi'
import { download } from '@/utils/request'
import { checkPermi } from '@/utils/permission'

const { RangePicker } = DatePicker

const defaultQueryParams = {
  pageNum: 1,
  pageSize: 10,
  dictName: undefined,
  dictType: undefined,
  status: undefined
}

const defaultFormState = {
  dictId: undefined,
  dictName: undefined,
  dictType: undefined,
  status: '0',
  remark: undefined
}

const DictType = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(true)
  const [typeList, setTypeList] = useState([])
  const [total, setTotal] = useState(0)
  const [queryParams, setQueryParams] = useState({ ...defaultQueryParams })
  const [dateRange, setDateRange] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [formData, setFormData] = useState({ ...defaultFormState })
  const [dictStatus, setDictStatus] = useState([])
  const [form] = Form.useForm()

  const single = selectedRowKeys.length !== 1
  const multiple = selectedRowKeys.length === 0

  const getList = async (override = {}) => {
    setLoading(true)
    try {
      const params = addDateRange(
        { ...queryParams, ...override },
        dateRange.length ? dateRange.map(item => item.format('YYYY-MM-DD')) : []
      )
      const res = await listType(params)
      setTypeList(res.rows || [])
      setTotal(res.total || 0)
    } finally {
      setLoading(false)
    }
  }

  const fetchDicts = async () => {
    const res = await getDicts('sys_normal_disable')
    setDictStatus(res.data || [])
  }

  const handleQuery = () => {
    const nextParams = { ...queryParams, pageNum: 1 }
    setQueryParams(nextParams)
    getList(nextParams)
  }

  const resetQuery = () => {
    setDateRange([])
    setQueryParams({ ...defaultQueryParams })
    getList({ ...defaultQueryParams })
  }

  const handleSelectionChange = (keys) => {
    setSelectedRowKeys(keys)
  }

  const handleAdd = () => {
    const nextForm = { ...defaultFormState }
    setFormData(nextForm)
    form.setFieldsValue(nextForm)
    setOpen(true)
    setTitle('添加字典类型')
  }

  const handleUpdate = async (row) => {
    const dictId = row?.dictId || selectedRowKeys
    const res = await getType(dictId)
    setFormData(res.data)
    form.setFieldsValue(res.data)
    setOpen(true)
    setTitle('修改字典类型')
  }

  const handleDelete = (row) => {
    const dictIds = row?.dictId || selectedRowKeys.join(',')
    Modal.confirm({
      title: '系统提示',
      content: `是否确认删除字典编号为"${dictIds}"的数据项？`,
      onOk: async () => {
        await delType(dictIds)
        message.success('删除成功')
        getList()
      }
    })
  }

  const submitForm = async () => {
    const values = await form.validateFields()
    const payload = { ...formData, ...values }
    if (payload.dictId) {
      await updateType(payload)
      message.success('修改成功')
    } else {
      await addType(payload)
      message.success('新增成功')
    }
    setOpen(false)
    getList()
  }

  const handleExport = () => {
    download('system/dict/type/export', { ...queryParams }, `type_${Date.now()}.xlsx`)
  }

  const handleRefreshCache = async () => {
    await refreshCache()
    message.success('刷新成功')
  }

  useEffect(() => {
    getList()
    fetchDicts()
  }, [])

  const columns = useMemo(() => [
    { title: '字典编号', dataIndex: 'dictId', align: 'center' },
    { title: '字典名称', dataIndex: 'dictName', align: 'center', ellipsis: true },
    {
      title: '字典类型',
      dataIndex: 'dictType',
      align: 'center',
      ellipsis: true,
      render: (_, record) => (
        <Button type="link" onClick={() => navigate(`/system/dict-data/index/${record.dictId}`)}>
          {record.dictType}
        </Button>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: (value) => {
        const target = dictStatus.find((item) => item.value === value)
        return target ? target.label : value
      }
    },
    { title: '备注', dataIndex: 'remark', align: 'center', ellipsis: true },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 180,
      render: (value) => <span>{parseTime(value)}</span>
    },
    {
      title: '操作',
      align: 'center',
      render: (_, record) => (
        <Space>
          {checkPermi(['system:dict:edit']) && (
            <Button size="small" type="link" icon={<EditOutlined />} onClick={() => handleUpdate(record)}>
              修改
            </Button>
          )}
          {checkPermi(['system:dict:remove']) && (
            <Button size="small" type="link" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record)}>
              删除
            </Button>
          )}
        </Space>
      )
    }
  ], [dictStatus, navigate])

  return (
    <Card>
      {showSearch && (
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item label="字典名称">
            <Input
              placeholder="请输入字典名称"
              value={queryParams.dictName}
              onChange={(e) => setQueryParams({ ...queryParams, dictName: e.target.value })}
              onPressEnter={handleQuery}
              style={{ width: 240 }}
            />
          </Form.Item>
          <Form.Item label="字典类型">
            <Input
              placeholder="请输入字典类型"
              value={queryParams.dictType}
              onChange={(e) => setQueryParams({ ...queryParams, dictType: e.target.value })}
              onPressEnter={handleQuery}
              style={{ width: 240 }}
            />
          </Form.Item>
          <Form.Item label="状态">
            <Select
              placeholder="字典状态"
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
          <Form.Item label="创建时间">
            <RangePicker value={dateRange} onChange={(values) => setDateRange(values || [])} style={{ width: 240 }} />
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
          {checkPermi(['system:dict:add']) && (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增
            </Button>
          )}
          {checkPermi(['system:dict:edit']) && (
            <Button icon={<EditOutlined />} disabled={single} onClick={() => handleUpdate()}>
              修改
            </Button>
          )}
          {checkPermi(['system:dict:remove']) && (
            <Button icon={<DeleteOutlined />} danger disabled={multiple} onClick={() => handleDelete()}>
              删除
            </Button>
          )}
          {checkPermi(['system:dict:export']) && (
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              导出
            </Button>
          )}
          {checkPermi(['system:dict:remove']) && (
            <Button icon={<ReloadOutlined />} danger onClick={handleRefreshCache}>
              刷新缓存
            </Button>
          )}
        </Space>
        <RightToolbar showSearch={showSearch} onShowSearchChange={setShowSearch} onQuery={getList} />
      </Row>

      <Table
        rowKey="dictId"
        loading={loading}
        dataSource={typeList}
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
      />

      <Modal
        title={title}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={submitForm}
        width={520}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={formData}>
          <Form.Item name="dictName" label="字典名称" rules={[{ required: true, message: '字典名称不能为空' }]}>
            <Input placeholder="请输入字典名称" />
          </Form.Item>
          <Form.Item name="dictType" label="字典类型" rules={[{ required: true, message: '字典类型不能为空' }]}>
            <Input placeholder="请输入字典类型" />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Radio.Group>
              {dictStatus.map((item) => (
                <Radio key={item.value} value={item.value}>{item.label}</Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea placeholder="请输入内容" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default DictType
