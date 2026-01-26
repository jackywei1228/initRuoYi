import React, { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  Dropdown,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  Table,
  message
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  MoreOutlined,
  PlayCircleOutlined,
  FileSearchOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import RightToolbar from '@/components/RightToolbar'
import { listJob, getJob, delJob, addJob, updateJob, runJob, changeJobStatus } from '@/api/monitor/job'
import { getDicts } from '@/api/system/dict/data'
import { parseTime } from '@/utils/ruoyi'
import { download } from '@/utils/request'
import { checkPermi } from '@/utils/permission'

const defaultQueryParams = {
  pageNum: 1,
  pageSize: 10,
  jobName: undefined,
  jobGroup: undefined,
  status: undefined
}

const defaultFormState = {
  jobId: undefined,
  jobName: undefined,
  jobGroup: undefined,
  invokeTarget: undefined,
  cronExpression: undefined,
  misfirePolicy: '1',
  concurrent: '1',
  status: '0'
}

const Job = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(true)
  const [jobList, setJobList] = useState([])
  const [total, setTotal] = useState(0)
  const [queryParams, setQueryParams] = useState({ ...defaultQueryParams })
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [open, setOpen] = useState(false)
  const [openView, setOpenView] = useState(false)
  const [openCron, setOpenCron] = useState(false)
  const [title, setTitle] = useState('')
  const [expression, setExpression] = useState('')
  const [formData, setFormData] = useState({ ...defaultFormState })
  const [dictJobGroup, setDictJobGroup] = useState([])
  const [dictJobStatus, setDictJobStatus] = useState([])
  const [form] = Form.useForm()

  const single = selectedRowKeys.length !== 1
  const multiple = selectedRowKeys.length === 0

  const getList = async (override = {}) => {
    setLoading(true)
    try {
      const res = await listJob({ ...queryParams, ...override })
      setJobList(res.rows || [])
      setTotal(res.total || 0)
    } finally {
      setLoading(false)
    }
  }

  const fetchDicts = async () => {
    const [groupRes, statusRes] = await Promise.all([
      getDicts('sys_job_group'),
      getDicts('sys_job_status')
    ])
    setDictJobGroup(groupRes.data || [])
    setDictJobStatus(statusRes.data || [])
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

  const handleStatusChange = (row, checked) => {
    const nextStatus = checked ? '0' : '1'
    const text = nextStatus === '0' ? '启用' : '停用'
    setJobList(prev => prev.map(item => (
      item.jobId === row.jobId ? { ...item, status: nextStatus } : item
    )))
    Modal.confirm({
      title: '系统提示',
      content: `确认要"${text}""${row.jobName}"任务吗？`,
      onOk: async () => {
        await changeJobStatus(row.jobId, nextStatus)
        message.success(`${text}成功`)
        getList()
      },
      onCancel: () => {
        setJobList(prev => prev.map(item => (
          item.jobId === row.jobId ? { ...item, status: row.status } : item
        )))
      }
    })
  }

  const handleRun = (row) => {
    Modal.confirm({
      title: '系统提示',
      content: `确认要立即执行一次"${row.jobName}"任务吗？`,
      onOk: async () => {
        await runJob(row.jobId, row.jobGroup)
        message.success('执行成功')
      }
    })
  }

  const handleView = async (row) => {
    const res = await getJob(row.jobId)
    setFormData(res.data)
    setOpenView(true)
  }

  const handleJobLog = (row) => {
    const jobId = row?.jobId || 0
    navigate(`/monitor/job-log/index/${jobId}`)
  }

  const handleAdd = () => {
    const nextForm = { ...defaultFormState }
    setFormData(nextForm)
    form.setFieldsValue(nextForm)
    setOpen(true)
    setTitle('添加任务')
  }

  const handleUpdate = async (row) => {
    const jobId = row?.jobId || selectedRowKeys
    const res = await getJob(jobId)
    setFormData(res.data)
    form.setFieldsValue(res.data)
    setOpen(true)
    setTitle('修改任务')
  }

  const handleDelete = (row) => {
    const jobIds = row?.jobId || selectedRowKeys.join(',')
    Modal.confirm({
      title: '系统提示',
      content: `是否确认删除定时任务编号为"${jobIds}"的数据项？`,
      onOk: async () => {
        await delJob(jobIds)
        message.success('删除成功')
        getList()
      }
    })
  }

  const submitForm = async () => {
    const values = await form.validateFields()
    const payload = { ...formData, ...values }
    if (payload.jobId) {
      await updateJob(payload)
      message.success('修改成功')
    } else {
      await addJob(payload)
      message.success('新增成功')
    }
    setOpen(false)
    getList()
  }

  const handleExport = () => {
    download('monitor/job/export', { ...queryParams }, `job_${Date.now()}.xlsx`)
  }

  useEffect(() => {
    getList()
    fetchDicts()
  }, [])

  const columns = useMemo(() => [
    { title: '任务编号', dataIndex: 'jobId', align: 'center', width: 100 },
    { title: '任务名称', dataIndex: 'jobName', align: 'center', ellipsis: true },
    {
      title: '任务组名',
      dataIndex: 'jobGroup',
      align: 'center',
      render: (value) => dictJobGroup.find(item => item.value === value)?.label || value
    },
    { title: '调用目标字符串', dataIndex: 'invokeTarget', align: 'center', ellipsis: true },
    { title: 'cron执行表达式', dataIndex: 'cronExpression', align: 'center', ellipsis: true },
    {
      title: '状态',
      align: 'center',
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
      title: '操作',
      align: 'center',
      render: (_, record) => (
        <Space>
          {checkPermi(['monitor:job:edit']) && (
            <Button size="small" type="link" icon={<EditOutlined />} onClick={() => handleUpdate(record)}>
              修改
            </Button>
          )}
          {checkPermi(['monitor:job:remove']) && (
            <Button size="small" type="link" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record)}>
              删除
            </Button>
          )}
          {(checkPermi(['monitor:job:changeStatus']) || checkPermi(['monitor:job:query'])) && (
            <Dropdown
              menu={{
                items: [
                  checkPermi(['monitor:job:changeStatus']) ? { key: 'run', label: '执行一次' } : null,
                  checkPermi(['monitor:job:query']) ? { key: 'view', label: '任务详细' } : null,
                  checkPermi(['monitor:job:query']) ? { key: 'log', label: '调度日志' } : null
                ].filter(Boolean),
                onClick: ({ key }) => {
                  if (key === 'run') handleRun(record)
                  if (key === 'view') handleView(record)
                  if (key === 'log') handleJobLog(record)
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
    }
  ], [dictJobGroup])

  return (
    <Card>
      {showSearch && (
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item label="任务名称">
            <Input
              placeholder="请输入任务名称"
              value={queryParams.jobName}
              onChange={(e) => setQueryParams({ ...queryParams, jobName: e.target.value })}
              onPressEnter={handleQuery}
            />
          </Form.Item>
          <Form.Item label="任务组名">
            <Select
              placeholder="请选择任务组名"
              allowClear
              value={queryParams.jobGroup}
              onChange={(value) => setQueryParams({ ...queryParams, jobGroup: value })}
              style={{ width: 200 }}
            >
              {dictJobGroup.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="任务状态">
            <Select
              placeholder="请选择任务状态"
              allowClear
              value={queryParams.status}
              onChange={(value) => setQueryParams({ ...queryParams, status: value })}
              style={{ width: 200 }}
            >
              {dictJobStatus.map((item) => (
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
          {checkPermi(['monitor:job:add']) && (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增
            </Button>
          )}
          {checkPermi(['monitor:job:edit']) && (
            <Button icon={<EditOutlined />} disabled={single} onClick={() => handleUpdate()}>
              修改
            </Button>
          )}
          {checkPermi(['monitor:job:remove']) && (
            <Button icon={<DeleteOutlined />} danger disabled={multiple} onClick={() => handleDelete()}>
              删除
            </Button>
          )}
          {checkPermi(['monitor:job:export']) && (
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              导出
            </Button>
          )}
          {checkPermi(['monitor:job:query']) && (
            <Button icon={<FileSearchOutlined />} onClick={() => handleJobLog()}>
              日志
            </Button>
          )}
        </Space>
        <RightToolbar showSearch={showSearch} onShowSearchChange={setShowSearch} onQuery={getList} />
      </Row>

      <Table
        rowKey="jobId"
        loading={loading}
        dataSource={jobList}
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
        width={800}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={formData}>
          <Row gutter={16}>
            <Form.Item name="jobName" label="任务名称" rules={[{ required: true, message: '任务名称不能为空' }]} style={{ flex: 1 }}>
              <Input placeholder="请输入任务名称" />
            </Form.Item>
            <Form.Item name="jobGroup" label="任务分组" rules={[{ required: true, message: '请选择任务分组' }]} style={{ flex: 1 }}>
              <Select placeholder="请选择任务分组">
                {dictJobGroup.map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Row>
          <Form.Item name="invokeTarget" label="调用方法" rules={[{ required: true, message: '调用目标字符串不能为空' }]}>
            <Input placeholder="请输入调用目标字符串" />
          </Form.Item>
          <Form.Item name="cronExpression" label="cron表达式" rules={[{ required: true, message: 'cron执行表达式不能为空' }]}>
            <Input
              placeholder="请输入cron执行表达式"
              addonAfter={
                <Button type="link" onClick={() => {
                  setExpression(form.getFieldValue('cronExpression') || '')
                  setOpenCron(true)
                }}>
                  生成表达式
                </Button>
              }
            />
          </Form.Item>
          {formData.jobId !== undefined && (
            <Form.Item name="status" label="状态">
              <Radio.Group>
                {dictJobStatus.map((item) => (
                  <Radio key={item.value} value={item.value}>{item.label}</Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          )}
          <Row gutter={16}>
            <Form.Item name="misfirePolicy" label="执行策略" style={{ flex: 1 }}>
              <Radio.Group>
                <Radio.Button value="1">立即执行</Radio.Button>
                <Radio.Button value="2">执行一次</Radio.Button>
                <Radio.Button value="3">放弃执行</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="concurrent" label="是否并发" style={{ flex: 1 }}>
              <Radio.Group>
                <Radio.Button value="0">允许</Radio.Button>
                <Radio.Button value="1">禁止</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Row>
        </Form>
      </Modal>

      <Modal
        title="Cron表达式生成器"
        open={openCron}
        onCancel={() => setOpenCron(false)}
        onOk={() => {
          form.setFieldsValue({ cronExpression: expression })
          setOpenCron(false)
        }}
      >
        <Input.TextArea
          rows={4}
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="请输入cron表达式"
        />
        <div style={{ marginTop: 12, color: '#888' }}>
          Bean调用示例：ryTask.ryParams('ry')
          <br />Class类调用示例：com.ruoyi.quartz.task.RyTask.ryParams('ry')
        </div>
      </Modal>

      <Modal
        title="任务详细"
        open={openView}
        onCancel={() => setOpenView(false)}
        footer={null}
        width={700}
      >
        <Row gutter={16}>
          <div style={{ width: '100%', marginBottom: 16 }}>
            任务编号：{formData.jobId} / 任务名称：{formData.jobName}
          </div>
          <div style={{ width: '100%', marginBottom: 16 }}>
            任务分组：{dictJobGroup.find(item => item.value === formData.jobGroup)?.label || formData.jobGroup} / 创建时间：{formData.createTime}
          </div>
          <div style={{ width: '100%', marginBottom: 16 }}>
            cron表达式：{formData.cronExpression}
          </div>
          <div style={{ width: '100%', marginBottom: 16 }}>
            下次执行时间：{parseTime(formData.nextValidTime)}
          </div>
          <div style={{ width: '100%', marginBottom: 16 }}>
            调用目标方法：{formData.invokeTarget}
          </div>
          <div style={{ width: '100%', marginBottom: 16 }}>
            任务状态：{formData.status === '0' ? '正常' : '暂停'}
          </div>
          <div style={{ width: '100%', marginBottom: 16 }}>
            是否并发：{formData.concurrent === '0' ? '允许' : '禁止'}
          </div>
          <div style={{ width: '100%', marginBottom: 16 }}>
            执行策略：{formData.misfirePolicy === '1' ? '立即执行' : formData.misfirePolicy === '2' ? '执行一次' : '放弃执行'}
          </div>
        </Row>
      </Modal>
    </Card>
  )
}

export default Job
