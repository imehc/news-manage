import { Button, Descriptions } from "antd";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { http } from "@/lib/http";
import type { NewsItem } from "@/lib/types";

export function NewsPreview() {
	const [newsInfo, setNewsInfo] = useState<NewsItem | null>(null);
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		if (!id) return;
		http.get<NewsItem>(`/news/${id}?_expand=category`).then(setNewsInfo);
	}, [id]);

	const auditList = ["未审核", "审核中", "已通过", "未通过"];
	const publishList = ["未发布", "待发布", "已上线", "已下线"];
	const colorList = ["black", "orange", "green", "red"];

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
				<span style={{ marginLeft: 8, color: "#999" }}>
					{newsInfo.category?.title}
				</span>
			</div>
			<Descriptions size="small" column={3}>
				<Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
				<Descriptions.Item label="创建时间">
					{newsInfo.createTime
						? format(new Date(newsInfo.createTime), "yyyy/MM/dd HH:mm:ss")
						: "-"}
				</Descriptions.Item>
				<Descriptions.Item label="发布时间">
					{newsInfo.publishTime
						? format(new Date(newsInfo.publishTime), "yyyy/MM/dd HH:mm:ss")
						: "-"}
				</Descriptions.Item>
				<Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
				<Descriptions.Item label="审核状态">
					<span style={{ color: colorList[newsInfo.auditState] }}>
						{auditList[newsInfo.auditState]}
					</span>
				</Descriptions.Item>
				<Descriptions.Item label="发布状态">
					<span style={{ color: colorList[newsInfo.publishState] }}>
						{publishList[newsInfo.publishState]}
					</span>
				</Descriptions.Item>
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
