
import { Button } from 'antd'
import NewsPublish from '../../../../components/publish-manage/NewsPublish'//引入组件
import usePublish from '../../../../components/publish-manage/usePublish'//引入公共方法

export default function Sunset() {
  const { dataSource, handleDelete } = usePublish(3)//执行方法 3为已下线
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id) => <Button type="danger" onClick={() => handleDelete(id)}>
        删除
      </Button>}></NewsPublish>
    </div>
  )
}
