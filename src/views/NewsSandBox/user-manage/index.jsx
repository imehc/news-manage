import React, { useState, useEffect, useRef } from 'react'
// forwardRef/useRef 高阶组件
import { Button, Table, Switch, Modal } from 'antd'
import axios from 'axios'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import UserFrom from '../../../components/user_manage/UserFrom';
const { confirm } = Modal;


export default function UserList() {
  const [dataSource, setDataSource] = useState([])
  const [isAddVisible, setIsAddVisible] = useState(false)//添加
  const [isUpdateVisible, setIsUpdateVisible] = useState(false)//更新
  const [rolelist, setRolelist] = useState([])
  const [regionList, setRegionList] = useState([])
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)
  const [current, setCurrent] = useState(null)

  const addFrom = useRef(null)
  const updateFrom = useRef(null)

  const { roleId, username, region } = JSON.parse(sessionStorage.getItem('token'))
  useEffect(() => {
    const roleObj = {
      "1": "superadmin",
      "2": "admin",
      "3": "editor"
    }
    axios.get("/users?_expand=role").then(res => {
      console.log('用户列表', res.data);
      const list = res.data
      setDataSource(roleObj[roleId] === "superadmin" ? list : [...list.filter(item => item.username === username), ...list.filter(item => item.region === region && roleObj[item.roleId] === "editor")])
    })
  }, [roleId, username, region])
  useEffect(() => {
    axios.get("/regions").then(res => {
      setRegionList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get("/roles").then(res => {
      setRolelist(res.data)
    })
  }, [])
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map(item => ({
          text: item.title,
          value: item.value
        })),
        {
          text: '全球',
          value: '全球'
        }
      ],
      onFilter: (value, record) => {
        if (value === "全球") {
          return record.region === ""
        }
        return record.region === value
      },
      key: 'region',
      render: (region) => {
        return <b>{region === "" ? "全球" : region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role?.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      key: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)}></Switch >
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button style={{ "marginRight": "10px" }} danger type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} disabled={item.default || username === item.username}></Button>
          <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={() => handleUpdate(item)}></Button>
        </div>
      }
    },
  ];
  //更新
  const handleUpdate = (item) => {
    setTimeout(() => {
      setIsUpdateVisible(true)
      if (item.roleId === 1) {
        setIsUpdateDisabled(true)
      } else {
        setIsUpdateDisabled(false)
      }
      updateFrom.current.setFieldsValue(item)
    }, 0);
    setCurrent(item)
  }
  //改变状态
  const handleChange = (item) => {
    // console.log(item);
    item.roleState = !item.roleState
    setDataSource([...dataSource])
    axios.patch(`/users/${item.id}`, { roleState: item.roleState })
  }
  //删除
  const confirmMethod = (item) => {
    confirm({
      title: '您确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      okText: '确定',
      // okType: 'danger',
      cancelText: '取消',
      onOk() {
        // console.log('OK');
        deleteMethod(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  //删除
  const deleteMethod = (item) => {
    // console.log(item);
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/users/${item.id}`)
  }
  //添加
  const addFormOK = () => {
    addFrom.current.validateFields().then(value => {
      // console.log(value);
      setIsAddVisible(false)
      addFrom.current.resetFields()//清空表单
      // 先发送到后端，获取id再赋值，方便删除和更新
      axios.post(`/users`, {
        ...value,
        "roleState": true,
        "default": false,
      }).then(res => {
        // console.log();
        // setDataSource([...dataSource, res.data])//jsonserver的问题，暂时改成下面这种
        setDataSource([...dataSource, { ...res.data, role: rolelist.filter(item => item.id === value.roleId)[0] }])
      })
    }).catch(err => console.log(err))
  }
  //更新
  const updateFormOK = () => {
    updateFrom.current.validateFields().then(value => {
      // console.log(value);
      setIsUpdateVisible(false)
      setDataSource(dataSource.map(item => {
        if (item.id === current.id) {
          return {
            ...item,
            ...value,
            role: rolelist.filter(data => data.id === value.roleId)[0]
          }
        }
        return item
      }))
      setIsUpdateDisabled(!isUpdateDisabled)
      axios.patch(`/users/${current.id}`, value)
    }).catch(err => console.log(err))
  }
  return (
    <div>
      <Button type="primary" style={{ "marginBottom": "20px" }} onClick={() => {
        setIsAddVisible(true)
      }}>新增用户</Button>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
      <Modal
        visible={isAddVisible}
        title="新增用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setIsAddVisible(false)
          addFrom.current.resetFields()//清空表单
        }}
        onOk={() => addFormOK()}
      >
        <UserFrom regionList={regionList} rolelist={rolelist} ref={addFrom} />
      </Modal>
      <Modal
        visible={isUpdateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setIsUpdateVisible(false)
          updateFrom.current.resetFields()//清空表单
        }}
        onOk={() => updateFormOK()}
      >
        <UserFrom regionList={regionList} rolelist={rolelist} ref={updateFrom} isUpdateDisabled={isUpdateDisabled} isUpdate={true} />
      </Modal>
    </div >
  )
}
