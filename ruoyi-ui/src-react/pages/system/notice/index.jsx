import React, { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
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
  DeleteOutlined
} from '@ant-design/icons'
import RightToolbar from '@/components/RightToolbar'
import { listNotice, getNotice, delNotice, addNotice, updateNotice } from '@/api/system/notice'
import { getDicts } from '@/api/system/dict/data'
import { parseTime } from '@/utils/ruoyi'
import { checkPermi } from '@/utils/permission'

const defaultQueryParams = {
  pageNum: 1,
  pageSize: 10,
  noticeTitle: undefined,
  createBy: undefined,
  status: undefined
}

const defaultFormState = {
  noticeId: undefined,
  noticeTitle: undefined,
  noticeType: undefined,
  noticeContent: undefined,
  status: '0'
}

const Notice = () => {
  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(true)
  const [noticeList, setNoticeList] = useState([])
  const [total, setTotal] = useState(0)
  const [queryParams, setQueryParams] = useState({ ...defaultQueryParams })
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [formData, setFormData] = useState({ ...defaultFormState })
  const [dictNoticeType, setDictNoticeType] = useState([])
  const [dictNoticeStatus, setDictNoticeStatus] = useState([])
  const [form] = Form.useForm()

  const single = selectedRowKeys.length !== 1
  const multiple = selectedRowKeys.length === 0

  const getList = async (override = {}) => {
    setLoading(true)
    try {
      const res = await listNotice({ ...queryParams, ...override })
      setNoticeList(res.rows || [])
      setTotal(res.total || 0)
    } finally {
      setLoading(false)
    }
  }

  const fetchDicts = async () => {
    const [typeRes, statusRes] = await Promise.all([
      getDicts('sys_notice_type'),
      getDicts('sys_notice_status')
    ])
    setDictNoticeType(typeRes.data || [])
    setDictNoticeStatus(statusRes.data || [])
  }

  const handleQuery = () => {
    const nextParams = { ...queryParams, pageNum: 1 }
    setQueryParams(nextParams)
    getList(nextParams)
  }

  const resetQuery = () => {
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
    setTitle('添加公告')
  }

  const handleUpdate = async (row) => {
    const noticeId = row?.noticeId || selectedRowKeys
    const res = await getNotice(noticeId)
    setFormData(res.data)
    form.setFieldsValue(res.data)
    setOpen(true)
    setTitle('修改公告')
  }

  const handleDelete = (row) => {
    const noticeIds = row?.noticeId || selectedRowKeys.join(',')
    Modal.confirm({
      title: '系统提示',
      content: `是否确认删除公告编号为"${noticeIds}"的数据项？`,
      onOk: async () => {
        await delNotice(noticeIds)
        message.success('删除成功')
        getList()
      }
    })
  }

  const submitForm = async () => {
    const values = await form.validateFields()
    const payload = { ...formData, ...values }
    if (payload.noticeId) {
      await updateNotice(payload)
      message.success('修改成功')
    } else {
      await addNotice(payload)
      message.success('新增成功')
    }
    setOpen(false)
    getList()
  }

  useEffect(() => {
    getList()
    fetchDicts()
  }, [])

  const columns = useMemo(() => [
    { title: '序号', dataIndex: 'noticeId', align: 'center', width: 100 },
    { title: '公告标题', dataIndex: 'noticeTitle', align: 'center', ellipsis: true },
    {
      title: '公告类型',
      dataIndex: 'noticeType',
      align: 'center',
      width: 100,
      render: (value) => {
        const target = dictNoticeType.find((item) => item.value === value)
        return target ? target.label : value
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      render: (value) => {
        const target = dictNoticeStatus.find((item) => item.value === value)
        return target ? target.label : value
      }
    },
    { title: '创建者', dataIndex: 'createBy', align: 'center', width: 100 },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 100,
      render: (value) => <span>{parseTime(value, '{y}-{m}-{d}')}</span>
    },
    {
      title: '操作',
      align: 'center',
      render: (_, record) => (
        <Space>
          {checkPermi(['system:notice:edit']) && (
            <Button size="small" type="link" icon={<EditOutlined />} onClick={() => handleUpdate(record)}>
              修改
            </Button>
          )}
          {checkPermi(['system:notice:remove']) && (
            <Button size="small" type="link" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record)}>
              删除
            </Button>
          )}
        </Space>
      )
    }
  ], [dictNoticeType, dictNoticeStatus])

  return (
    <Card>
      {showSearch && (
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item label="公告标题">
            <Input
              placeholder="请输入公告标题"
              value={queryParams.noticeTitle}
              onChange={(e) => setQueryParams({ ...queryParams, noticeTitle: e.target.value })}
              onPressEnter={handleQuery}
            />
          </Form.Item>
          <Form.Item label="操作人员">
            <Input
              placeholder="请输入操作人员"
              value={queryParams.createBy}
              onChange={(e) => setQueryParams({ ...queryParams, createBy: e.target.value })}
              onPressEnter={handleQuery}
            />
          </Form.Item>
          <Form.Item label="类型">
            <Select
              placeholder="公告类型"
              allowClear
              value={queryParams.noticeType}
              onChange={(value) => setQueryParams({ ...queryParams, noticeType: value })}
              style={{ width: 200 }}
            >
              {dictNoticeType.map((item) => (
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
          {checkPermi(['system:notice:add']) && (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增
            </Button>
          )}
          {checkPermi(['system:notice:edit']) && (
            <Button icon={<EditOutlined />} disabled={single} onClick={() => handleUpdate()}>
              修改
            </Button>
          )}
          {checkPermi(['system:notice:remove']) && (
            <Button icon={<DeleteOutlined />} danger disabled={multiple} onClick={() => handleDelete()}>
              删除
            </Button>
          )}
        </Space>
        <RightToolbar showSearch={showSearch} onShowSearchChange={setShowSearch} onQuery={getList} />
      </Row>

      <Table
        rowKey="noticeId"
        loading={loading}
        dataSource={noticeList}
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
        width={780}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={formData}>
          <Row gutter={16}>
            <Form.Item name="noticeTitle" label="公告标题" rules={[{ required: true, message: '公告标题不能为空' }]} style={{ flex: 1 }}>
              <Input placeholder="请输入公告标题" />
            </Form.Item>
            <Form.Item name="noticeType" label="公告类型" rules={[{ required: true, message: '公告类型不能为空' }]} style={{ flex: 1 }}>
              <Select placeholder="请选择公告类型">
                {dictNoticeType.map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Row>
          <Form.Item name="status" label="状态">
            <Radio.Group>
              {dictNoticeStatus.map((item) => (
                <Radio key={item.value} value={item.value}>{item.label}</Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item name="noticeContent" label="内容">
            <Input.TextArea rows={8} placeholder="请输入内容" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default Notice
