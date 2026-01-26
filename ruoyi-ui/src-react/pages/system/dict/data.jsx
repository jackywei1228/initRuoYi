import React, { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Table,
  Tag,
  message
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  CloseOutlined
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import RightToolbar from '@/components/RightToolbar'
import { listData, getData, delData, addData, updateData } from '@/api/system/dict/data'
import { optionselect as getDictOptionselect, getType } from '@/api/system/dict/type'
import { getDicts } from '@/api/system/dict/data'
import { parseTime } from '@/utils/ruoyi'
import { download } from '@/utils/request'
import { checkPermi } from '@/utils/permission'

const listClassOptions = [
  { value: 'default', label: '默认' },
  { value: 'primary', label: '主要' },
  { value: 'success', label: '成功' },
  { value: 'info', label: '信息' },
  { value: 'warning', label: '警告' },
  { value: 'danger', label: '危险' }
]

const defaultQueryParams = {
  pageNum: 1,
  pageSize: 10,
  dictType: undefined,
  dictLabel: undefined,
  status: undefined
}

const defaultFormState = {
  dictCode: undefined,
  dictLabel: undefined,
  dictValue: undefined,
  cssClass: undefined,
  listClass: 'default',
  dictSort: 0,
  status: '0',
  remark: undefined,
  dictType: undefined
}

const DictData = () => {
  const navigate = useNavigate()
  const { dictId } = useParams()
  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(true)
  const [dataList, setDataList] = useState([])
  const [total, setTotal] = useState(0)
  const [queryParams, setQueryParams] = useState({ ...defaultQueryParams })
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [formData, setFormData] = useState({ ...defaultFormState })
  const [dictStatus, setDictStatus] = useState([])
  const [typeOptions, setTypeOptions] = useState([])
  const [defaultDictType, setDefaultDictType] = useState('')
  const [form] = Form.useForm()

  const single = selectedRowKeys.length !== 1
  const multiple = selectedRowKeys.length === 0

  const getTypeInfo = async (id) => {
    const res = await getType(id)
    const dictType = res.data?.dictType
    setQueryParams(prev => ({ ...prev, dictType }))
    setDefaultDictType(dictType)
    return dictType
  }

  const getTypeList = async () => {
    const res = await getDictOptionselect()
    setTypeOptions(res.data || [])
  }

  const getList = async (override = {}) => {
    setLoading(true)
    try {
      const res = await listData({ ...queryParams, ...override })
      setDataList(res.rows || [])
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
    const nextParams = { ...defaultQueryParams, dictType: defaultDictType }
    setQueryParams(nextParams)
    getList(nextParams)
  }

  const handleClose = () => {
    navigate('/system/dict')
  }

  const handleSelectionChange = (keys) => {
    setSelectedRowKeys(keys)
  }

  const handleAdd = () => {
    const nextForm = { ...defaultFormState, dictType: queryParams.dictType }
    setFormData(nextForm)
    form.setFieldsValue(nextForm)
    setOpen(true)
    setTitle('添加字典数据')
  }

  const handleUpdate = async (row) => {
    const dictCode = row?.dictCode || selectedRowKeys
    const res = await getData(dictCode)
    setFormData(res.data)
    form.setFieldsValue(res.data)
    setOpen(true)
    setTitle('修改字典数据')
  }

  const handleDelete = (row) => {
    const dictCodes = row?.dictCode || selectedRowKeys.join(',')
    Modal.confirm({
      title: '系统提示',
      content: `是否确认删除字典编码为"${dictCodes}"的数据项？`,
      onOk: async () => {
        await delData(dictCodes)
        message.success('删除成功')
        getList()
      }
    })
  }

  const submitForm = async () => {
    const values = await form.validateFields()
    const payload = { ...formData, ...values }
    if (payload.dictCode) {
      await updateData(payload)
      message.success('修改成功')
    } else {
      await addData(payload)
      message.success('新增成功')
    }
    setOpen(false)
    getList()
  }

  const handleExport = () => {
    download('system/dict/data/export', { ...queryParams }, `data_${Date.now()}.xlsx`)
  }

  useEffect(() => {
    getTypeInfo(dictId).then((type) => {
      if (type) {
        getList({ dictType: type })
      }
    })
    getTypeList()
    fetchDicts()
  }, [dictId])

  const columns = useMemo(() => [
    { title: '字典编码', dataIndex: 'dictCode', align: 'center' },
    {
      title: '字典标签',
      dataIndex: 'dictLabel',
      align: 'center',
      render: (_, record) => {
        if ((record.listClass === '' || record.listClass === 'default') && (!record.cssClass)) {
          return <span>{record.dictLabel}</span>
        }
        const color = record.listClass === 'primary' ? '' : record.listClass
        return <Tag className={record.cssClass} color={color}>{record.dictLabel}</Tag>
      }
    },
    { title: '字典键值', dataIndex: 'dictValue', align: 'center' },
    { title: '字典排序', dataIndex: 'dictSort', align: 'center' },
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
  ], [dictStatus])

  return (
    <Card>
      {showSearch && (
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item label="字典名称">
            <Select
              value={queryParams.dictType}
              onChange={(value) => {
                const nextParams = { ...queryParams, dictType: value, pageNum: 1 }
                setQueryParams(nextParams)
                getList(nextParams)
              }}
              style={{ width: 240 }}
            >
              {typeOptions.map((item) => (
                <Select.Option key={item.dictId} value={item.dictType}>
                  {item.dictName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="字典标签">
            <Input
              placeholder="请输入字典标签"
              value={queryParams.dictLabel}
              onChange={(e) => setQueryParams({ ...queryParams, dictLabel: e.target.value })}
              onPressEnter={handleQuery}
            />
          </Form.Item>
          <Form.Item label="状态">
            <Select
              placeholder="数据状态"
              allowClear
              value={queryParams.status}
              onChange={(value) => setQueryParams({ ...queryParams, status: value })}
              style={{ width: 200 }}
            >
              {dictStatus.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
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
          <Button icon={<CloseOutlined />} onClick={handleClose}>
            关闭
          </Button>
        </Space>
        <RightToolbar showSearch={showSearch} onShowSearchChange={setShowSearch} onQuery={getList} />
      </Row>

      <Table
        rowKey="dictCode"
        loading={loading}
        dataSource={dataList}
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
          <Form.Item label="字典类型">
            <Input value={formData.dictType} disabled />
          </Form.Item>
          <Form.Item name="dictLabel" label="数据标签" rules={[{ required: true, message: '数据标签不能为空' }]}>
            <Input placeholder="请输入数据标签" />
          </Form.Item>
          <Form.Item name="dictValue" label="数据键值" rules={[{ required: true, message: '数据键值不能为空' }]}>
            <Input placeholder="请输入数据键值" />
          </Form.Item>
          <Form.Item name="cssClass" label="样式属性">
            <Input placeholder="请输入样式属性" />
          </Form.Item>
          <Form.Item name="dictSort" label="显示排序" rules={[{ required: true, message: '数据顺序不能为空' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="listClass" label="回显样式">
            <Select>
              {listClassOptions.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}({item.value})
                </Select.Option>
              ))}
            </Select>
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

export default DictData
