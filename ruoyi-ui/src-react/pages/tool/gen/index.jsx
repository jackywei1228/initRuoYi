import React, { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  message
} from 'antd'
import {
  DownloadOutlined,
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import RightToolbar from '@/components/RightToolbar'
import {
  listTable,
  listDbTable,
  importTable,
  createTable,
  previewTable,
  delTable,
  genCode,
  synchDb
} from '@/api/tool/gen'
import { addDateRange, parseTime } from '@/utils/ruoyi'
import { checkPermi, checkRole } from '@/utils/permission'

const { RangePicker } = DatePicker

const defaultQueryParams = {
  pageNum: 1,
  pageSize: 10,
  tableName: undefined,
  tableComment: undefined,
  orderByColumn: 'createTime',
  isAsc: 'descending'
}

const Gen = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(true)
  const [tableList, setTableList] = useState([])
  const [total, setTotal] = useState(0)
  const [queryParams, setQueryParams] = useState({ ...defaultQueryParams })
  const [dateRange, setDateRange] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewData, setPreviewData] = useState({})
  const [importOpen, setImportOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [dbTableList, setDbTableList] = useState([])
  const [dbTotal, setDbTotal] = useState(0)
  const [dbQuery, setDbQuery] = useState({ pageNum: 1, pageSize: 10, tableName: undefined, tableComment: undefined })
  const [dbSelected, setDbSelected] = useState([])
  const [createSql, setCreateSql] = useState('')

  const single = selectedRowKeys.length !== 1
  const multiple = selectedRowKeys.length === 0

  const getList = async (override = {}) => {
    setLoading(true)
    try {
      const params = addDateRange(
        { ...queryParams, ...override },
        dateRange.length ? dateRange.map(item => item.format('YYYY-MM-DD')) : []
      )
      const res = await listTable(params)
      setTableList(res.rows || [])
      setTotal(res.total || 0)
    } finally {
      setLoading(false)
    }
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

  const handleSelectionChange = (keys, rows) => {
    setSelectedRowKeys(keys)
    setSelectedRows(rows)
  }

  const handleGenTable = async (row) => {
    const tableName = row?.tableName || selectedRows.map(item => item.tableName).join(',')
    if (!tableName) {
      message.error('请选择要生成的数据')
      return
    }
    if (row?.genType === '1') {
      await genCode(row.tableName)
      message.success(`成功生成到自定义路径：${row.genPath}`)
    } else {
      const url = `${process.env.VUE_APP_BASE_API}/tool/gen/batchGenCode?tables=${tableName}`
      window.open(url, '_blank')
    }
  }

  const handleSynchDb = (row) => {
    Modal.confirm({
      title: '系统提示',
      content: `确认要强制同步"${row.tableName}"表结构吗？`,
      onOk: async () => {
        await synchDb(row.tableName)
        message.success('同步成功')
      }
    })
  }

  const handlePreview = async (row) => {
    const res = await previewTable(row.tableId)
    setPreviewData(res.data || {})
    setPreviewOpen(true)
  }

  const handleEditTable = (row) => {
    const tableId = row?.tableId || selectedRowKeys[0]
    const tableName = row?.tableName || selectedRows[0]?.tableName
    navigate(`/tool/gen-edit/index/${tableId}`, { state: { tableName, pageNum: queryParams.pageNum } })
  }

  const handleDelete = (row) => {
    const tableIds = row?.tableId || selectedRowKeys.join(',')
    Modal.confirm({
      title: '系统提示',
      content: `是否确认删除表编号为"${tableIds}"的数据项？`,
      onOk: async () => {
        await delTable(tableIds)
        message.success('删除成功')
        getList()
      }
    })
  }

  const openImportTable = () => {
    setImportOpen(true)
    loadDbTables()
  }

  const loadDbTables = async () => {
    const res = await listDbTable(dbQuery)
    setDbTableList(res.rows || [])
    setDbTotal(res.total || 0)
  }

  const handleImportTable = async () => {
    const tableNames = dbSelected.map(item => item.tableName).join(',')
    if (!tableNames) {
      message.error('请选择要导入的表')
      return
    }
    const res = await importTable({ tables: tableNames })
    message.success(res.msg || '导入成功')
    setImportOpen(false)
    getList()
  }

  const openCreateTable = () => {
    setCreateSql('')
    setCreateOpen(true)
  }

  const handleCreateTable = async () => {
    if (!createSql) {
      message.error('请输入建表语句')
      return
    }
    const res = await createTable({ sql: createSql })
    message.success(res.msg || '创建成功')
    setCreateOpen(false)
    getList()
  }

  useEffect(() => {
    getList()
  }, [])

  const columns = useMemo(() => [
    { title: '序号', width: 50, align: 'center', render: (_, __, index) => (queryParams.pageNum - 1) * queryParams.pageSize + index + 1 },
    { title: '表名称', dataIndex: 'tableName', align: 'center', width: 120, ellipsis: true },
    { title: '表描述', dataIndex: 'tableComment', align: 'center', width: 120, ellipsis: true },
    { title: '实体', dataIndex: 'className', align: 'center', width: 120, ellipsis: true },
    { title: '创建时间', dataIndex: 'createTime', align: 'center', width: 160, sorter: true },
    { title: '更新时间', dataIndex: 'updateTime', align: 'center', width: 160, sorter: true },
    {
      title: '操作',
      align: 'center',
      render: (_, record) => (
        <Space>
          {checkPermi(['tool:gen:preview']) && (
            <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handlePreview(record)}>
              预览
            </Button>
          )}
          {checkPermi(['tool:gen:edit']) && (
            <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditTable(record)}>
              编辑
            </Button>
          )}
          {checkPermi(['tool:gen:remove']) && (
            <Button type="link" size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
              删除
            </Button>
          )}
          {checkPermi(['tool:gen:edit']) && (
            <Button type="link" size="small" icon={<ReloadOutlined />} onClick={() => handleSynchDb(record)}>
              同步
            </Button>
          )}
          {checkPermi(['tool:gen:code']) && (
            <Button type="link" size="small" icon={<DownloadOutlined />} onClick={() => handleGenTable(record)}>
              生成代码
            </Button>
          )}
        </Space>
      )
    }
  ], [queryParams])

  return (
    <Card>
      {showSearch && (
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item label="表名称">
            <Input
              placeholder="请输入表名称"
              value={queryParams.tableName}
              onChange={(e) => setQueryParams({ ...queryParams, tableName: e.target.value })}
              onPressEnter={handleQuery}
            />
          </Form.Item>
          <Form.Item label="表描述">
            <Input
              placeholder="请输入表描述"
              value={queryParams.tableComment}
              onChange={(e) => setQueryParams({ ...queryParams, tableComment: e.target.value })}
              onPressEnter={handleQuery}
            />
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
          {checkPermi(['tool:gen:code']) && (
            <Button icon={<DownloadOutlined />} disabled={multiple} onClick={() => handleGenTable()}>
              生成
            </Button>
          )}
          {checkRole(['admin']) && (
            <Button icon={<PlusOutlined />} onClick={openCreateTable}>
              创建
            </Button>
          )}
          {checkPermi(['tool:gen:import']) && (
            <Button icon={<UploadOutlined />} onClick={openImportTable}>
              导入
            </Button>
          )}
          {checkPermi(['tool:gen:edit']) && (
            <Button icon={<EditOutlined />} disabled={single} onClick={() => handleEditTable()}>
              修改
            </Button>
          )}
          {checkPermi(['tool:gen:remove']) && (
            <Button icon={<DeleteOutlined />} danger disabled={multiple} onClick={() => handleDelete()}>
              删除
            </Button>
          )}
        </Space>
        <RightToolbar showSearch={showSearch} onShowSearchChange={setShowSearch} onQuery={getList} />
      </Row>

      <Table
        rowKey="tableId"
        loading={loading}
        dataSource={tableList}
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
        onChange={(_, __, sorter) => {
          const nextParams = { ...queryParams, orderByColumn: sorter.field, isAsc: sorter.order }
          setQueryParams(nextParams)
          getList(nextParams)
        }}
      />

      <Modal title="代码预览" open={previewOpen} onCancel={() => setPreviewOpen(false)} footer={null} width="80%">
        <Tabs
          items={Object.keys(previewData).map((key) => ({
            key,
            label: key.substring(key.lastIndexOf('/') + 1, key.indexOf('.vm')),
            children: (
              <pre style={{ whiteSpace: 'pre-wrap' }}>{previewData[key]}</pre>
            )
          }))}
        />
      </Modal>

      <Modal title="导入表" open={importOpen} onCancel={() => setImportOpen(false)} onOk={handleImportTable} width={800}>
        <Form layout="inline" style={{ marginBottom: 12 }}>
          <Form.Item label="表名称">
            <Input
              placeholder="请输入表名称"
              value={dbQuery.tableName}
              onChange={(e) => setDbQuery({ ...dbQuery, tableName: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="表描述">
            <Input
              placeholder="请输入表描述"
              value={dbQuery.tableComment}
              onChange={(e) => setDbQuery({ ...dbQuery, tableComment: e.target.value })}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={loadDbTables}>搜索</Button>
              <Button onClick={() => setDbQuery({ ...dbQuery, tableName: undefined, tableComment: undefined })}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
        <Table
          rowKey="tableName"
          dataSource={dbTableList}
          columns={[
            { title: '表名称', dataIndex: 'tableName', ellipsis: true },
            { title: '表描述', dataIndex: 'tableComment', ellipsis: true },
            { title: '创建时间', dataIndex: 'createTime' },
            { title: '更新时间', dataIndex: 'updateTime' }
          ]}
          rowSelection={{ selectedRowKeys: dbSelected.map(item => item.tableName), onChange: (_, rows) => setDbSelected(rows) }}
          pagination={{
            total: dbTotal,
            current: dbQuery.pageNum,
            pageSize: dbQuery.pageSize,
            showSizeChanger: true,
            onChange: (page, pageSize) => {
              setDbQuery({ ...dbQuery, pageNum: page, pageSize })
              loadDbTables()
            }
          }}
          scroll={{ y: 260 }}
        />
      </Modal>

      <Modal title="创建表" open={createOpen} onCancel={() => setCreateOpen(false)} onOk={handleCreateTable} width={800}>
        <div style={{ marginBottom: 8 }}>创建表语句(支持多个建表语句)：</div>
        <Input.TextArea rows={10} value={createSql} onChange={(e) => setCreateSql(e.target.value)} placeholder="请输入文本" />
      </Modal>
    </Card>
  )
}

export default Gen
