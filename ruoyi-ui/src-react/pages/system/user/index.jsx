import React, { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tree,
  TreeSelect,
  Upload,
  message
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  DownloadOutlined,
  MoreOutlined
} from '@ant-design/icons'
import RightToolbar from '@/components/RightToolbar'
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
  resetUserPwd,
  changeUserStatus,
  deptTreeSelect
} from '@/api/system/user'
import { getConfigKey } from '@/api/system/config'
import { getDicts } from '@/api/system/dict/data'
import { addDateRange, parseTime } from '@/utils/ruoyi'
import { getToken } from '@/utils/auth'
import { download } from '@/utils/request'
import { checkPermi } from '@/utils/permission'

const { RangePicker } = DatePicker

const defaultQueryParams = {
  pageNum: 1,
  pageSize: 10,
  userName: undefined,
  phonenumber: undefined,
  status: undefined,
  deptId: undefined
}

const defaultFormState = {
  userId: undefined,
  deptId: undefined,
  userName: undefined,
  nickName: undefined,
  password: undefined,
  phonenumber: undefined,
  email: undefined,
  sex: undefined,
  status: '0',
  remark: undefined,
  postIds: [],
  roleIds: []
}

const defaultColumns = {
  userId: { label: '用户编号', visible: true },
  userName: { label: '用户名称', visible: true },
  nickName: { label: '用户昵称', visible: true },
  deptName: { label: '部门', visible: true },
  phonenumber: { label: '手机号码', visible: true },
  status: { label: '状态', visible: true },
  createTime: { label: '创建时间', visible: true }
}

const mapTreeOptions = (items = []) => {
  return items.map((item) => ({
    title: item.label,
    key: item.id,
    value: item.id,
    disabled: item.disabled,
    children: item.children ? mapTreeOptions(item.children) : []
  }))
}

const filterDisabledDept = (deptList = []) => {
  return deptList
    .filter((dept) => !dept.disabled)
    .map((dept) => ({
      ...dept,
      children: dept.children ? filterDisabledDept(dept.children) : []
    }))
}

const User = () => {
  const [loading, setLoading] = useState(false)
  const [userList, setUserList] = useState([])
  const [total, setTotal] = useState(0)
  const [deptName, setDeptName] = useState('')
  const [deptOptions, setDeptOptions] = useState([])
  const [enabledDeptOptions, setEnabledDeptOptions] = useState([])
  const [selectedDeptKeys, setSelectedDeptKeys] = useState([])
  const [showSearch, setShowSearch] = useState(true)
  const [queryParams, setQueryParams] = useState({ ...defaultQueryParams })
  const [dateRange, setDateRange] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [columns, setColumns] = useState(defaultColumns)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [formData, setFormData] = useState({ ...defaultFormState })
  const [postOptions, setPostOptions] = useState([])
  const [roleOptions, setRoleOptions] = useState([])
  const [initPassword, setInitPassword] = useState('')
  const [importOpen, setImportOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [updateSupport, setUpdateSupport] = useState(false)
  const [resetPwdOpen, setResetPwdOpen] = useState(false)
  const [resetPwdUser, setResetPwdUser] = useState(null)
  const [resetPwdValue, setResetPwdValue] = useState('')
  const [dictStatus, setDictStatus] = useState([])
  const [dictSex, setDictSex] = useState([])
  const [form] = Form.useForm()

  const single = selectedRowKeys.length !== 1
  const multiple = selectedRowKeys.length === 0

  const tableColumns = useMemo(() => {
    const cols = []
    if (columns.userId.visible) {
      cols.push({ title: '用户编号', dataIndex: 'userId', align: 'center', width: 90 })
    }
    if (columns.userName.visible) {
      cols.push({ title: '用户名称', dataIndex: 'userName', align: 'center', ellipsis: true })
    }
    if (columns.nickName.visible) {
      cols.push({ title: '用户昵称', dataIndex: 'nickName', align: 'center', ellipsis: true })
    }
    if (columns.deptName.visible) {
      cols.push({ title: '部门', dataIndex: ['dept', 'deptName'], align: 'center', ellipsis: true })
    }
    if (columns.phonenumber.visible) {
      cols.push({ title: '手机号码', dataIndex: 'phonenumber', align: 'center', width: 120 })
    }
    if (columns.status.visible) {
      cols.push({
        title: '状态',
        dataIndex: 'status',
        align: 'center',
        render: (_, record) => (
          <Switch
            checked={record.status === '0'}
            checkedChildren="启用"
            unCheckedChildren="停用"
            onChange={(checked) => handleStatusChange(record, checked)}
          />
        )
      })
    }
    if (columns.createTime.visible) {
      cols.push({
        title: '创建时间',
        dataIndex: 'createTime',
        align: 'center',
        width: 160,
        render: (value) => <span>{parseTime(value)}</span>
      })
    }
    cols.push({
      title: '操作',
      align: 'center',
      width: 200,
      render: (_, record) => (
        record.userId === 1 ? null : (
          <Space>
            {checkPermi(['system:user:edit']) && (
              <Button size="small" type="link" icon={<EditOutlined />} onClick={() => handleUpdate(record)}>
                修改
              </Button>
            )}
            {checkPermi(['system:user:remove']) && (
              <Button size="small" type="link" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record)}>
                删除
              </Button>
            )}
            {(checkPermi(['system:user:resetPwd']) || checkPermi(['system:user:edit'])) && (
              <Dropdown
                menu={{
                  items: [
                    checkPermi(['system:user:resetPwd'])
                      ? { key: 'resetPwd', label: '重置密码' }
                      : null,
                    checkPermi(['system:user:edit'])
                      ? { key: 'authRole', label: '分配角色' }
                      : null
                  ].filter(Boolean),
                  onClick: ({ key }) => {
                    if (key === 'resetPwd') handleResetPwd(record)
                    if (key === 'authRole') handleAuthRole(record)
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
    })
    return cols
  }, [columns])

  const filteredTreeData = useMemo(() => {
    if (!deptName) return deptOptions
    const keyword = deptName.trim()
    const filter = (nodes) => {
      return nodes
        .map((node) => {
          const match = node.title.includes(keyword)
          const children = node.children ? filter(node.children) : []
          if (match || children.length > 0) {
            return { ...node, children }
          }
          return null
        })
        .filter(Boolean)
    }
    return filter(deptOptions)
  }, [deptName, deptOptions])

  const fetchDicts = async () => {
    const [statusRes, sexRes] = await Promise.all([
      getDicts('sys_normal_disable'),
      getDicts('sys_user_sex')
    ])
    setDictStatus(statusRes.data || [])
    setDictSex(sexRes.data || [])
  }

  const getList = async (override = {}) => {
    setLoading(true)
    try {
      const params = addDateRange(
        { ...queryParams, ...override },
        dateRange.length ? dateRange.map(item => item.format('YYYY-MM-DD')) : []
      )
      const res = await listUser(params)
      setUserList(res.rows || [])
      setTotal(res.total || 0)
    } finally {
      setLoading(false)
    }
  }

  const getDeptTree = async () => {
    const res = await deptTreeSelect()
    const data = res.data || []
    setDeptOptions(mapTreeOptions(data))
    setEnabledDeptOptions(mapTreeOptions(filterDisabledDept(JSON.parse(JSON.stringify(data)))))
  }

  const handleStatusChange = (row, checked) => {
    const nextStatus = checked ? '0' : '1'
    const text = nextStatus === '0' ? '启用' : '停用'
    setUserList(prev => prev.map(item => (
      item.userId === row.userId ? { ...item, status: nextStatus } : item
    )))
    Modal.confirm({
      title: '系统提示',
      content: `确认要"${text}""${row.userName}"用户吗？`,
      onOk: async () => {
        await changeUserStatus(row.userId, nextStatus)
        message.success(`${text}成功`)
        getList()
      },
      onCancel: () => {
        setUserList(prev => prev.map(item => (
          item.userId === row.userId ? { ...item, status: row.status } : item
        )))
      }
    })
  }

  const handleQuery = () => {
    const nextParams = { ...queryParams, pageNum: 1 }
    setQueryParams(nextParams)
    getList(nextParams)
  }

  const resetQuery = () => {
    setDateRange([])
    setQueryParams({ ...defaultQueryParams })
    setSelectedDeptKeys([])
    getList({ ...defaultQueryParams })
  }

  const handleSelectionChange = (keys) => {
    setSelectedRowKeys(keys)
  }

  const handleAdd = async () => {
    const res = await getUser()
    setPostOptions(res.posts || [])
    setRoleOptions(res.roles || [])
    setOpen(true)
    setTitle('添加用户')
    const nextForm = { ...defaultFormState, password: initPassword }
    setFormData(nextForm)
    form.setFieldsValue(nextForm)
  }

  const handleUpdate = async (row) => {
    const userId = row?.userId || selectedRowKeys
    const res = await getUser(userId)
    const nextForm = {
      ...res.data,
      postIds: res.postIds || [],
      roleIds: res.roleIds || [],
      password: ''
    }
    setPostOptions(res.posts || [])
    setRoleOptions(res.roles || [])
    setOpen(true)
    setTitle('修改用户')
    setFormData(nextForm)
    form.setFieldsValue(nextForm)
  }

  const handleDelete = (row) => {
    const userIds = row?.userId || selectedRowKeys.join(',')
    Modal.confirm({
      title: '系统提示',
      content: `是否确认删除用户编号为"${userIds}"的数据项？`,
      onOk: async () => {
        await delUser(userIds)
        message.success('删除成功')
        getList()
      }
    })
  }

  const handleResetPwd = (row) => {
    setResetPwdUser(row)
    setResetPwdValue('')
    setResetPwdOpen(true)
  }

  const submitResetPwd = async () => {
    if (!resetPwdUser) return
    if (!/^.{5,20}$/.test(resetPwdValue)) {
      message.error('用户密码长度必须介于 5 和 20 之间')
      return
    }
    if (/<|>|"|'|\|/.test(resetPwdValue)) {
      message.error('不能包含非法字符：< > " \' \\ |')
      return
    }
    await resetUserPwd(resetPwdUser.userId, resetPwdValue)
    message.success(`修改成功，新密码是：${resetPwdValue}`)
    setResetPwdOpen(false)
  }

  const handleAuthRole = (row) => {
    window.location.href = `/system/user-auth/role/${row.userId}`
  }

  const submitForm = async () => {
    const values = await form.validateFields()
    const payload = { ...formData, ...values }
    if (payload.userId) {
      await updateUser(payload)
      message.success('修改成功')
    } else {
      await addUser(payload)
      message.success('新增成功')
    }
    setOpen(false)
    getList()
  }

  const handleExport = () => {
    download('system/user/export', { ...queryParams }, `user_${Date.now()}.xlsx`)
  }

  const handleImport = () => {
    setImportOpen(true)
  }

  const importTemplate = () => {
    download('system/user/importTemplate', {}, `user_template_${Date.now()}.xlsx`)
  }

  const uploadProps = {
    name: 'file',
    multiple: false,
    action: `${process.env.VUE_APP_BASE_API}/system/user/importData?updateSupport=${updateSupport ? 1 : 0}`,
    headers: { Authorization: `Bearer ${getToken()}` },
    accept: '.xlsx,.xls',
    beforeUpload: (file) => {
      const lower = file.name.toLowerCase()
      if (!lower.endsWith('.xls') && !lower.endsWith('.xlsx')) {
        message.error('请选择后缀为 “xls”或“xlsx”的文件。')
        return Upload.LIST_IGNORE
      }
      return true
    },
    onChange: (info) => {
      if (info.file.status === 'uploading') {
        setUploading(true)
      }
      if (info.file.status === 'done') {
        setUploading(false)
        setImportOpen(false)
        Modal.info({
          title: '导入结果',
          content: <div dangerouslySetInnerHTML={{ __html: info.file.response?.msg || '' }} />
        })
        getList()
      }
      if (info.file.status === 'error') {
        setUploading(false)
        message.error('上传失败')
      }
    }
  }

  useEffect(() => {
    getList()
    getDeptTree()
    fetchDicts()
    getConfigKey('sys.user.initPassword').then(res => setInitPassword(res.msg || ''))
  }, [])

  return (
    <Row gutter={16}>
      <Col span={5}>
        <Card title="部门" size="small">
          <Input
            placeholder="请输入部门名称"
            value={deptName}
            onChange={(e) => setDeptName(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <Tree
            treeData={filteredTreeData}
            defaultExpandAll
            selectedKeys={selectedDeptKeys}
            onSelect={(keys) => {
              const deptId = keys.length ? keys[0] : undefined
              const nextParams = { ...queryParams, deptId, pageNum: 1 }
              setQueryParams(nextParams)
              setSelectedDeptKeys(keys)
              getList(nextParams)
            }}
          />
        </Card>
      </Col>
      <Col span={19}>
        <Card>
          {showSearch && (
            <Form layout="inline" style={{ marginBottom: 16 }}>
              <Form.Item label="用户名称">
                <Input
                  placeholder="请输入用户名称"
                  value={queryParams.userName}
                  onChange={(e) => setQueryParams({ ...queryParams, userName: e.target.value })}
                  onPressEnter={handleQuery}
                  style={{ width: 240 }}
                />
              </Form.Item>
              <Form.Item label="手机号码">
                <Input
                  placeholder="请输入手机号码"
                  value={queryParams.phonenumber}
                  onChange={(e) => setQueryParams({ ...queryParams, phonenumber: e.target.value })}
                  onPressEnter={handleQuery}
                  style={{ width: 240 }}
                />
              </Form.Item>
              <Form.Item label="状态">
                <Select
                  placeholder="用户状态"
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
                <RangePicker
                  value={dateRange}
                  onChange={(values) => setDateRange(values || [])}
                  style={{ width: 240 }}
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
              {checkPermi(['system:user:add']) && (
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  新增
                </Button>
              )}
              {checkPermi(['system:user:edit']) && (
                <Button icon={<EditOutlined />} disabled={single} onClick={() => handleUpdate()}>
                  修改
                </Button>
              )}
              {checkPermi(['system:user:remove']) && (
                <Button icon={<DeleteOutlined />} danger disabled={multiple} onClick={() => handleDelete()}>
                  删除
                </Button>
              )}
              {checkPermi(['system:user:import']) && (
                <Button icon={<UploadOutlined />} onClick={handleImport}>
                  导入
                </Button>
              )}
              {checkPermi(['system:user:export']) && (
                <Button icon={<DownloadOutlined />} onClick={handleExport}>
                  导出
                </Button>
              )}
            </Space>
            <RightToolbar
              showSearch={showSearch}
              onShowSearchChange={setShowSearch}
              onQuery={getList}
              columns={columns}
              onColumnsChange={setColumns}
            />
          </Row>

          <Table
            rowKey="userId"
            loading={loading}
            dataSource={userList}
            columns={tableColumns}
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
        </Card>
      </Col>

      <Modal
        title={title}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={submitForm}
        width={700}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={formData}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="nickName" label="用户昵称" rules={[{ required: true, message: '用户昵称不能为空' }]}>
                <Input placeholder="请输入用户昵称" maxLength={30} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="deptId" label="归属部门" rules={[{ required: true, message: '请选择归属部门' }]}>
                <TreeSelect
                  treeData={enabledDeptOptions}
                  placeholder="请选择归属部门"
                  treeDefaultExpandAll
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phonenumber"
                label="手机号码"
                rules={[{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码' }]}
              >
                <Input placeholder="请输入手机号码" maxLength={11} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[{ type: 'email', message: '请输入正确的邮箱地址' }]}
              >
                <Input placeholder="请输入邮箱" maxLength={50} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            {!formData.userId && (
              <Col span={12}>
                <Form.Item
                  name="userName"
                  label="用户名称"
                  rules={[
                    { required: true, message: '用户名称不能为空' },
                    { min: 2, max: 20, message: '用户名称长度必须介于 2 和 20 之间' }
                  ]}
                >
                  <Input placeholder="请输入用户名称" maxLength={30} />
                </Form.Item>
              </Col>
            )}
            {!formData.userId && (
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="用户密码"
                  rules={[
                    { required: true, message: '用户密码不能为空' },
                    { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间' },
                    { pattern: /^[^<>"'|\\]+$/, message: '不能包含非法字符：< > " \' \\ |' }
                  ]}
                >
                  <Input.Password placeholder="请输入用户密码" maxLength={20} />
                </Form.Item>
              </Col>
            )}
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="sex" label="用户性别">
                <Select placeholder="请选择性别" allowClear>
                  {dictSex.map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="状态">
                <Select>
                  {dictStatus.map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      <Tag color={item.value === '0' ? 'green' : 'red'}>{item.label}</Tag>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="postIds" label="岗位">
                <Select mode="multiple" placeholder="请选择岗位">
                  {postOptions.map((item) => (
                    <Select.Option key={item.postId} value={item.postId} disabled={item.status === '1'}>
                      {item.postName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="roleIds" label="角色">
                <Select mode="multiple" placeholder="请选择角色">
                  {roleOptions.map((item) => (
                    <Select.Option key={item.roleId} value={item.roleId} disabled={item.status === '1'}>
                      {item.roleName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="remark" label="备注">
            <Input.TextArea placeholder="请输入内容" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="用户导入"
        open={importOpen}
        onCancel={() => setImportOpen(false)}
        onOk={() => {}}
        footer={null}
      >
        <Upload.Dragger {...uploadProps} disabled={uploading}>
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">将文件拖到此处，或点击上传</p>
          <p className="ant-upload-hint">仅允许导入xls、xlsx格式文件。</p>
        </Upload.Dragger>
        <div style={{ marginTop: 12 }}>
          <Space>
            <Checkbox checked={updateSupport} onChange={(e) => setUpdateSupport(e.target.checked)}>
              是否更新已经存在的用户数据
            </Checkbox>
            <Button type="link" onClick={importTemplate}>下载模板</Button>
          </Space>
        </div>
      </Modal>

      <Modal
        title="重置密码"
        open={resetPwdOpen}
        onCancel={() => setResetPwdOpen(false)}
        onOk={submitResetPwd}
      >
        <Input.Password
          placeholder={`请输入"${resetPwdUser?.userName || ''}"的新密码`}
          value={resetPwdValue}
          onChange={(e) => setResetPwdValue(e.target.value)}
        />
      </Modal>
    </Row>
  )
}

export default User
