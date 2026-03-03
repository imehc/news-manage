import { Button } from "antd";
import { NewsPublish } from "@/components/publish-manage/NewsPublish";
import { usePublish } from "@/components/publish-manage/usePublish";

export function Unpublished() {
	const { dataSource, handlePublish } = usePublish(1);
	return (
		<NewsPublish
			dataSource={dataSource}
			button={(id) => (
				<Button type="primary" onClick={() => handlePublish(id)}>
					发布
				</Button>
			)}
		/>
	);
}
