import { HeartTwoTone } from "@ant-design/icons";
import { Button, Descriptions } from "antd";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { http } from "@/lib/http";
import type { NewsItem } from "@/lib/types";

export function NewsDetail() {
	const [newsInfo, setNewsInfo] = useState<NewsItem | null>(null);
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		if (!id) return;
		http
			.get<NewsItem>(`/news/${id}?_expand=category`)
			.then((res) => {
				setNewsInfo({ ...res, view: res.view + 1 });
				return res;
			})
			.then((res) => {
				http.patch(`/news/${id}`, { view: res.view + 1 });
			});
	}, [id]);

	const handleStar = () => {
		if (!newsInfo || !id) return;
		setNewsInfo({ ...newsInfo, star: newsInfo.star + 1 });
		http.patch(`/news/${id}`, { star: newsInfo.star + 1 });
	};

	if (!newsInfo) return null;

	return (
		<div>
			<div style={{ marginBottom: 16 }}>
				<Button
					onClick={() => window.history.back()}
					style={{ marginRight: 8 }}
				>
					返回
				</Button>
				<span style={{ fontSize: 20, fontWeight: "bold" }}>
					{newsInfo.title}
				</span>
				<span style={{ marginLeft: 8 }}>
					{newsInfo.category?.title}
					<HeartTwoTone
						twoToneColor="#eb2f96"
						style={{ marginLeft: 10, cursor: "pointer" }}
						onClick={handleStar}
					/>
				</span>
			</div>
			<Descriptions size="small" column={3}>
				<Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
				<Descriptions.Item label="发布时间">
					{newsInfo.publishTime
						? format(new Date(newsInfo.publishTime), "yyyy/MM/dd HH:mm:ss")
						: "-"}
				</Descriptions.Item>
				<Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
				<Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
				<Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
				<Descriptions.Item label="评论数量">0</Descriptions.Item>
			</Descriptions>
			<div
				dangerouslySetInnerHTML={{ __html: newsInfo.content }}
				style={{
					margin: "0 24px",
					border: "1px dashed gray",
					padding: 10,
				}}
			/>
		</div>
	);
}
