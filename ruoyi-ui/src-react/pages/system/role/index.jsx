import React, { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  Tree,
  message
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  MoreOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons'
import RightToolbar from '@/components/RightToolbar'
import {
  listRole,
  getRole,
  delRole,
  addRole,
  updateRole,
  dataScope,
  changeRoleStatus,
  deptTreeSelect
} from '@/api/system/role'
import { treeselect as menuTreeselect, roleMenuTreeselect } from '@/api/system/menu'
import { getDicts } from '@/api/system/dict/data'
import { addDateRange, parseTime } from '@/utils/ruoyi'
import { download } from '@/utils/request'
import { checkPermi } from '@/utils/permission'

const { RangePicker } = DatePicker

const defaultQueryParams = {
  pageNum: 1,
  pageSize: 10,
  roleName: undefined,
  roleKey: undefined,
  status: undefined
}

const defaultFormState = {
  roleId: undefined,
  roleName: undefined,
  roleKey: undefined,
  roleSort: 0,
  status: '0',
  menuIds: [],
  deptIds: [],
  menuCheckStrictly: true,
  deptCheckStrictly: true,
  dataScope: '1',
  remark: undefined
}

const dataScopeOptions = [
  { value: '1', label: '全部数据权限' },
  { value: '2', label: '自定数据权限' },
  { value: '3', label: '本部门数据权限' },
  { value: '4', label: '本部门及以下数据权限' },
  { value: '5', label: '仅本人数据权限' }
]

const mapTreeOptions = (items = []) => {
  return items.map((item) => ({
    title: item.label,
    key: item.id,
    children: item.children ? mapTreeOptions(item.children) : []
  }))
}

const flattenKeys = (nodes = []) => {
  const keys = []
  const travel = (list) => {
    list.forEach((node) => {
      keys.push(node.key)
      if (node.children && node.children.length > 0) {
        travel(node.children)
      }
    })
  }
  travel(nodes)
  return keys
}

const Role = () => {
  const [loading, setLoading] = useState(false)
  const [roleList, setRoleList] = useState([])
  const [total, setTotal] = useState(0)
  const [showSearch, setShowSearch] = useState(true)
  const [queryParams, setQueryParams] = useState({ ...defaultQueryParams })
  const [dateRange, setDateRange] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [open, setOpen] = useState(false)
  const [openDataScope, setOpenDataScope] = useState(false)
  const [title, setTitle] = useState('')
  const [formData, setFormData] = useState({ ...defaultFormState })
  const [menuOptions, setMenuOptions] = useState([])
  const [deptOptions, setDeptOptions] = useState([])
  const [menuCheckedKeys, setMenuCheckedKeys] = useState([])
  const [menuHalfCheckedKeys, setMenuHalfCheckedKeys] = useState([])
  const [deptCheckedKeys, setDeptCheckedKeys] = useState([])
  const [deptHalfCheckedKeys, setDeptHalfCheckedKeys] = useState([])
  const [menuExpanded, setMenuExpanded] = useState(false)
  const [menuNodeAll, setMenuNodeAll] = useState(false)
  const [deptExpanded, setDeptExpanded] = useState(true)
  const [deptNodeAll, setDeptNodeAll] = useState(false)
  const [dictStatus, setDictStatus] = useState([])
  const [form] = Form.useForm()

  const single = selectedRowKeys.length !== 1
  const multiple = selectedRowKeys.length === 0

  const menuExpandedKeys = useMemo(() => (
    menuExpanded ? flattenKeys(menuOptions) : []
  ), [menuExpanded, menuOptions])

  const deptExpandedKeys = useMemo(() => (
    deptExpanded ? flattenKeys(deptOptions) : []
  ), [deptExpanded, deptOptions])

  const getList = async (override = {}) => {
    setLoading(true)
    try {
      const params = addDateRange(
        { ...queryParams, ...override },
        dateRange.length ? dateRange.map(item => item.format('YYYY-MM-DD')) : []
      )
      const res = await listRole(params)
      setRoleList(res.rows || [])
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

  const handleStatusChange = (row, checked) => {
    const nextStatus = checked ? '0' : '1'
    const text = nextStatus === '0' ? '启用' : '停用'
    setRoleList(prev => prev.map(item => (
      item.roleId === row.roleId ? { ...item, status: nextStatus } : item
    )))
    Modal.confirm({
      title: '系统提示',
      content: `确认要"${text}""${row.roleName}"角色吗？`,
      onOk: async () => {
        await changeRoleStatus(row.roleId, nextStatus)
        message.success(`${text}成功`)
        getList()
      },
      onCancel: () => {
        setRoleList(prev => prev.map(item => (
          item.roleId === row.roleId ? { ...item, status: row.status } : item
        )))
      }
    })
  }

  const getMenuTree = async () => {
    const res = await menuTreeselect()
    setMenuOptions(mapTreeOptions(res.data || []))
  }

  const getRoleMenuTree = async (roleId) => {
    const res = await roleMenuTreeselect(roleId)
    setMenuOptions(mapTreeOptions(res.menus || []))
    setMenuCheckedKeys(res.checkedKeys || [])
  }

  const getDeptTree = async (roleId) => {
    const res = await deptTreeSelect(roleId)
    setDeptOptions(mapTreeOptions(res.depts || []))
    setDeptCheckedKeys(res.checkedKeys || [])
  }

  const handleCheckedTreeExpand = (value, type) => {
    if (type === 'menu') {
      setMenuExpanded(value)
    } else {
      setDeptExpanded(value)
    }
  }

  const handleCheckedTreeNodeAll = (value, type) => {
    if (type === 'menu') {
      setMenuNodeAll(value)
      setMenuCheckedKeys(value ? flattenKeys(menuOptions) : [])
    } else {
      setDeptNodeAll(value)
      setDeptCheckedKeys(value ? flattenKeys(deptOptions) : [])
    }
  }

  const handleCheckedTreeConnect = (value, type) => {
    if (type === 'menu') {
      setFormData(prev => ({ ...prev, menuCheckStrictly: value }))
    } else {
      setFormData(prev => ({ ...prev, deptCheckStrictly: value }))
    }
  }

  const handleAdd = async () => {
    setFormData({ ...defaultFormState })
    form.setFieldsValue({ ...defaultFormState })
    setMenuCheckedKeys([])
    setMenuHalfCheckedKeys([])
    await getMenuTree()
    setOpen(true)
    setTitle('添加角色')
  }

  const handleUpdate = async (row) => {
    const roleId = row?.roleId || selectedRowKeys
    setMenuCheckedKeys([])
    setMenuHalfCheckedKeys([])
    const roleRes = await getRole(roleId)
    setFormData({ ...defaultFormState, ...roleRes.data })
    form.setFieldsValue({ ...defaultFormState, ...roleRes.data })
    await getRoleMenuTree(roleId)
    setOpen(true)
    setTitle('修改角色')
  }

  const handleDelete = (row) => {
    const roleIds = row?.roleId || selectedRowKeys.join(',')
    Modal.confirm({
      title: '系统提示',
      content: `是否确认删除角色编号为"${roleIds}"的数据项？`,
      onOk: async () => {
        await delRole(roleIds)
        message.success('删除成功')
        getList()
      }
    })
  }

  const handleDataScope = async (row) => {
    const roleId = row.roleId
    const roleRes = await getRole(roleId)
    setFormData({ ...defaultFormState, ...roleRes.data })
    form.setFieldsValue({ ...defaultFormState, ...roleRes.data })
    await getDeptTree(roleId)
    setOpenDataScope(true)
    setTitle('分配数据权限')
  }

  const handleAuthUser = (row) => {
    window.location.href = `/system/role-auth/user/${row.roleId}`
  }

  const submitForm = async () => {
    const values = await form.validateFields()
    const menuIds = Array.from(new Set([...menuCheckedKeys, ...menuHalfCheckedKeys]))
    const payload = { ...formData, ...values, menuIds }
    if (payload.roleId) {
      await updateRole(payload)
      message.success('修改成功')
    } else {
      await addRole(payload)
      message.success('新增成功')
    }
    setOpen(false)
    getList()
  }

  const submitDataScope = async () => {
    if (!formData.roleId) return
    const deptIds = Array.from(new Set([...deptCheckedKeys, ...deptHalfCheckedKeys]))
    await dataScope({ ...formData, deptIds })
    message.success('修改成功')
    setOpenDataScope(false)
    getList()
  }

  const handleExport = () => {
    download('system/role/export', { ...queryParams }, `role_${Date.now()}.xlsx`)
  }

  useEffect(() => {
    getList()
    fetchDicts()
  }, [])

  const columns = [
    {
      title: '角色编号',
      dataIndex: 'roleId',
      width: 120
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      width: 150,
      ellipsis: true
    },
    {
      title: '权限字符',
      dataIndex: 'roleKey',
      width: 150,
      ellipsis: true
    },
    {
      title: '显示顺序',
      dataIndex: 'roleSort',
      width: 100
    },
    {
      title: '状态',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <Switch
          checked={record.status === '0'}
          checkedChildren="启用"
          unCheckedChildren="停用"
          onChange={(checked) => handleStatusChange(record, checked)}
        />
      )
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
        record.roleId === 1 ? null : (
          <Space>
            {checkPermi(['system:role:edit']) && (
              <Button size="small" type="link" icon={<EditOutlined />} onClick={() => handleUpdate(record)}>
                修改
              </Button>
            )}
            {checkPermi(['system:role:remove']) && (
              <Button size="small" type="link" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record)}>
                删除
              </Button>
            )}
            {checkPermi(['system:role:edit']) && (
              <Dropdown
                menu={{
                  items: [
                    { key: 'dataScope', label: '数据权限' },
                    { key: 'authUser', label: '分配用户' }
                  ],
                  onClick: ({ key }) => {
                    if (key === 'dataScope') handleDataScope(record)
                    if (key === 'authUser') handleAuthUser(record)
                  }
                }}
              >
                <Button size="small" type="link" icon={<MoreOutlined />}>
                  更多
                </Button>
              </Dropdown>
            )}
          </Space>
        )
      )
    }
  ]

  return (
    <Card>
      {showSearch && (
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item label="角色名称">
            <Input
              placeholder="请输入角色名称"
              value={queryParams.roleName}
              onChange={(e) => setQueryParams({ ...queryParams, roleName: e.target.value })}
              onPressEnter={handleQuery}
              style={{ width: 240 }}
            />
          </Form.Item>
          <Form.Item label="权限字符">
            <Input
              placeholder="请输入权限字符"
              value={queryParams.roleKey}
              onChange={(e) => setQueryParams({ ...queryParams, roleKey: e.target.value })}
              onPressEnter={handleQuery}
              style={{ width: 240 }}
            />
          </Form.Item>
          <Form.Item label="状态">
            <Select
              placeholder="角色状态"
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
          {checkPermi(['system:role:add']) && (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增
            </Button>
          )}
          {checkPermi(['system:role:edit']) && (
            <Button icon={<EditOutlined />} disabled={single} onClick={() => handleUpdate()}>
              修改
            </Button>
          )}
          {checkPermi(['system:role:remove']) && (
            <Button icon={<DeleteOutlined />} danger disabled={multiple} onClick={() => handleDelete()}>
              删除
            </Button>
          )}
          {checkPermi(['system:role:export']) && (
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              导出
            </Button>
          )}
        </Space>
        <RightToolbar
          showSearch={showSearch}
          onShowSearchChange={setShowSearch}
          onQuery={getList}
        />
      </Row>

      <Table
        rowKey="roleId"
        loading={loading}
        dataSource={roleList}
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
          <Form.Item name="roleName" label="角色名称" rules={[{ required: true, message: '角色名称不能为空' }]}>
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            name="roleKey"
            label={(
              <Space>
                <span>权限字符</span>
                <Tooltip title="控制器中定义的权限字符，如：@PreAuthorize(@ss.hasRole('admin'))">
                  <QuestionCircleOutlined />
                </Tooltip>
              </Space>
            )}
            rules={[{ required: true, message: '权限字符不能为空' }]}
          >
            <Input placeholder="请输入权限字符" />
          </Form.Item>
          <Form.Item name="roleSort" label="角色顺序" rules={[{ required: true, message: '角色顺序不能为空' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select>
              {dictStatus.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  <Tag color={item.value === '0' ? 'green' : 'red'}>{item.label}</Tag>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="菜单权限">
            <Space style={{ marginBottom: 12 }}>
              <Checkbox checked={menuExpanded} onChange={(e) => handleCheckedTreeExpand(e.target.checked, 'menu')}>
                展开/折叠
              </Checkbox>
              <Checkbox checked={menuNodeAll} onChange={(e) => handleCheckedTreeNodeAll(e.target.checked, 'menu')}>
                全选/全不选
              </Checkbox>
              <Checkbox checked={formData.menuCheckStrictly} onChange={(e) => handleCheckedTreeConnect(e.target.checked, 'menu')}>
                父子联动
              </Checkbox>
            </Space>
            <Tree
              checkable
              treeData={menuOptions}
              expandedKeys={menuExpandedKeys}
              checkedKeys={formData.menuCheckStrictly ? menuCheckedKeys : { checked: menuCheckedKeys, halfChecked: menuHalfCheckedKeys }}
              checkStrictly={!formData.menuCheckStrictly}
              onCheck={(checkedKeysValue, info) => {
                if (Array.isArray(checkedKeysValue)) {
                  setMenuCheckedKeys(checkedKeysValue)
                  setMenuHalfCheckedKeys(info.halfCheckedKeys || [])
                } else {
                  setMenuCheckedKeys(checkedKeysValue.checked || [])
                  setMenuHalfCheckedKeys(checkedKeysValue.halfChecked || [])
                }
              }}
            />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea placeholder="请输入内容" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={title}
        open={openDataScope}
        onCancel={() => setOpenDataScope(false)}
        onOk={submitDataScope}
        width={520}
      >
        <Form form={form} layout="vertical" initialValues={formData}>
          <Form.Item label="角色名称">
            <Input value={formData.roleName} disabled />
          </Form.Item>
          <Form.Item label="权限字符">
            <Input value={formData.roleKey} disabled />
          </Form.Item>
          <Form.Item name="dataScope" label="权限范围">
            <Select onChange={(value) => {
              setFormData(prev => ({ ...prev, dataScope: value }))
              if (value !== '2') {
                setDeptCheckedKeys([])
                setDeptHalfCheckedKeys([])
              }
            }}>
              {dataScopeOptions.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {formData.dataScope === '2' && (
            <Form.Item label="数据权限">
              <Space style={{ marginBottom: 12 }}>
                <Checkbox checked={deptExpanded} onChange={(e) => handleCheckedTreeExpand(e.target.checked, 'dept')}>
                  展开/折叠
                </Checkbox>
                <Checkbox checked={deptNodeAll} onChange={(e) => handleCheckedTreeNodeAll(e.target.checked, 'dept')}>
                  全选/全不选
                </Checkbox>
                <Checkbox checked={formData.deptCheckStrictly} onChange={(e) => handleCheckedTreeConnect(e.target.checked, 'dept')}>
                  父子联动
                </Checkbox>
              </Space>
              <Tree
                checkable
                treeData={deptOptions}
                expandedKeys={deptExpandedKeys}
                checkedKeys={formData.deptCheckStrictly ? deptCheckedKeys : { checked: deptCheckedKeys, halfChecked: deptHalfCheckedKeys }}
                checkStrictly={!formData.deptCheckStrictly}
                onCheck={(checkedKeysValue, info) => {
                  if (Array.isArray(checkedKeysValue)) {
                    setDeptCheckedKeys(checkedKeysValue)
                    setDeptHalfCheckedKeys(info.halfCheckedKeys || [])
                  } else {
                    setDeptCheckedKeys(checkedKeysValue.checked || [])
                    setDeptHalfCheckedKeys(checkedKeysValue.halfChecked || [])
                  }
                }}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </Card>
  )
}

export default Role
