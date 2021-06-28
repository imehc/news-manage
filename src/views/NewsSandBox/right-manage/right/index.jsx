import React, { useState, useEffect } from 'react'

import { Button, Table, Tag, Modal, Popover, Switch } from 'antd'
import axios from 'axios'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;


export default function RightList() {
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    axios.get("/rights?_embed=children").then(res => {
      console.log('权限列表', res.data);
      res.data.forEach(data => {
        if (data.children.length === 0) {
          data.children = null
        }
      })
      setDataSource(res.data)
    })
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      key: 'key',
      render: (key) => {
        return <Tag color="orange">{key}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button style={{ "marginRight": "10px" }} danger type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)}></Button>
          <Popover content={<div style={{ "textAlign": "center" }}>
            <Switch checked={item.pagepermisson === 1} onChange={() => switchMethod(item)}></Switch>
          </div>} title="页面配置项" trigger={item.pagepermisson === undefined ? '' : 'click'}>
            <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson === undefined}></Button>
          </Popover>
        </div>
      }
    },
  ];
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
    if (item.grade === 1) {
      setDataSource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`/rights/${item.id}`)
    } else {
      let list = dataSource.filter(data => data.id === item.rightId)
      list[0].children = list[0].children.filter(data => data.id !== item.id)
      axios.delete(`/children/${item.id}`)
      setDataSource([...dataSource])
    }
  }
  //更改配置状态
  const switchMethod = (item) => {
    // console.log(item);
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    setDataSource([...dataSource])
    if (item.grade === 1) {
      axios.patch(`/rights/${item.id}`, { pagepermisson: item.pagepermisson })
    } else {
      axios.patch(`/children/${item.id}`, { pagepermisson: item.pagepermisson })
    }
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
    </div>
  )
}
