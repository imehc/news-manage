import { Button } from 'antd'
import NewsPublish from '../../../../components/publish-manage/NewsPublish'//引入组件
import usePublish from '../../../../components/publish-manage/usePublish'//引入公共方法

export default function Unpublished() {
  const { dataSource, handlePublish } = usePublish(1)//1 为待发布
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id) => <Button type="primary" onClick={() => handlePublish(id)}>
        发布
      </Button>}></NewsPublish>
    </div>
  )
}
