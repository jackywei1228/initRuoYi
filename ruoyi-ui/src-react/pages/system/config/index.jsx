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
import RightToolbar from '@/components/RightToolbar'
import { listConfig, getConfig, delConfig, addConfig, updateConfig, refreshCache } from '@/api/system/config'
import { getDicts } from '@/api/system/dict/data'
import { addDateRange, parseTime } from '@/utils/ruoyi'
import { download } from '@/utils/request'
import { checkPermi } from '@/utils/permission'

const { RangePicker } = DatePicker

const defaultQueryParams = {
  pageNum: 1,
  pageSize: 10,
  configName: undefined,
  configKey: undefined,
  configType: undefined
}

const defaultFormState = {
  configId: undefined,
  configName: undefined,
  configKey: undefined,
  configValue: undefined,
  configType: 'Y',
  remark: undefined
}

const Config = () => {
  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(true)
  const [configList, setConfigList] = useState([])
  const [total, setTotal] = useState(0)
  const [queryParams, setQueryParams] = useState({ ...defaultQueryParams })
  const [dateRange, setDateRange] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [formData, setFormData] = useState({ ...defaultFormState })
  const [dictYesNo, setDictYesNo] = useState([])
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
      const res = await listConfig(params)
      setConfigList(res.rows || [])
      setTotal(res.total || 0)
    } finally {
      setLoading(false)
    }
  }

  const fetchDicts = async () => {
    const res = await getDicts('sys_yes_no')
    setDictYesNo(res.data || [])
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
    setTitle('添加参数')
  }

  const handleUpdate = async (row) => {
    const configId = row?.configId || selectedRowKeys
    const res = await getConfig(configId)
    setFormData(res.data)
    form.setFieldsValue(res.data)
    setOpen(true)
    setTitle('修改参数')
  }

  const handleDelete = (row) => {
    const configIds = row?.configId || selectedRowKeys.join(',')
    Modal.confirm({
      title: '系统提示',
      content: `是否确认删除参数编号为"${configIds}"的数据项？`,
      onOk: async () => {
        await delConfig(configIds)
        message.success('删除成功')
        getList()
      }
    })
  }

  const submitForm = async () => {
    const values = await form.validateFields()
    const payload = { ...formData, ...values }
    if (payload.configId) {
      await updateConfig(payload)
      message.success('修改成功')
    } else {
      await addConfig(payload)
      message.success('新增成功')
    }
    setOpen(false)
    getList()
  }

  const handleExport = () => {
    download('system/config/export', { ...queryParams }, `config_${Date.now()}.xlsx`)
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
    { title: '参数主键', dataIndex: 'configId', align: 'center' },
    { title: '参数名称', dataIndex: 'configName', align: 'center', ellipsis: true },
    { title: '参数键名', dataIndex: 'configKey', align: 'center', ellipsis: true },
    { title: '参数键值', dataIndex: 'configValue', align: 'center', ellipsis: true },
    {
      title: '系统内置',
      dataIndex: 'configType',
      align: 'center',
      render: (value) => {
        const target = dictYesNo.find((item) => item.value === value)
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
          {checkPermi(['system:config:edit']) && (
            <Button size="small" type="link" icon={<EditOutlined />} onClick={() => handleUpdate(record)}>
              修改
            </Button>
          )}
          {checkPermi(['system:config:remove']) && (
            <Button size="small" type="link" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record)}>
              删除
            </Button>
          )}
        </Space>
      )
    }
  ], [dictYesNo])

  return (
    <Card>
      {showSearch && (
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item label="参数名称">
            <Input
              placeholder="请输入参数名称"
              value={queryParams.configName}
              onChange={(e) => setQueryParams({ ...queryParams, configName: e.target.value })}
              onPressEnter={handleQuery}
              style={{ width: 240 }}
            />
          </Form.Item>
          <Form.Item label="参数键名">
            <Input
              placeholder="请输入参数键名"
              value={queryParams.configKey}
              onChange={(e) => setQueryParams({ ...queryParams, configKey: e.target.value })}
              onPressEnter={handleQuery}
              style={{ width: 240 }}
            />
          </Form.Item>
          <Form.Item label="系统内置">
            <Select
              placeholder="系统内置"
              allowClear
              value={queryParams.configType}
              onChange={(value) => setQueryParams({ ...queryParams, configType: value })}
              style={{ width: 240 }}
            >
              {dictYesNo.map((item) => (
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
          {checkPermi(['system:config:add']) && (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增
            </Button>
          )}
          {checkPermi(['system:config:edit']) && (
            <Button icon={<EditOutlined />} disabled={single} onClick={() => handleUpdate()}>
              修改
            </Button>
          )}
          {checkPermi(['system:config:remove']) && (
            <Button icon={<DeleteOutlined />} danger disabled={multiple} onClick={() => handleDelete()}>
              删除
            </Button>
          )}
          {checkPermi(['system:config:export']) && (
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              导出
            </Button>
          )}
          {checkPermi(['system:config:remove']) && (
            <Button icon={<ReloadOutlined />} danger onClick={handleRefreshCache}>
              刷新缓存
            </Button>
          )}
        </Space>
        <RightToolbar showSearch={showSearch} onShowSearchChange={setShowSearch} onQuery={getList} />
      </Row>

      <Table
        rowKey="configId"
        loading={loading}
        dataSource={configList}
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
          <Form.Item name="configName" label="参数名称" rules={[{ required: true, message: '参数名称不能为空' }]}>
            <Input placeholder="请输入参数名称" />
          </Form.Item>
          <Form.Item name="configKey" label="参数键名" rules={[{ required: true, message: '参数键名不能为空' }]}>
            <Input placeholder="请输入参数键名" />
          </Form.Item>
          <Form.Item name="configValue" label="参数键值" rules={[{ required: true, message: '参数键值不能为空' }]}>
            <Input.TextArea placeholder="请输入参数键值" />
          </Form.Item>
          <Form.Item name="configType" label="系统内置">
            <Radio.Group>
              {dictYesNo.map((item) => (
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

export default Config
