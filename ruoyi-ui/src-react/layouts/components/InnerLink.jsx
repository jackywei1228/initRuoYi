import React from 'react'
import { useLocation } from 'react-router-dom'

const InnerLink = () => {
  const location = useLocation()
  const link = location.state?.link || location.search?.replace('?link=', '')
  if (!link) {
    return <div style={{ padding: 24 }}>链接地址为空</div>
  }
  return (
    <iframe
      title="inner-link"
      src={decodeURIComponent(link)}
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  )
}

export default InnerLink
