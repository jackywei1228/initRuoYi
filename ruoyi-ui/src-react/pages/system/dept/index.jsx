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
  TreeSelect,
  message
} from 'antd'
import {
  PlusOutlined,
  SortAscendingOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import RightToolbar from '@/components/RightToolbar'
import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild } from '@/api/system/dept'
import { getDicts } from '@/api/system/dict/data'
import { handleTree, parseTime } from '@/utils/ruoyi'
import { checkPermi } from '@/utils/permission'

const defaultQueryParams = {
  deptName: undefined,
  status: undefined
}

const defaultFormState = {
  deptId: undefined,
  parentId: 0,
  deptName: undefined,
  orderNum: undefined,
  leader: undefined,
  phone: undefined,
  email: undefined,
  status: '0'
}

const mapTreeSelectOptions = (items = []) => {
  return items.map((item) => ({
    title: item.deptName,
    value: item.deptId,
    key: item.deptId,
    children: item.children ? mapTreeSelectOptions(item.children) : []
  }))
}

const collectKeys = (nodes = []) => {
  const keys = []
  const travel = (list) => {
    list.forEach((item) => {
      keys.push(item.deptId)
      if (item.children && item.children.length > 0) {
        travel(item.children)
      }
    })
  }
  travel(nodes)
  return keys
}

const Dept = () => {
  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(true)
  const [deptList, setDeptList] = useState([])
  const [deptOptions, setDeptOptions] = useState([])
  const [queryParams, setQueryParams] = useState({ ...defaultQueryParams })
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [formData, setFormData] = useState({ ...defaultFormState })
  const [dictStatus, setDictStatus] = useState([])
  const [isExpandAll, setIsExpandAll] = useState(true)
  const [expandedKeys, setExpandedKeys] = useState([])
  const [form] = Form.useForm()

  const getList = async () => {
    setLoading(true)
    try {
      const res = await listDept(queryParams)
      const treeData = handleTree(res.data || [], 'deptId')
      setDeptList(treeData)
      if (isExpandAll) {
        setExpandedKeys(collectKeys(treeData))
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchDicts = async () => {
    const res = await getDicts('sys_normal_disable')
    setDictStatus(res.data || [])
  }

  const handleQuery = () => {
    getList()
  }

  const resetQuery = () => {
    setQueryParams({ ...defaultQueryParams })
    getList()
  }

  const toggleExpandAll = () => {
    const next = !isExpandAll
    setIsExpandAll(next)
    setExpandedKeys(next ? collectKeys(deptList) : [])
  }

  const handleAdd = async (row) => {
    const parentId = row?.deptId || 0
    const nextForm = { ...defaultFormState, parentId }
    setFormData(nextForm)
    form.setFieldsValue(nextForm)
    const res = await listDept()
    const treeData = handleTree(res.data || [], 'deptId')
    setDeptOptions(mapTreeSelectOptions(treeData))
    setOpen(true)
    setTitle('添加部门')
  }

  const handleUpdate = async (row) => {
    const res = await getDept(row.deptId)
    const nextForm = res.data || {}
    setFormData(nextForm)
    form.setFieldsValue(nextForm)
    const treeRes = await listDeptExcludeChild(row.deptId)
    const treeData = handleTree(treeRes.data || [], 'deptId')
    if (treeData.length === 0 && nextForm.parentId) {
      treeData.push({ deptId: nextForm.parentId, deptName: nextForm.parentName, children: [] })
    }
    setDeptOptions(mapTreeSelectOptions(treeData))
    setOpen(true)
    setTitle('修改部门')
  }

  const handleDelete = (row) => {
    Modal.confirm({
      title: '系统提示',
      content: `是否确认删除名称为"${row.deptName}"的数据项？`,
      onOk: async () => {
        await delDept(row.deptId)
        message.success('删除成功')
        getList()
      }
    })
  }

  const submitForm = async () => {
    const values = await form.validateFields()
    const payload = { ...formData, ...values }
    if (payload.deptId) {
      await updateDept(payload)
      message.success('修改成功')
    } else {
      await addDept(payload)
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
    {
      title: '部门名称',
      dataIndex: 'deptName',
      width: 260
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
      width: 200
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (value) => {
        const target = dictStatus.find((item) => item.value === value)
        return target ? target.label : value
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 200,
      render: (value) => <span>{parseTime(value)}</span>
    },
    {
      title: '操作',
      align: 'center',
      render: (_, record) => (
        <Space>
          {checkPermi(['system:dept:edit']) && (
            <Button size="small" type="link" icon={<EditOutlined />} onClick={() => handleUpdate(record)}>
              修改
            </Button>
          )}
          {checkPermi(['system:dept:add']) && (
            <Button size="small" type="link" icon={<PlusOutlined />} onClick={() => handleAdd(record)}>
              新增
            </Button>
          )}
          {checkPermi(['system:dept:remove']) && record.parentId !== 0 && (
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
          <Form.Item label="部门名称">
            <Input
              placeholder="请输入部门名称"
              value={queryParams.deptName}
              onChange={(e) => setQueryParams({ ...queryParams, deptName: e.target.value })}
              onPressEnter={handleQuery}
            />
          </Form.Item>
          <Form.Item label="状态">
            <Select
              placeholder="部门状态"
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
          {checkPermi(['system:dept:add']) && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd()}>
              新增
            </Button>
          )}
          <Button icon={<SortAscendingOutlined />} onClick={toggleExpandAll}>
            展开/折叠
          </Button>
        </Space>
        <RightToolbar showSearch={showSearch} onShowSearchChange={setShowSearch} onQuery={getList} />
      </Row>

      <Table
        rowKey="deptId"
        loading={loading}
        dataSource={deptList}
        columns={columns}
        pagination={false}
        expandable={{
          expandedRowKeys: expandedKeys,
          onExpandedRowsChange: (keys) => setExpandedKeys(keys)
        }}
      />

      <Modal
        title={title}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={submitForm}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={formData}>
          {formData.parentId !== 0 && (
            <Form.Item name="parentId" label="上级部门" rules={[{ required: true, message: '上级部门不能为空' }]}>
              <TreeSelect treeData={deptOptions} placeholder="选择上级部门" treeDefaultExpandAll />
            </Form.Item>
          )}
          <Row gutter={16}>
            <Form.Item
              name="deptName"
              label="部门名称"
              style={{ flex: 1 }}
              rules={[{ required: true, message: '部门名称不能为空' }]}
            >
              <Input placeholder="请输入部门名称" />
            </Form.Item>
            <Form.Item
              name="orderNum"
              label="显示排序"
              style={{ flex: 1 }}
              rules={[{ required: true, message: '显示排序不能为空' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Row>
          <Row gutter={16}>
            <Form.Item name="leader" label="负责人" style={{ flex: 1 }}>
              <Input placeholder="请输入负责人" maxLength={20} />
            </Form.Item>
            <Form.Item
              name="phone"
              label="联系电话"
              style={{ flex: 1 }}
              rules={[{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码' }]}
            >
              <Input placeholder="请输入联系电话" maxLength={11} />
            </Form.Item>
          </Row>
          <Row gutter={16}>
            <Form.Item
              name="email"
              label="邮箱"
              style={{ flex: 1 }}
              rules={[{ type: 'email', message: '请输入正确的邮箱地址' }]}
            >
              <Input placeholder="请输入邮箱" maxLength={50} />
            </Form.Item>
            <Form.Item name="status" label="部门状态" style={{ flex: 1 }}>
              <Radio.Group>
                {dictStatus.map((item) => (
                  <Radio key={item.value} value={item.value}>{item.label}</Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </Card>
  )
}

export default Dept
