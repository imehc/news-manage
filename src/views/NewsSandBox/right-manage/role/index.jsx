import React, { useEffect, useState } from 'react'

import { Table, Button, Modal, Tree } from "antd";
import axios from 'axios'
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

export default function RoleList() {
  const [dataSource, setDataSource] = useState([])
  const [rightList, setRightList] = useState([])
  const [currentRights, setCurrentRights] = useState([])
  const [currentId, setCurrentId] = useState(0)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button style={{ "marginRight": "10px" }} danger type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)}></Button>
          <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} onClick={() => {
            setIsModalVisible(true)
            setCurrentRights(item.rights)
            setCurrentId(item.id)
          }}></Button>
        </div>
      }
    }
  ]
  useEffect(() => {
    axios.get(`/roles`).then(res => {
      console.log('角色列表', res.data);
      setDataSource(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get(`/rights?_embed=children`).then(res => {
      setRightList(res.data)
    })
  }, [])
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
    axios.delete(`/roles/${item.id}`)
  }
  //弹框确定
  const handleOk = () => {
    // console.log(currentRights);
    setIsModalVisible(false)
    //同步datasource
    setDataSource(dataSource.map(item => {
      if (item.id === currentId) {
        return {
          ...item,
          rights: currentRights
        }
      }
      return item
    }))
    //patch更新
    axios.patch(`/roles/${currentId}`, { rights: currentRights })
  }
  //弹框取消
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  //选中树型选项
  const onCheck = (checkKeys) => {
    setCurrentRights(checkKeys.checked)
    // console.log(checkKeys.checked);
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}></Table>
      <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} cancelText={"取消"} okText={"确定"}>
        <Tree
          checkable
          checkedKeys={currentRights}//受控树节点
          onCheck={onCheck}//current
          checkStrictly={true}//完全受控树节点
          treeData={rightList}//数据
        />
      </Modal>
    </div >
  )
}
