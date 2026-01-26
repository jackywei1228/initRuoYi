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
  message
} from 'antd'
import {
  DeleteOutlined,
  DownloadOutlined,
  CloseOutlined,
  EyeOutlined
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import RightToolbar from '@/components/RightToolbar'
import { getJob } from '@/api/monitor/job'
import { listJobLog, delJobLog, cleanJobLog } from '@/api/monitor/jobLog'
import { getDicts } from '@/api/system/dict/data'
import { addDateRange, parseTime } from '@/utils/ruoyi'
import { download } from '@/utils/request'
import { checkPermi } from '@/utils/permission'

const { RangePicker } = DatePicker

const defaultQueryParams = {
  pageNum: 1,
  pageSize: 10,
  jobName: undefined,
  jobGroup: undefined,
  status: undefined
}

const JobLog = () => {
  const navigate = useNavigate()
  const { jobId } = useParams()
  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(true)
  const [jobLogList, setJobLogList] = useState([])
  const [total, setTotal] = useState(0)
  const [queryParams, setQueryParams] = useState({ ...defaultQueryParams })
  const [dateRange, setDateRange] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [open, setOpen] = useState(false)
  const [detail, setDetail] = useState({})
  const [dictStatus, setDictStatus] = useState([])
  const [dictJobGroup, setDictJobGroup] = useState([])

  const multiple = selectedRowKeys.length === 0

  const getList = async (override = {}) => {
    setLoading(true)
    try {
      const params = addDateRange(
        { ...queryParams, ...override },
        dateRange.length ? dateRange.map(item => item.format('YYYY-MM-DD')) : []
      )
      const res = await listJobLog(params)
      setJobLogList(res.rows || [])
      setTotal(res.total || 0)
    } finally {
      setLoading(false)
    }
  }

  const fetchDicts = async () => {
    const [statusRes, groupRes] = await Promise.all([
      getDicts('sys_common_status'),
      getDicts('sys_job_group')
    ])
    setDictStatus(statusRes.data || [])
    setDictJobGroup(groupRes.data || [])
  }

  const handleQuery = () => {
    const nextParams = { ...queryParams, pageNum: 1 }
    setQueryParams(nextParams)
    getList(nextParams)
  }

  const resetQuery = () => {
    setDateRange([])
    setQueryParams({ ...defaultQueryParams, jobName: queryParams.jobName, jobGroup: queryParams.jobGroup })
    getList({ ...defaultQueryParams, jobName: queryParams.jobName, jobGroup: queryParams.jobGroup })
  }

  const handleClose = () => {
    navigate('/monitor/job')
  }

  const handleSelectionChange = (keys) => {
    setSelectedRowKeys(keys)
  }

  const handleView = (row) => {
    setDetail(row)
    setOpen(true)
  }

  const handleDelete = () => {
    const jobLogIds = selectedRowKeys.join(',')
    Modal.confirm({
      title: '系统提示',
      content: `是否确认删除调度日志编号为"${jobLogIds}"的数据项？`,
      onOk: async () => {
        await delJobLog(jobLogIds)
        message.success('删除成功')
        getList()
      }
    })
  }

  const handleClean = () => {
    Modal.confirm({
      title: '系统提示',
      content: '是否确认清空所有调度日志数据项？',
      onOk: async () => {
        await cleanJobLog()
        message.success('清空成功')
        getList()
      }
    })
  }

  const handleExport = () => {
    download('/monitor/jobLog/export', { ...queryParams }, `log_${Date.now()}.xlsx`)
  }

  useEffect(() => {
    if (jobId && jobId !== '0') {
      getJob(jobId).then(res => {
        const jobName = res.data?.jobName
        const jobGroup = res.data?.jobGroup
        const nextParams = { ...defaultQueryParams, jobName, jobGroup }
        setQueryParams(nextParams)
        getList(nextParams)
      })
    } else {
      getList()
    }
    fetchDicts()
  }, [jobId])

  const columns = useMemo(() => [
    { title: '日志编号', dataIndex: 'jobLogId', align: 'center', width: 80 },
    { title: '任务名称', dataIndex: 'jobName', align: 'center', ellipsis: true },
    {
      title: '任务组名',
      dataIndex: 'jobGroup',
      align: 'center',
      render: (value) => dictJobGroup.find(item => item.value === value)?.label || value
    },
    { title: '调用目标字符串', dataIndex: 'invokeTarget', align: 'center', ellipsis: true },
    { title: '日志信息', dataIndex: 'jobMessage', align: 'center', ellipsis: true },
    {
      title: '执行状态',
      dataIndex: 'status',
      align: 'center',
      render: (value) => dictStatus.find(item => item.value === value)?.label || value
    },
    { title: '执行时间', dataIndex: 'createTime', align: 'center', width: 180, render: (value) => <span>{parseTime(value)}</span> },
    {
      title: '操作',
      align: 'center',
      render: (_, record) => (
        checkPermi(['monitor:job:query']) ? (
          <Button size="small" type="link" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            详细
          </Button>
        ) : null
      )
    }
  ], [dictStatus, dictJobGroup])

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
              style={{ width: 240 }}
            />
          </Form.Item>
          <Form.Item label="任务组名">
            <Select
              placeholder="请选择任务组名"
              allowClear
              value={queryParams.jobGroup}
              onChange={(value) => setQueryParams({ ...queryParams, jobGroup: value })}
              style={{ width: 240 }}
            >
              {dictJobGroup.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="执行状态">
            <Select
              placeholder="请选择执行状态"
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
          <Form.Item label="执行时间">
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
          {checkPermi(['monitor:job:remove']) && (
            <Button icon={<DeleteOutlined />} danger disabled={multiple} onClick={handleDelete}>
              删除
            </Button>
          )}
          {checkPermi(['monitor:job:remove']) && (
            <Button icon={<DeleteOutlined />} danger onClick={handleClean}>
              清空
            </Button>
          )}
          {checkPermi(['monitor:job:export']) && (
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              导出
            </Button>
          )}
          <Button icon={<CloseOutlined />} onClick={handleClose}>关闭</Button>
        </Space>
        <RightToolbar showSearch={showSearch} onShowSearchChange={setShowSearch} onQuery={getList} />
      </Row>

      <Table
        rowKey="jobLogId"
        loading={loading}
        dataSource={jobLogList}
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
        title="调度日志详细"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={700}
      >
        <Row gutter={16}>
          <div style={{ width: '100%', marginBottom: 16 }}>
            日志序号：{detail.jobLogId} / 任务名称：{detail.jobName}
          </div>
          <div style={{ width: '100%', marginBottom: 16 }}>
            任务分组：{detail.jobGroup} / 执行时间：{detail.createTime}
          </div>
          <div style={{ width: '100%', marginBottom: 16 }}>调用方法：{detail.invokeTarget}</div>
          <div style={{ width: '100%', marginBottom: 16 }}>日志信息：{detail.jobMessage}</div>
          <div style={{ width: '100%', marginBottom: 16 }}>
            执行状态：{detail.status === 0 ? '正常' : detail.status === 1 ? '失败' : ''}
          </div>
          {detail.status === 1 && (
            <div style={{ width: '100%', marginBottom: 16 }}>异常信息：{detail.exceptionInfo}</div>
          )}
        </Row>
      </Modal>
    </Card>
  )
}

export default JobLog
