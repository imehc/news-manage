
import { Button } from 'antd'
import NewsPublish from '../../../../components/publish-manage/NewsPublish'//引入组件
import usePublish from '../../../../components/publish-manage/usePublish'//引入公共方法

export default function Published() {
  const { dataSource, handleSunset } = usePublish(2)//执行方法 2为已发布
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id) => <Button danger onClick={() => handleSunset(id)}>
        下线
      </Button>}></NewsPublish>
    </div>
  )
}
