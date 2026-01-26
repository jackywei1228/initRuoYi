import React from 'react'
import IFrame from '@/components/iFrame'

const Druid = () => {
  const url = `${process.env.VUE_APP_BASE_API}/druid/login.html`
  return <IFrame src={url} />
}

export default Druid
