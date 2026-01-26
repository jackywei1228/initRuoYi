import React, { useMemo } from 'react'
import { Button, Checkbox, Popover, Space, Tooltip } from 'antd'
import { ReloadOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons'

const RightToolbar = ({
  showSearch,
  onShowSearchChange,
  onQuery,
  columns,
  onColumnsChange
}) => {
  const columnItems = useMemo(() => Object.entries(columns || {}), [columns])

  const handleColumnToggle = (key, visible) => {
    onColumnsChange({
      ...columns,
      [key]: { ...columns[key], visible }
    })
  }

  const content = (
    <div style={{ minWidth: 180 }}>
      {columnItems.map(([key, column]) => (
        <div key={key} style={{ padding: '4px 0' }}>
          <Checkbox
            checked={column.visible}
            onChange={(e) => handleColumnToggle(key, e.target.checked)}
          >
            {column.label}
          </Checkbox>
        </div>
      ))}
    </div>
  )

  return (
    <Space>
      <Tooltip title={showSearch ? '隐藏搜索' : '显示搜索'}>
        <Button icon={<SearchOutlined />} onClick={() => onShowSearchChange(!showSearch)} />
      </Tooltip>
      <Tooltip title="刷新">
        <Button icon={<ReloadOutlined />} onClick={onQuery} />
      </Tooltip>
      <Popover content={content} placement="bottomRight" trigger="click">
        <Button icon={<SettingOutlined />} />
      </Popover>
    </Space>
  )
}

export default RightToolbar
