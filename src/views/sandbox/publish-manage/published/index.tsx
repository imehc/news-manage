import { Button } from "antd";
import { NewsPublish } from "@/components/publish-manage/NewsPublish";
import { usePublish } from "@/components/publish-manage/usePublish";

export function Published() {
	const { dataSource, handleSunset } = usePublish(2);
	return (
		<NewsPublish
			dataSource={dataSource}
			button={(id) => (
				<Button danger onClick={() => handleSunset(id)}>
					下线
				</Button>
			)}
		/>
	);
}
