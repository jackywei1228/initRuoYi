import React, { useMemo, useState } from 'react'
import { Button, Card, Col, Divider, Row, Tabs, message } from 'antd'
import { DownloadOutlined, CopyOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import beautifier from 'js-beautify'
import { inputComponents, selectComponents, layoutComponents, formConf } from '@/utils/generator/config'
import { makeUpHtml, vueTemplate, vueScript, cssStyle } from '@/utils/generator/html'
import { makeUpJs } from '@/utils/generator/js'
import { makeUpCss } from '@/utils/generator/css'
import { beautifierConf } from '@/utils/index'
import { drawingDefaultValue, initDrawingDefaultValue, cleanDrawingDefaultValue } from '@/utils/generator/drawingDefault'

initDrawingDefaultValue()

const Build = () => {
  const [drawingList, setDrawingList] = useState([...drawingDefaultValue])
  const [activeTab, setActiveTab] = useState('code')

  const addComponent = (item) => {
    const clone = JSON.parse(JSON.stringify(item))
    clone.formId = Date.now()
    clone.renderKey = Date.now()
    clone.span = formConf.span
    if (!clone.layout) clone.layout = 'colFormItem'
    if (clone.layout === 'colFormItem') {
      clone.vModel = `field${clone.formId}`
      clone.placeholder !== undefined && (clone.placeholder += clone.label)
    }
    setDrawingList(prev => [...prev, clone])
  }

  const empty = () => {
    cleanDrawingDefaultValue()
    setDrawingList([])
  }

  const generateCode = () => {
    const formData = {
      fields: JSON.parse(JSON.stringify(drawingList)),
      ...formConf
    }
    const script = vueScript(makeUpJs(formData, 'file'))
    const html = vueTemplate(makeUpHtml(formData, 'file'))
    const css = cssStyle(makeUpCss(formData))
    return beautifier.html(html + script + css, beautifierConf.html)
  }

  const codeText = useMemo(() => generateCode(), [drawingList])

  const copy = async () => {
    await navigator.clipboard.writeText(codeText)
    message.success('代码已复制到剪切板')
  }

  const download = () => {
    const blob = new Blob([codeText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Form.vue'
    a.click()
    URL.revokeObjectURL(url)
  }

  const renderList = (title, list) => (
    <Card size="small" title={title} style={{ marginBottom: 12 }}>
      <Row gutter={[8, 8]}>
        {list.map((item, index) => (
          <Col span={12} key={`${title}-${index}`}>
            <Button block icon={<PlusOutlined />} onClick={() => addComponent(item)}>
              {item.label}
            </Button>
          </Col>
        ))}
      </Row>
    </Card>
  )

  return (
    <Row gutter={16}>
      <Col span={6}>
        {renderList('输入型组件', inputComponents)}
        {renderList('选择型组件', selectComponents)}
        {renderList('布局型组件', layoutComponents)}
      </Col>
      <Col span={18}>
        <Card>
          <Row justify="end" gutter={12}>
            <Button icon={<DownloadOutlined />} onClick={download}>导出vue文件</Button>
            <Button icon={<CopyOutlined />} onClick={copy}>复制代码</Button>
            <Button danger icon={<DeleteOutlined />} onClick={empty}>清空</Button>
          </Row>
          <Divider />
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'code',
                label: '生成代码',
                children: (
                  <pre style={{ whiteSpace: 'pre-wrap' }}>{codeText}</pre>
                )
              },
              {
                key: 'schema',
                label: '表单配置',
                children: (
                  <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(drawingList, null, 2)}</pre>
                )
              }
            ]}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default Build
