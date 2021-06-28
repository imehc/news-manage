import React, { useState, useEffect } from 'react'

import { Button, Table, Modal, notification } from 'antd'
import axios from 'axios'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
const { confirm } = Modal;


export default function NewsDraft(props) {
  const [dataSource, setDataSource] = useState([])

  const { username } = JSON.parse(sessionStorage.getItem('token'))
  useEffect(() => {
    axios.get(`news?author=${username}&auditState=0&_expand=category`).then(res => {
      console.log('草稿箱列表', res.data);
      const list = res.data
      setDataSource(list)
    })
  }, [username])

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
      title: '新闻标题',
      dataIndex: 'title',
      key: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',


    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        return category.title
      }

    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)}></Button>
          <Button shape="circle" icon={<EditOutlined />} style={{ "margin": "0 10px" }} onClick={() => { props.history.push(`update/${item.id}`) }}></Button>
          <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={() => handleCheck(item.id)}></Button>
        </div>
      }
    },
  ];
  const handleCheck = (id) => {//审核
    confirm({
      title: '您确定要提交审核吗?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      okText: '确定',
      // okType: 'danger',
      cancelText: '取消',
      onOk() {
        // console.log('OK');
        axios.patch(`/news/${id}`, { auditState: 1 }).then(res => {
          props.history.push('/audit-manage/list')
          notification.info({
            message: `通知`,
            description:
              `您可以到审核列表查看您的新闻`,
            placement: 'bottomRight',
          });
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    });

  }
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
    axios.delete(`/news/${item.id}`)

  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
    </div>
  )
}
