import { useEffect, useState } from "react";
import axios from "axios";
import { notification } from "antd";

function usePublish(type) {
  const [dataSource, setDataSource] = useState([]);
  const { username } = JSON.parse(sessionStorage.getItem("token"));
  useEffect(() => {
    axios
      .get(`/news?author=${username}&publishState=${type}&_expand=category`)
      .then((res) => {
        console.log("已发布", res.data);
        setDataSource(res.data);
      });
  }, [username, type]);
  const handlePublish = (id) => {
    //发布
    // console.log(id);
    setDataSource(dataSource.filter((item) => item.id !== id));
    axios.patch(`/news/${id}`, {
        publishState: 2,
        publishTime: Date.now(),
      })
      .then((res) => {
        notification.info({
          message: `通知`,
          description: `您可以到 【发布管理/已发布】 查看您的新闻`,
          placement: "bottomRight",
        });
      });
  };
  const handleSunset = (id) => {
    //下线
    // console.log(id);
    setDataSource(dataSource.filter((item) => item.id !== id));
    axios.patch(`/news/${id}`, {
      publishState: 3,
      publishTime: Date.now(),
    })
    .then((res) => {
      notification.info({
        message: `通知`,
        description: `您可以到 【发布管理/已下线】 查看您的新闻`,
        placement: "bottomRight",
      });
    });
  };
  const handleDelete = (id) => {
    //删除
    // console.log(id);
    setDataSource(dataSource.filter((item) => item.id !== id));
    axios.delete(`/news/${id}`)
    .then((res) => {
      notification.info({
        message: `通知`,
        description: `您已删除已下线的新闻`,
        placement: "bottomRight",
      });
    });
  };
  return {
    dataSource,
    handlePublish,
    handleSunset,
    handleDelete,
  };
}
export default usePublish;
