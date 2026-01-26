import React, { useMemo, useState } from 'react'
import { Input, List } from 'antd'
import SvgIcon from './SvgIcon'

const svgIcons = import.meta.glob('../assets/icons/svg/*.svg', {
  eager: true,
  import: 'default',
  query: '?url'
})

const iconNames = Object.keys(svgIcons).map((key) => key.split('/').pop().replace('.svg', ''))

const IconSelect = ({ value, onChange }) => {
  const [keyword, setKeyword] = useState('')

  const filtered = useMemo(() => {
    if (!keyword) return iconNames
    return iconNames.filter((name) => name.includes(keyword))
  }, [keyword])

  return (
    <div style={{ width: 440 }}>
      <Input
        placeholder="搜索图标"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ marginBottom: 12 }}
      />
      <List
        grid={{ gutter: 8, column: 6 }}
        dataSource={filtered}
        renderItem={(item) => (
          <List.Item
            style={{ cursor: 'pointer', textAlign: 'center' }}
            onClick={() => onChange?.(item)}
          >
            <div>
              <SvgIcon iconClass={item} size={20} />
            </div>
            <div style={{ fontSize: 12 }}>{item}</div>
          </List.Item>
        )}
      />
    </div>
  )
}

export default IconSelect
