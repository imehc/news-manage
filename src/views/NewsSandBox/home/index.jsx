import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, Card, List, Avatar, Drawer } from "antd";
import { EditOutlined, EllipsisOutlined, PieChartOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as Echarts from 'echarts'
import _ from 'lodash'
const { Meta } = Card;

export default function Home() {
  const [viewList, setViewList] = useState([])
  const [starList, setStarList] = useState([])
  const [visible, setVisible] = useState(false)//控制抽屉显示/隐藏
  const [pirChart, setPirChart] = useState(null)//初始化多次可使用此方法
  const [allList, setAllList] = useState([])
  const barRef = useRef()//dom
  const pieRef = useRef()

  const { username, region, role: { roleName }, avatar } = JSON.parse(sessionStorage.getItem('token'))

  useEffect(() => {
    // jsonserver语法 _sort 以那个字段排序  _order 排序的顺序
    axios.get(`news/?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then(res => {
      //  console.log('home',res.data);
      setViewList(res.data)
    })
  }, [])
  useEffect(() => {
    // jsonserver语法 _sort 以那个字段排序  _order 排序的顺序
    axios.get(`/news/?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`).then(res => {
      //  console.log('home',res.data);
      setStarList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get('/news/?publishState=2&_expand=category').then(res => {
      // console.log('所有发布的新闻', res.data);
      renderBarView(_.groupBy(res.data, item => item.category.title))
      setAllList(res.data)
    })
    return () => {
      window.onresize = null
    }
  }, [])
  const renderBarView = (obj) => {//柱状图
    // 基于准备好的dom，初始化echarts实例
    // var myChart = Echarts.init(document.getElementById('main'));
    var myChart = Echarts.init(barRef.current);
    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: '45',
          interval: 0
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [{
        name: '数量',
        type: 'bar',
        data: Object.values(obj).map(item => item.length)
      }]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    window.onresize = () => {
      console.log('resize');
      myChart.resize()
    }
  }
  const renderPieView = () => {//饼状图
    //数据处理
    var currentList = allList.filter(item => item.author === username)
    var groupObj = _.groupBy(currentList, item => item.category.title)
    // console.log(groupObj);
    var list = []
    for (var i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length
      })
    }
    // console.log(list);
    // 基于准备好的dom，初始化echarts实例
    var myChart;
    if (!pirChart) {
      myChart = Echarts.init(pieRef.current);
      setPirChart(myChart)
    } else {
      myChart = pirChart
    }
    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '当前用户新闻分类图示',
        // subtext: '',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  }
  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              size="small"
              dataSource={viewList}
              renderItem={item => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              size="small"
              dataSource={starList}
              renderItem={item => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <PieChartOutlined key="setting" onClick={() => {
                setTimeout(() => {//因为renderPieView是异步操作。而visible是同步，导致还未渲染完成就已经加载，所以加个定时器
                  setVisible(true)
                  renderPieView() //初始化操作
                }, 0);
              }} />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src={avatar ? avatar : 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'} />}
              title={username}
              description={
                <div>
                  <b style={{ marginRight: '20px' }}>{region ? region : '全球'}</b>
                  {roleName}
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <Drawer
        width="500px"
        title="个人新闻分类"
        placement="right"
        closable={true}
        onClose={() => setVisible(false)}
        visible={visible}
      >
        <div id="main" ref={pieRef} style={{ height: '400px', marginTop: '30px' }}>

        </div>
      </Drawer>
      <div id="main" ref={barRef} style={{ height: '400px', marginTop: '30px' }}>

      </div>
    </div>
  )
}
