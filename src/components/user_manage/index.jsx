import React, { forwardRef, useState, useEffect } from 'react'
// forwardRef/useRef 高阶组件
import { Form, Input, Select } from 'antd'
const { Option } = Select;

const UserFrom = forwardRef((props, ref) => {
  const [isDisable, setIsDisable] = useState(false)
  useEffect(() => {
    setIsDisable(props.isUpdateDisabled)
  }, [props.isUpdateDisabled])
  const { roleId, region } = JSON.parse(sessionStorage.getItem('token'))
  const roleObj = {
    "1": "superadmin",
    "2": "admin",
    "3": "editor"
  }
  const checkRegionDisabled = (item) => {
    if (props.isUpdate) {//更新
      if (roleObj[roleId] === "superadmin") {
        return false
      } else {
        return true
      }
    } else {//创建
      if (roleObj[roleId] === "superadmin") {
        return false
      } else {
        return item.value !== region
      }
    }
  }
  const checkRoleDisabled = (item) => {
    if (props.isUpdate) {//更新
      if (roleObj[roleId] === "superadmin") {
        return false
      } else {
        return true
      }
    } else {//创建
      if (roleObj[roleId] === "superadmin") {
        return false
      } else {
        return roleObj[item.id] !== "editor"
      }
    }
  }
  return (
    <Form layout="vertical" ref={ref}>
      <Form.Item
        name="username"
        label="用户名"
        rules={[{ required: true, message: '请填写用户名' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[{ required: true, message: '请填写密码' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="region"
        label="区域"
        rules={isDisable ? [] : [{ required: true, message: '请选择区域' }]}
      >
        <Select disabled={isDisable}>
          {
            props.regionList.map(item =>
              <Option value={item.value} key={item.id} disabled={(checkRegionDisabled(item))}>{item.title}</Option>
            )
          }
        </Select>
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={[{ required: true, message: '请选择角色' }]}
      >
        <Select onChange={(value) => {
          // console.log(value);
          if (value === 1) {
            setIsDisable(true)
            ref.current.setFieldsValue({
              region: ""
            })
          } else {
            setIsDisable(false)
          }
        }}>
          {
            props.rolelist.map(item =>
              <Option value={item.id} key={item.id} disabled={(checkRoleDisabled(item))}>{item.roleName}</Option>
            )
          }
        </Select>
      </Form.Item>
    </Form>
  )
})

export default UserFrom