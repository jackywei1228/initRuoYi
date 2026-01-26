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
  message
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined
} from '@ant-design/icons'
import RightToolbar from '@/components/RightToolbar'
import { listPost, getPost, delPost, addPost, updatePost } from '@/api/system/post'
import { getDicts } from '@/api/system/dict/data'
import { parseTime } from '@/utils/ruoyi'
import { download } from '@/utils/request'
import { checkPermi } from '@/utils/permission'

const defaultQueryParams = {
  pageNum: 1,
  pageSize: 10,
  postCode: undefined,
  postName: undefined,
  status: undefined
}

const defaultFormState = {
  postId: undefined,
  postCode: undefined,
  postName: undefined,
  postSort: 0,
  status: '0',
  remark: undefined
}

const Post = () => {
  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(true)
  const [postList, setPostList] = useState([])
  const [total, setTotal] = useState(0)
  const [queryParams, setQueryParams] = useState({ ...defaultQueryParams })
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
      const res = await listPost({ ...queryParams, ...override })
      setPostList(res.rows || [])
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
    setTitle('添加岗位')
  }

  const handleUpdate = async (row) => {
    const postId = row?.postId || selectedRowKeys
    const res = await getPost(postId)
    setFormData(res.data)
    form.setFieldsValue(res.data)
    setOpen(true)
    setTitle('修改岗位')
  }

  const handleDelete = (row) => {
    const postIds = row?.postId || selectedRowKeys.join(',')
    Modal.confirm({
      title: '系统提示',
      content: `是否确认删除岗位编号为"${postIds}"的数据项？`,
      onOk: async () => {
        await delPost(postIds)
        message.success('删除成功')
        getList()
      }
    })
  }

  const submitForm = async () => {
    const values = await form.validateFields()
    const payload = { ...formData, ...values }
    if (payload.postId) {
      await updatePost(payload)
      message.success('修改成功')
    } else {
      await addPost(payload)
      message.success('新增成功')
    }
    setOpen(false)
    getList()
  }

  const handleExport = () => {
    download('system/post/export', { ...queryParams }, `post_${Date.now()}.xlsx`)
  }

  useEffect(() => {
    getList()
    fetchDicts()
  }, [])

  const columns = useMemo(() => [
    { title: '岗位编号', dataIndex: 'postId', align: 'center' },
    { title: '岗位编码', dataIndex: 'postCode', align: 'center' },
    { title: '岗位名称', dataIndex: 'postName', align: 'center' },
    { title: '岗位排序', dataIndex: 'postSort', align: 'center' },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: (value) => {
        const target = dictStatus.find((item) => item.value === value)
        return target ? target.label : value
      }
    },
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
          {checkPermi(['system:post:edit']) && (
            <Button size="small" type="link" icon={<EditOutlined />} onClick={() => handleUpdate(record)}>
              修改
            </Button>
          )}
          {checkPermi(['system:post:remove']) && (
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
          <Form.Item label="岗位编码">
            <Input
              placeholder="请输入岗位编码"
              value={queryParams.postCode}
              onChange={(e) => setQueryParams({ ...queryParams, postCode: e.target.value })}
              onPressEnter={handleQuery}
            />
          </Form.Item>
          <Form.Item label="岗位名称">
            <Input
              placeholder="请输入岗位名称"
              value={queryParams.postName}
              onChange={(e) => setQueryParams({ ...queryParams, postName: e.target.value })}
              onPressEnter={handleQuery}
            />
          </Form.Item>
          <Form.Item label="状态">
            <Select
              placeholder="岗位状态"
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
          {checkPermi(['system:post:add']) && (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增
            </Button>
          )}
          {checkPermi(['system:post:edit']) && (
            <Button icon={<EditOutlined />} disabled={single} onClick={() => handleUpdate()}>
              修改
            </Button>
          )}
          {checkPermi(['system:post:remove']) && (
            <Button icon={<DeleteOutlined />} danger disabled={multiple} onClick={() => handleDelete()}>
              删除
            </Button>
          )}
          {checkPermi(['system:post:export']) && (
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              导出
            </Button>
          )}
        </Space>
        <RightToolbar showSearch={showSearch} onShowSearchChange={setShowSearch} onQuery={getList} />
      </Row>

      <Table
        rowKey="postId"
        loading={loading}
        dataSource={postList}
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
          <Form.Item name="postName" label="岗位名称" rules={[{ required: true, message: '岗位名称不能为空' }]}>
            <Input placeholder="请输入岗位名称" />
          </Form.Item>
          <Form.Item name="postCode" label="岗位编码" rules={[{ required: true, message: '岗位编码不能为空' }]}>
            <Input placeholder="请输入编码名称" />
          </Form.Item>
          <Form.Item name="postSort" label="岗位顺序" rules={[{ required: true, message: '岗位顺序不能为空' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="岗位状态">
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

export default Post
