import React, { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  TreeSelect,
  message
} from 'antd'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { getGenTable, updateGenTable } from '@/api/tool/gen'
import { optionselect as getDictOptionselect } from '@/api/system/dict/type'
import { listMenu as getMenuTreeselect } from '@/api/system/menu'
import { handleTree } from '@/utils/ruoyi'

const javaTypes = ['Long', 'String', 'Integer', 'Double', 'BigDecimal', 'Date', 'Boolean']
const queryTypes = ['EQ', 'NE', 'GT', 'GTE', 'LT', 'LTE', 'LIKE', 'BETWEEN']
const htmlTypes = ['input', 'textarea', 'select', 'radio', 'checkbox', 'datetime', 'imageUpload', 'fileUpload', 'editor']

const EditTable = () => {
  const { tableId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('columnInfo')
  const [info, setInfo] = useState({})
  const [columns, setColumns] = useState([])
  const [tables, setTables] = useState([])
  const [dictOptions, setDictOptions] = useState([])
  const [menus, setMenus] = useState([])
  const [subColumns, setSubColumns] = useState([])
  const [basicForm] = Form.useForm()
  const [genForm] = Form.useForm()

  const loadData = async () => {
    const res = await getGenTable(tableId)
    setColumns(res.data.rows || [])
    setInfo(res.data.info || {})
    setTables(res.data.tables || [])
    basicForm.setFieldsValue(res.data.info)
    genForm.setFieldsValue(res.data.info)
  }

  const loadDicts = async () => {
    const res = await getDictOptionselect()
    setDictOptions(res.data || [])
  }

  const mapMenuTree = (items = []) => {
    return items.map(item => ({
      title: item.menuName,
      value: item.menuId,
      children: item.children ? mapMenuTree(item.children) : []
    }))
  }

  const loadMenus = async () => {
    const res = await getMenuTreeselect()
    const treeData = handleTree(res.data || [], 'menuId')
    setMenus(mapMenuTree(treeData))
  }

  useEffect(() => {
    if (tableId) {
      loadData()
      loadDicts()
      loadMenus()
    }
  }, [tableId])

  useEffect(() => {
    if (info.subTableName) {
      const table = tables.find(item => item.tableName === info.subTableName)
      setSubColumns(table?.columns || [])
    }
  }, [info.subTableName, tables])

  const updateColumn = (index, field, value) => {
    setColumns(prev => prev.map((col, idx) => (idx === index ? { ...col, [field]: value } : col)))
  }

  const submitForm = async () => {
    const basicValues = await basicForm.validateFields()
    const genValues = await genForm.validateFields()
    const genTable = { ...info, ...basicValues, ...genValues }
    genTable.columns = columns
    genTable.params = {
      treeCode: genTable.treeCode,
      treeName: genTable.treeName,
      treeParentCode: genTable.treeParentCode,
      parentMenuId: genTable.parentMenuId
    }
    const res = await updateGenTable(genTable)
    message.success(res.msg || '修改成功')
    navigate('/tool/gen', { replace: true, state: { pageNum: location.state?.pageNum } })
  }

  const columnTable = (
    <Table
      rowKey="columnId"
      dataSource={columns}
      pagination={false}
      scroll={{ x: 1400, y: 400 }}
      columns={[
        { title: '字段列名', dataIndex: 'columnName', width: 120 },
        {
          title: '字段描述',
          width: 140,
          render: (_, record, index) => (
            <Input value={record.columnComment} onChange={(e) => updateColumn(index, 'columnComment', e.target.value)} />
          )
        },
        { title: '物理类型', dataIndex: 'columnType', width: 120 },
        {
          title: 'Java类型',
          width: 120,
          render: (_, record, index) => (
            <Select value={record.javaType} onChange={(value) => updateColumn(index, 'javaType', value)} style={{ width: '100%' }}>
              {javaTypes.map(type => (
                <Select.Option key={type} value={type}>{type}</Select.Option>
              ))}
            </Select>
          )
        },
        {
          title: 'java属性',
          width: 140,
          render: (_, record, index) => (
            <Input value={record.javaField} onChange={(e) => updateColumn(index, 'javaField', e.target.value)} />
          )
        },
        {
          title: '插入',
          width: 70,
          render: (_, record, index) => (
            <Checkbox checked={record.isInsert === '1'} onChange={(e) => updateColumn(index, 'isInsert', e.target.checked ? '1' : '0')} />
          )
        },
        {
          title: '编辑',
          width: 70,
          render: (_, record, index) => (
            <Checkbox checked={record.isEdit === '1'} onChange={(e) => updateColumn(index, 'isEdit', e.target.checked ? '1' : '0')} />
          )
        },
        {
          title: '列表',
          width: 70,
          render: (_, record, index) => (
            <Checkbox checked={record.isList === '1'} onChange={(e) => updateColumn(index, 'isList', e.target.checked ? '1' : '0')} />
          )
        },
        {
          title: '查询',
          width: 70,
          render: (_, record, index) => (
            <Checkbox checked={record.isQuery === '1'} onChange={(e) => updateColumn(index, 'isQuery', e.target.checked ? '1' : '0')} />
          )
        },
        {
          title: '查询方式',
          width: 120,
          render: (_, record, index) => (
            <Select value={record.queryType} onChange={(value) => updateColumn(index, 'queryType', value)} style={{ width: '100%' }}>
              {queryTypes.map(type => (
                <Select.Option key={type} value={type}>{type}</Select.Option>
              ))}
            </Select>
          )
        },
        {
          title: '必填',
          width: 70,
          render: (_, record, index) => (
            <Checkbox checked={record.isRequired === '1'} onChange={(e) => updateColumn(index, 'isRequired', e.target.checked ? '1' : '0')} />
          )
        },
        {
          title: '显示类型',
          width: 140,
          render: (_, record, index) => (
            <Select value={record.htmlType} onChange={(value) => updateColumn(index, 'htmlType', value)} style={{ width: '100%' }}>
              {htmlTypes.map(type => (
                <Select.Option key={type} value={type}>{type}</Select.Option>
              ))}
            </Select>
          )
        },
        {
          title: '字典类型',
          width: 160,
          render: (_, record, index) => (
            <Select
              value={record.dictType}
              onChange={(value) => updateColumn(index, 'dictType', value)}
              style={{ width: '100%' }}
              allowClear
              showSearch
              optionFilterProp="label"
            >
              {dictOptions.map(dict => (
                <Select.Option key={dict.dictType} value={dict.dictType} label={dict.dictName}>
                  {dict.dictName} ({dict.dictType})
                </Select.Option>
              ))}
            </Select>
          )
        }
      ]}
    />
  )

  return (
    <Card>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'basic',
            label: '基本信息',
            children: (
              <Form form={basicForm} layout="vertical" initialValues={info}>
                <Row gutter={16}>
                  <Form.Item name="tableName" label="表名称" rules={[{ required: true, message: '请输入表名称' }]} style={{ flex: 1 }}>
                    <Input placeholder="请输入表名称" />
                  </Form.Item>
                  <Form.Item name="tableComment" label="表描述" rules={[{ required: true, message: '请输入表描述' }]} style={{ flex: 1 }}>
                    <Input placeholder="请输入" />
                  </Form.Item>
                  <Form.Item name="className" label="实体类名称" rules={[{ required: true, message: '请输入实体类名称' }]} style={{ flex: 1 }}>
                    <Input placeholder="请输入" />
                  </Form.Item>
                  <Form.Item name="functionAuthor" label="作者" rules={[{ required: true, message: '请输入作者' }]} style={{ flex: 1 }}>
                    <Input placeholder="请输入" />
                  </Form.Item>
                </Row>
                <Form.Item name="remark" label="备注">
                  <Input.TextArea rows={3} />
                </Form.Item>
              </Form>
            )
          },
          {
            key: 'columnInfo',
            label: '字段信息',
            children: columnTable
          },
          {
            key: 'genInfo',
            label: '生成信息',
            children: (
              <Form form={genForm} layout="vertical" initialValues={info}>
                <Row gutter={16}>
                  <Form.Item name="tplCategory" label="生成模板" rules={[{ required: true, message: '请选择生成模板' }]} style={{ flex: 1 }}>
                    <Select onChange={(value) => {
                      if (value !== 'sub') {
                        setInfo(prev => ({ ...prev, subTableName: '', subTableFkName: '' }))
                      }
                    }}>
                      <Select.Option value="crud">单表（增删改查）</Select.Option>
                      <Select.Option value="tree">树表（增删改查）</Select.Option>
                      <Select.Option value="sub">主子表（增删改查）</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="tplWebType" label="前端类型" style={{ flex: 1 }}>
                    <Select>
                      <Select.Option value="element-ui">Vue2 Element UI 模版</Select.Option>
                      <Select.Option value="element-plus">Vue3 Element Plus 模版</Select.Option>
                    </Select>
                  </Form.Item>
                </Row>
                <Row gutter={16}>
                  <Form.Item name="packageName" label="生成包路径" rules={[{ required: true, message: '请输入生成包路径' }]} style={{ flex: 1 }}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="moduleName" label="生成模块名" rules={[{ required: true, message: '请输入生成模块名' }]} style={{ flex: 1 }}>
                    <Input />
                  </Form.Item>
                </Row>
                <Row gutter={16}>
                  <Form.Item name="businessName" label="生成业务名" rules={[{ required: true, message: '请输入生成业务名' }]} style={{ flex: 1 }}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="functionName" label="生成功能名" rules={[{ required: true, message: '请输入生成功能名' }]} style={{ flex: 1 }}>
                    <Input />
                  </Form.Item>
                </Row>
                <Row gutter={16}>
                  <Form.Item name="genType" label="生成代码方式" style={{ flex: 1 }}>
                    <Radio.Group>
                      <Radio value="0">zip压缩包</Radio>
                      <Radio value="1">自定义路径</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item name="parentMenuId" label="上级菜单" style={{ flex: 1 }}>
                    <TreeSelect treeData={menus} placeholder="请选择系统菜单" treeDefaultExpandAll />
                  </Form.Item>
                </Row>
                {genForm.getFieldValue('genType') === '1' && (
                  <Form.Item name="genPath" label="自定义路径">
                    <Input placeholder="填写磁盘绝对路径" />
                  </Form.Item>
                )}
                {genForm.getFieldValue('tplCategory') === 'tree' && (
                  <Row gutter={16}>
                    <Form.Item name="treeCode" label="树编码字段" style={{ flex: 1 }}>
                      <Select>
                        {columns.map(col => (
                          <Select.Option key={col.columnName} value={col.columnName}>
                            {col.columnName}：{col.columnComment}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="treeParentCode" label="树父编码字段" style={{ flex: 1 }}>
                      <Select>
                        {columns.map(col => (
                          <Select.Option key={col.columnName} value={col.columnName}>
                            {col.columnName}：{col.columnComment}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="treeName" label="树名称字段" style={{ flex: 1 }}>
                      <Select>
                        {columns.map(col => (
                          <Select.Option key={col.columnName} value={col.columnName}>
                            {col.columnName}：{col.columnComment}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Row>
                )}
                {genForm.getFieldValue('tplCategory') === 'sub' && (
                  <Row gutter={16}>
                    <Form.Item name="subTableName" label="关联子表的表名" style={{ flex: 1 }}>
                      <Select onChange={(value) => setInfo(prev => ({ ...prev, subTableName: value, subTableFkName: '' }))}>
                        {tables.map(table => (
                          <Select.Option key={table.tableName} value={table.tableName}>
                            {table.tableName}：{table.tableComment}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="subTableFkName" label="子表关联的外键名" style={{ flex: 1 }}>
                      <Select>
                        {subColumns.map(col => (
                          <Select.Option key={col.columnName} value={col.columnName}>
                            {col.columnName}：{col.columnComment}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Row>
                )}
              </Form>
            )
          }
        ]}
      />
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <Space>
          <Button type="primary" onClick={submitForm}>提交</Button>
          <Button onClick={() => navigate('/tool/gen')}>返回</Button>
        </Space>
      </div>
    </Card>
  )
}

export default EditTable
