import React, { useEffect, useState } from 'react'
import { PageHeader, Descriptions } from 'antd';
import axios from 'axios';
import moment from 'moment';//时间格式化插件
import { HeartTwoTone } from '@ant-design/icons';

export default function Detail(props) {
  const [newsInfo, setNewsInfo] = useState(null)
  useEffect(() => {
    // console.log(props.match.params.id)//路由id
    axios.get(`/news/${props.match.params.id}?_expand=category`).then(res => {
      setNewsInfo({
        ...res.data,
        view: res.data.view + 1
      })
      return res.data
    }).then(res => {
      //同步后端
      // console.log(res,'sdsdsd');
      axios.patch(`/news/${props.match.params.id}`, { view: res.view + 1 })
    })
  }, [props.match.params.id])
  //点赞
  const handleStar = () => {
    setNewsInfo({
      ...newsInfo,
      star: newsInfo.star + 1
    })
    axios.patch(`/news/${props.match.params.id}`, { star: newsInfo.star + 1 })
  }
  return (
    <div>
      {
        newsInfo && <div>
          <PageHeader
            onBack={() => window.history.back()}
            title={newsInfo.title}
            subTitle={
              <div>
                {newsInfo.category.title}
                <HeartTwoTone twoToneColor="#eb2f96" style={{ marginLeft: '10px' }} onClick={() => handleStar()} />
              </div>}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
              <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss") : '-'}</Descriptions.Item>
              <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
              <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
              <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
              <Descriptions.Item label="评论数量">0</Descriptions.Item>
            </Descriptions>
          </PageHeader>
          <div dangerouslySetInnerHTML={{
            // dangerouslySetInnerHTML 把 html字符串转成 innerHTML 让html 能解析的样子，不然你得到就是一堆html标签
            __html: newsInfo.content
          }} style={{
            margin: '0 24px',
            border: '1px dashed gray',
            padding: '10px'
          }}>
          </div>
        </div>
      }
    </div>
  )
}
