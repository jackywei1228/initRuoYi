import React, { useMemo } from 'react'

const svgIcons = import.meta.glob('../assets/icons/svg/*.svg', {
  eager: true,
  import: 'default',
  query: '?url'
})

const getIconUrl = (name) => {
  const match = Object.keys(svgIcons).find((key) => key.endsWith(`/${name}.svg`))
  return match ? svgIcons[match] : ''
}

const SvgIcon = ({ iconClass, size = 18 }) => {
  const url = useMemo(() => getIconUrl(iconClass), [iconClass])
  if (!url) {
    return <span style={{ fontSize: size }}>{iconClass || '-'}</span>
  }
  return <img src={url} alt={iconClass} style={{ width: size, height: size }} />
}

export default SvgIcon
