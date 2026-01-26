import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, Descriptions, Row } from 'antd'
import * as echarts from 'echarts'
import { getCache } from '@/api/monitor/cache'

const Cache = () => {
  const [cache, setCache] = useState({})
  const commandRef = useRef(null)
  const memoryRef = useRef(null)

  const getList = async () => {
    const res = await getCache()
    setCache(res.data || {})
  }

  useEffect(() => {
    getList()
  }, [])

  useEffect(() => {
    if (!cache.info) return
    if (commandRef.current) {
      const chart = echarts.init(commandRef.current)
      chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '命令',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: cache.commandStats || [],
            animationEasing: 'cubicInOut',
            animationDuration: 1000
          }
        ]
      })
      window.addEventListener('resize', () => chart.resize())
    }
    if (memoryRef.current) {
      const chart = echarts.init(memoryRef.current)
      const value = parseFloat(cache.info.used_memory_human) || 0
      chart.setOption({
        tooltip: {
          formatter: `{b} <br/>{a} : ${cache.info.used_memory_human}`
        },
        series: [
          {
            name: '峰值',
            type: 'gauge',
            min: 0,
            max: 1000,
            detail: { formatter: cache.info.used_memory_human },
            data: [{ value, name: '内存消耗' }]
          }
        ]
      })
      window.addEventListener('resize', () => chart.resize())
    }
  }, [cache])

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="基本信息">
            <Descriptions column={4} size="small">
              <Descriptions.Item label="Redis版本">{cache.info?.redis_version || '-'}</Descriptions.Item>
              <Descriptions.Item label="运行模式">{cache.info?.redis_mode === 'standalone' ? '单机' : '集群'}</Descriptions.Item>
              <Descriptions.Item label="端口">{cache.info?.tcp_port || '-'}</Descriptions.Item>
              <Descriptions.Item label="客户端数">{cache.info?.connected_clients || '-'}</Descriptions.Item>
              <Descriptions.Item label="运行时间(天)">{cache.info?.uptime_in_days || '-'}</Descriptions.Item>
              <Descriptions.Item label="使用内存">{cache.info?.used_memory_human || '-'}</Descriptions.Item>
              <Descriptions.Item label="使用CPU">{cache.info?.used_cpu_user_children || '-'}</Descriptions.Item>
              <Descriptions.Item label="内存配置">{cache.info?.maxmemory_human || '-'}</Descriptions.Item>
              <Descriptions.Item label="AOF是否开启">{cache.info?.aof_enabled === '0' ? '否' : '是'}</Descriptions.Item>
              <Descriptions.Item label="RDB是否成功">{cache.info?.rdb_last_bgsave_status || '-'}</Descriptions.Item>
              <Descriptions.Item label="Key数量">{cache.dbSize || '-'}</Descriptions.Item>
              <Descriptions.Item label="网络入口/出口">{cache.info ? `${cache.info.instantaneous_input_kbps}kps/${cache.info.instantaneous_output_kbps}kps` : '-'}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="命令统计">
            <div ref={commandRef} style={{ height: 420 }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="内存信息">
            <div ref={memoryRef} style={{ height: 420 }} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Cache
