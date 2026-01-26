import React, { useEffect, useMemo, useState } from 'react'
import { Card, Col, Descriptions, Row, Tag } from 'antd'
import { getServer } from '@/api/monitor/server'

const Server = () => {
  const [server, setServer] = useState({})

  const getList = async () => {
    const res = await getServer()
    setServer(res.data || {})
  }

  useEffect(() => {
    getList()
  }, [])

  const cpuItems = useMemo(() => (
    [
      { label: '核心数', value: server.cpu?.cpuNum },
      { label: '用户使用率', value: server.cpu?.used && `${server.cpu.used}%` },
      { label: '系统使用率', value: server.cpu?.sys && `${server.cpu.sys}%` },
      { label: '当前空闲率', value: server.cpu?.free && `${server.cpu.free}%` }
    ]
  ), [server])

  const memoryItems = useMemo(() => (
    [
      { label: '总内存', value: server.mem?.total && `${server.mem.total}G` },
      { label: '已用内存', value: server.mem?.used && `${server.mem.used}G` },
      { label: '剩余内存', value: server.mem?.free && `${server.mem.free}G` },
      { label: '使用率', value: server.mem?.usage && `${server.mem.usage}%`, warn: server.mem?.usage > 80 }
    ]
  ), [server])

  const jvmItems = useMemo(() => (
    [
      { label: '总内存', value: server.jvm?.total && `${server.jvm.total}M` },
      { label: '已用内存', value: server.jvm?.used && `${server.jvm.used}M` },
      { label: '剩余内存', value: server.jvm?.free && `${server.jvm.free}M` },
      { label: '使用率', value: server.jvm?.usage && `${server.jvm.usage}%`, warn: server.jvm?.usage > 80 }
    ]
  ), [server])

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="CPU">
            <Descriptions column={2} size="small">
              {cpuItems.map((item) => (
                <Descriptions.Item key={item.label} label={item.label}>
                  {item.value || '-'}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="内存">
            <Descriptions column={2} size="small">
              {memoryItems.map((item) => (
                <Descriptions.Item key={item.label} label={item.label}>
                  {item.warn ? <Tag color="red">{item.value}</Tag> : (item.value || '-')}
                </Descriptions.Item>
              ))}
              {jvmItems.map((item) => (
                <Descriptions.Item key={`jvm-${item.label}`} label={`JVM ${item.label}`}>
                  {item.warn ? <Tag color="red">{item.value}</Tag> : (item.value || '-')}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Card>
        </Col>
        <Col span={24}>
          <Card title="服务器信息">
            <Descriptions column={2} size="small">
              <Descriptions.Item label="服务器名称">{server.sys?.computerName || '-'}</Descriptions.Item>
              <Descriptions.Item label="操作系统">{server.sys?.osName || '-'}</Descriptions.Item>
              <Descriptions.Item label="服务器IP">{server.sys?.computerIp || '-'}</Descriptions.Item>
              <Descriptions.Item label="系统架构">{server.sys?.osArch || '-'}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={24}>
          <Card title="Java虚拟机信息">
            <Descriptions column={2} size="small">
              <Descriptions.Item label="Java名称">{server.jvm?.name || '-'}</Descriptions.Item>
              <Descriptions.Item label="Java版本">{server.jvm?.version || '-'}</Descriptions.Item>
              <Descriptions.Item label="启动时间">{server.jvm?.startTime || '-'}</Descriptions.Item>
              <Descriptions.Item label="运行时长">{server.jvm?.runTime || '-'}</Descriptions.Item>
              <Descriptions.Item label="安装路径" span={2}>{server.jvm?.home || '-'}</Descriptions.Item>
              <Descriptions.Item label="项目路径" span={2}>{server.sys?.userDir || '-'}</Descriptions.Item>
              <Descriptions.Item label="运行参数" span={2}>{server.jvm?.inputArgs || '-'}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={24}>
          <Card title="磁盘状态">
            <Descriptions column={7} size="small">
              {(server.sysFiles || []).map((item, index) => (
                <Descriptions.Item key={index} label={item.dirName} span={7}>
                  <Row gutter={8} style={{ width: '100%' }}>
                    <Col span={4}>{item.sysTypeName}</Col>
                    <Col span={4}>{item.typeName}</Col>
                    <Col span={4}>{item.total}</Col>
                    <Col span={4}>{item.free}</Col>
                    <Col span={4}>{item.used}</Col>
                    <Col span={4}>
                      {item.usage > 80 ? <Tag color="red">{item.usage}%</Tag> : `${item.usage}%`}
                    </Col>
                  </Row>
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Server
