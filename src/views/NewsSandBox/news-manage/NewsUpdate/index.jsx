import React, { useState, useEffect, useRef } from 'react'
import { Button, PageHeader, Steps, Form, Input, Select, message, notification } from 'antd'
import style from '../News.module.css'
import axios from 'axios';
import NewsEditor from '../../../../components/news-manage/NewsEditor';
const { Step } = Steps;
const { Option } = Select;

export default function NewUpdate(props) {
  const [current, setCurrent] = useState(0)
  const [categotyList, setCategotyList] = useState([])

  const [fromInfo, setFromInfo] = useState({})//第一步表单内容
  const [content, setContent] = useState("")//第二步editor

  // const User = JSON.parse(sessionStorage.getItem("token"))
  const handleNext = () => {//下一步
    if (current === 0) {
      NewsForm.current.validateFields().then(res => {
        // console.log(res)
        setFromInfo(res)
        setCurrent(current + 1)
      }).catch(err => console.log(err))
    } else {
      if (content === "") {
        message.error('新闻内容不能为空')
      } else {
        setCurrent(current + 1)
      }
      // console.log(fromInfo, content);
    }
  }
  const handlePrevious = () => {//上一步
    setCurrent(current - 1)
  }
  const NewsForm = useRef(null)
  useEffect(() => {
    axios.get(`/categories`).then(res => {
      console.log('新闻分类', res.data);
      setCategotyList(res.data)
    })
  }, [])
  useEffect(() => {
    // console.log(props.match.params.id)//路由id
    axios.get(`/news/${props.match.params.id}?_expand=category`).then(res => {
      let { title, categoryId, content } = res.data
      NewsForm.current.setFieldsValue({
        title, categoryId
      })
      setContent(content)
    })
  }, [props.match.params.id])
  const handleSave = (auditState) => {
    axios.patch(`/news/${props.match.params.id}`, {
      ...fromInfo,
      "content": content,
      "auditState": auditState,//审核状态
      // "publishTime": 0
    }).then(res => {
      props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
      notification.info({
        message: `通知`,
        description:
          `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}查看您的新闻`,
        placement: 'bottomRight',
      });
    })
  }
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="更新新闻"
        subTitle="Write news"
        onBack={() => props.history.goBack()}
      />
      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主题内容" />
        <Step title="新闻提交" description="保存草稿或提交审核" />
      </Steps>
      <div style={{ marginTop: '50px' }}>
        <div className={current === 0 ? '' : style.active}>
          <Form
            name="basic"
            // labelCol={{ span: 0 }}
            // wrapperCol={{ span: 24 }}
            ref={NewsForm}
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[{ required: true, message: 'Please input your news title!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[{ required: true, message: 'Please select your news category!' }]}
            >
              <Select >
                {
                  categotyList.map(item => <Option value={item.id} key={item.id}>{item.title}</Option>)
                }
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? '' : style.active}>
          <NewsEditor getContent={(value) => {
            // console.log(value)
            setContent(value)
          }} content={content} />
        </div>
        {/* <div className={current === 2 ? '' : style.active}>333</div> */}
        <div style={{ marginTop: "50px" }}>
          {
            current === 2 && <span>
              <Button type="primary" style={{ marginRight: "10px" }} onClick={() => handleSave(0)}> 保存草稿箱</Button>
              <Button danger style={{ marginRight: "10px" }} onClick={() => handleSave(1)}>提交审核</Button>
            </span>
          }
          {
            current < 2 && <Button type="primary" style={{ marginRight: "10px" }} onClick={handleNext}>下一步</Button>
          }
          {
            current > 0 && <Button onClick={handlePrevious}>上一步</Button>
          }
        </div>
      </div>
    </div>
  )
}
