import React, { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popover,
  Radio,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
  TreeSelect,
  message
} from 'antd'
import {
  PlusOutlined,
  SortAscendingOutlined,
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons'
import Cookies from 'js-cookie'
import RightToolbar from '@/components/RightToolbar'
import IconSelect from '@/components/IconSelect'
import SvgIcon from '@/components/SvgIcon'
import { listMenu, getMenu, delMenu, addMenu, updateMenu } from '@/api/system/menu'
import { getDicts } from '@/api/system/dict/data'
import { handleTree, parseTime } from '@/utils/ruoyi'
import { checkPermi } from '@/utils/permission'

const defaultQueryParams = {
  menuName: undefined,
  status: undefined
}

const defaultFormState = {
  menuId: undefined,
  parentId: 0,
  menuName: undefined,
  menuNameEn: undefined,
  icon: undefined,
  menuType: 'M',
  orderNum: undefined,
  isFrame: '1',
  isCache: '0',
  visible: '0',
  status: '0',
  path: undefined,
  routeName: undefined,
  component: undefined,
  perms: undefined,
  query: undefined,
  remark: undefined
}

const mapTreeSelectOptions = (items = []) => {
  return items.map((item) => ({
    title: item.menuName,
    value: item.menuId,
    key: item.menuId,
    children: item.children ? mapTreeSelectOptions(item.children) : []
  }))
}

const collectKeys = (nodes = []) => {
  const keys = []
  const travel = (list) => {
    list.forEach((item) => {
      keys.push(item.menuId)
      if (item.children && item.children.length > 0) {
        travel(item.children)
      }
    })
  }
  travel(nodes)
  return keys
}

const Menu = () => {
  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(true)
  const [menuList, setMenuList] = useState([])
  const [menuOptions, setMenuOptions] = useState([])
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [queryParams, setQueryParams] = useState({ ...defaultQueryParams })
  const [formData, setFormData] = useState({ ...defaultFormState })
  const [isExpandAll, setIsExpandAll] = useState(false)
  const [expandedKeys, setExpandedKeys] = useState([])
  const [dictStatus, setDictStatus] = useState([])
  const [dictVisible, setDictVisible] = useState([])
  const [form] = Form.useForm()

  const lang = Cookies.get('language')
  const isEnglish = lang === 'en'

  const menuNameLabel = isEnglish ? 'Menu Name' : '菜单名称'
  const menuNamePlaceholder = isEnglish ? 'Enter menu name' : '请输入菜单名称'
  const menuNameEnLabel = isEnglish ? 'Menu Name (EN)' : '菜单英文名称'
  const menuNameEnPlaceholder = isEnglish ? 'Enter English name' : '请输入菜单英文名称'

  const displayMenuName = (row) => {
    if (isEnglish && row.menuNameEn) return row.menuNameEn
    return row.menuName
  }

  const getList = async () => {
    setLoading(true)
    try {
      const res = await listMenu(queryParams)
      const treeData = handleTree(res.data || [], 'menuId')
      setMenuList(treeData)
      if (isExpandAll) {
        setExpandedKeys(collectKeys(treeData))
      }
    } finally {
      setLoading(false)
    }
  }

  const getTreeselect = async () => {
    const res = await listMenu()
    const treeData = handleTree(res.data || [], 'menuId')
    const rootLabel = isEnglish ? 'Root' : '主类目'
    const rootNode = { menuId: 0, menuName: rootLabel, children: treeData }
    setMenuOptions(mapTreeSelectOptions([rootNode]))
  }

  const fetchDicts = async () => {
    const [statusRes, visibleRes] = await Promise.all([
      getDicts('sys_normal_disable'),
      getDicts('sys_show_hide')
    ])
    setDictStatus(statusRes.data || [])
    setDictVisible(visibleRes.data || [])
  }

  const handleQuery = () => {
    getList()
  }

  const resetQuery = () => {
    setQueryParams({ ...defaultQueryParams })
    getList()
  }

  const handleAdd = async (row) => {
    setFormData({ ...defaultFormState, parentId: row?.menuId || 0 })
    form.setFieldsValue({ ...defaultFormState, parentId: row?.menuId || 0 })
    await getTreeselect()
    setOpen(true)
    setTitle('添加菜单')
  }

  const handleUpdate = async (row) => {
    await getTreeselect()
    const res = await getMenu(row.menuId)
    setFormData(res.data)
    form.setFieldsValue(res.data)
    setOpen(true)
    setTitle('修改菜单')
  }

  const handleDelete = (row) => {
    Modal.confirm({
      title: '系统提示',
      content: `是否确认删除名称为"${row.menuName}"的数据项？`,
      onOk: async () => {
        await delMenu(row.menuId)
        message.success('删除成功')
        getList()
      }
    })
  }

  const toggleExpandAll = () => {
    const next = !isExpandAll
    setIsExpandAll(next)
    setExpandedKeys(next ? collectKeys(menuList) : [])
  }

  const submitForm = async () => {
    const values = await form.validateFields()
    const payload = { ...formData, ...values }
    if (payload.menuId) {
      await updateMenu(payload)
      message.success('修改成功')
    } else {
      await addMenu(payload)
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
      title: menuNameLabel,
      dataIndex: 'menuName',
      width: 180,
      render: (_, record) => displayMenuName(record)
    },
    {
      title: '图标',
      dataIndex: 'icon',
      align: 'center',
      width: 100,
      render: (value) => <SvgIcon iconClass={value} />
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
      width: 60
    },
    {
      title: '权限标识',
      dataIndex: 'perms',
      ellipsis: true
    },
    {
      title: '组件路径',
      dataIndex: 'component',
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (value) => {
        const target = dictStatus.find((item) => item.value === value)
        return target ? target.label : value
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      render: (value) => <span>{parseTime(value)}</span>
    },
    {
      title: '操作',
      align: 'center',
      render: (_, record) => (
        <Space>
          {checkPermi(['system:menu:edit']) && (
            <Button size="small" type="link" icon={<EditOutlined />} onClick={() => handleUpdate(record)}>
              修改
            </Button>
          )}
          {checkPermi(['system:menu:add']) && (
            <Button size="small" type="link" icon={<PlusOutlined />} onClick={() => handleAdd(record)}>
              新增
            </Button>
          )}
          {checkPermi(['system:menu:remove']) && (
            <Button size="small" type="link" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record)}>
              删除
            </Button>
          )}
        </Space>
      )
    }
  ], [menuNameLabel, dictStatus])

  return (
    <Card>
      {showSearch && (
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item label={menuNameLabel}>
            <Input
              placeholder={menuNamePlaceholder}
              value={queryParams.menuName}
              onChange={(e) => setQueryParams({ ...queryParams, menuName: e.target.value })}
              onPressEnter={handleQuery}
            />
          </Form.Item>
          <Form.Item label="状态">
            <Select
              placeholder="菜单状态"
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
          {checkPermi(['system:menu:add']) && (
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
        rowKey="menuId"
        loading={loading}
        dataSource={menuList}
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
        width={720}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={formData}>
          <Form.Item name="parentId" label="上级菜单" rules={[{ required: true, message: '请选择上级菜单' }]}>
            <TreeSelect treeData={menuOptions} placeholder="选择上级菜单" treeDefaultExpandAll />
          </Form.Item>
          <Form.Item name="menuType" label="菜单类型" rules={[{ required: true, message: '请选择菜单类型' }]}>
            <Radio.Group>
              <Radio value="M">目录</Radio>
              <Radio value="C">菜单</Radio>
              <Radio value="F">按钮</Radio>
            </Radio.Group>
          </Form.Item>
          <Row gutter={16}>
            {formData.menuType !== 'F' && (
              <Form.Item name="icon" label="菜单图标" style={{ flex: 1, marginRight: 16 }}>
                <Popover content={<IconSelect value={formData.icon} onChange={(value) => {
                  setFormData(prev => ({ ...prev, icon: value }))
                  form.setFieldsValue({ icon: value })
                }} />} trigger="click">
                  <Input
                    readOnly
                    placeholder="点击选择图标"
                    value={formData.icon}
                    prefix={formData.icon ? <SvgIcon iconClass={formData.icon} /> : null}
                  />
                </Popover>
              </Form.Item>
            )}
            <Form.Item name="orderNum" label="显示排序" style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Row>
          <Row gutter={16}>
            <Form.Item name="menuName" label={menuNameLabel} style={{ flex: 1 }} rules={[{ required: true, message: '菜单名称不能为空' }]}>
              <Input placeholder={menuNamePlaceholder} />
            </Form.Item>
            <Form.Item name="menuNameEn" label={menuNameEnLabel} style={{ flex: 1 }}>
              <Input placeholder={menuNameEnPlaceholder} />
            </Form.Item>
            {formData.menuType === 'C' && (
              <Form.Item
                name="routeName"
                label={(
                  <Space>
                    <span>路由名称</span>
                    <Tooltip title="默认不填则和路由地址相同，特殊情况请保证唯一">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </Space>
                )}
                style={{ flex: 1 }}
              >
                <Input placeholder="请输入路由名称" />
              </Form.Item>
            )}
          </Row>
          <Row gutter={16}>
            {formData.menuType !== 'F' && (
              <Form.Item
                name="isFrame"
                label={(
                  <Space>
                    <span>是否外链</span>
                    <Tooltip title="选择是外链则路由地址需要以 http(s):// 开头">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </Space>
                )}
                style={{ flex: 1 }}
              >
                <Radio.Group>
                  <Radio value="0">是</Radio>
                  <Radio value="1">否</Radio>
                </Radio.Group>
              </Form.Item>
            )}
            {formData.menuType !== 'F' && (
              <Form.Item
                name="path"
                label={(
                  <Space>
                    <span>路由地址</span>
                    <Tooltip title="访问的路由地址，如 user 或 http(s)://">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </Space>
                )}
                style={{ flex: 1 }}
                rules={[{ required: true, message: '路由地址不能为空' }]}
              >
                <Input placeholder="请输入路由地址" />
              </Form.Item>
            )}
          </Row>
          <Row gutter={16}>
            {formData.menuType === 'C' && (
              <Form.Item
                name="component"
                label={(
                  <Space>
                    <span>组件路径</span>
                    <Tooltip title="访问的组件路径，如 system/user/index">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </Space>
                )}
                style={{ flex: 1 }}
              >
                <Input placeholder="请输入组件路径" />
              </Form.Item>
            )}
            {formData.menuType !== 'M' && (
              <Form.Item
                name="perms"
                label={(
                  <Space>
                    <span>权限字符</span>
                    <Tooltip title="控制器中定义的权限字符">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </Space>
                )}
                style={{ flex: 1 }}
              >
                <Input placeholder="请输入权限标识" maxLength={100} />
              </Form.Item>
            )}
          </Row>
          <Row gutter={16}>
            {formData.menuType === 'C' && (
              <Form.Item
                name="query"
                label={(
                  <Space>
                    <span>路由参数</span>
                    <Tooltip title='访问路由的默认参数，如 {"id":1,"name":"ry"}'>
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </Space>
                )}
                style={{ flex: 1 }}
              >
                <Input placeholder="请输入路由参数" maxLength={255} />
              </Form.Item>
            )}
            {formData.menuType === 'C' && (
              <Form.Item
                name="isCache"
                label={(
                  <Space>
                    <span>是否缓存</span>
                    <Tooltip title="选择是则会被 keep-alive 缓存">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </Space>
                )}
                style={{ flex: 1 }}
              >
                <Radio.Group>
                  <Radio value="0">缓存</Radio>
                  <Radio value="1">不缓存</Radio>
                </Radio.Group>
              </Form.Item>
            )}
          </Row>
          <Row gutter={16}>
            {formData.menuType !== 'F' && (
              <Form.Item
                name="visible"
                label={(
                  <Space>
                    <span>显示状态</span>
                    <Tooltip title="选择隐藏则路由不会出现在侧边栏">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </Space>
                )}
                style={{ flex: 1 }}
              >
                <Radio.Group>
                  {dictVisible.map((item) => (
                    <Radio key={item.value} value={item.value}>{item.label}</Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            )}
            <Form.Item
              name="status"
              label={(
                <Space>
                  <span>菜单状态</span>
                  <Tooltip title="选择停用则路由不会出现在侧边栏也不能访问">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Space>
              )}
              style={{ flex: 1 }}
            >
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

export default Menu
