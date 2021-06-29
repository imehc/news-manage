import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Table, Button, Tag, notification } from 'antd'

export default function AuditList(props) {
  const [dataSource, setDataSource] = useState([])
  const { username } = JSON.parse(sessionStorage.getItem('token'))
  useEffect(() => {
    //jsonserver语法   _ne 不等于   _lte 小于等于  _expand 百度吧我也忘了
    axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
      console.log('审核列表', res.data);
      setDataSource(res.data)
    })
  }, [username])

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return <div>{category.title}</div>
      }
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        const colorList = ["", "orange", "green", "red"]
        const auditList = ["草稿箱", "审核中", "已通过", "未通过"]
        return <Tag color={colorList[auditState]}>{auditList.[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          {
            item.auditState === 1 && <Button style={{ "marginRight": "10px" }} danger onClick={() => handleRervert(item)}>撤销</Button>
          }
          {
            item.auditState === 2 && <Button style={{ "marginRight": "10px" }} onClick={() => handlePublish(item)}>发布</Button>
          }
          {
            item.auditState === 3 && <Button style={{ "marginRight": "10px" }} type="primary" onClick={() => handleUpdate(item)}>修改</Button>
          }
        </div>
      }
    },
  ];
  //撤销
  const handleRervert = (item) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`, { auditState: 0 }).then(res => {
      notification.info({
        message: `通知`,
        description:
          `您可以到草稿箱查看您的新闻`,
        placement: 'bottomRight',
      });
    })
  }
  //修改
  const handleUpdate = (item) => {
    props.history.push(`/news-manage/update/${item.id}`)
  }
  //发布
  const handlePublish = (item) => {
    axios.patch(`/news/${item.id}`, {
      "publishState": 2,
      "publishTime": Date.now()
    }).then(res => {
      props.history.push(`/publish-manage/published`)
      notification.info({
        message: `通知`,
        description:
          `您可以到 【发布管理/已发布】 查看您的新闻`,
        placement: 'bottomRight',
      });
    })
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
    </div>
  )
}
