import { Button, Result } from 'antd'
import React from 'react'

export default function NoPermission(props) {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={() => props.history.push('/')}>
          Back Home
        </Button>
      }
    />
  )
}
