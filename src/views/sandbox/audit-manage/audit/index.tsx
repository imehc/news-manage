import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, notification, Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { getToken, http } from "@/lib/http";
import type { NewsItem } from "@/lib/types";

const roleObj: Record<string, string> = {
	"1": "superadmin",
	"2": "admin",
	"3": "editor",
};

export function Audit() {
	const [dataSource, setDataSource] = useState<NewsItem[]>([]);

	const token = getToken();
	const roleId = String(token?.roleId ?? "");
	const username = token?.username ?? "";
	const region = token?.region ?? "";

	useEffect(() => {
		http.get<NewsItem[]>("/news?auditState=1&_expand=category").then((list) => {
			setDataSource(
				roleObj[roleId] === "superadmin"
					? list
					: [
							...list.filter((item) => item.author === username),
							...list.filter(
								(item) =>
									item.region === region &&
									roleObj[String(item.roleId)] === "editor",
							),
						],
			);
		});
	}, [roleId, username, region]);

	const columns = [
		{
			title: "新闻标题",
			dataIndex: "title",
			render: (title: string, item: NewsItem) => (
				<a href={`/news-manage/preview/${item.id}`}>{title}</a>
			),
		},
		{ title: "作者", dataIndex: "author" },
		{
			title: "新闻分类",
			dataIndex: "category",
			render: (category: NewsItem["category"]) => <div>{category?.title}</div>,
		},
		{
			title: "操作",
			render: (_: unknown, item: NewsItem) => (
				<div>
					<Tooltip placement="top" title="通过" color="green">
						<Button
							shape="circle"
							icon={<CheckOutlined />}
							style={{
								marginRight: 5,
								backgroundColor: "rgb(47, 194, 47)",
								color: "#fff",
							}}
							onClick={() => handleAudit(item, 2, 1)}
						/>
					</Tooltip>
					<Tooltip placement="top" title="驳回" color="red">
						<Button
							danger
							type="primary"
							shape="circle"
							icon={<CloseOutlined />}
							style={{ marginLeft: 5 }}
							onClick={() => handleAudit(item, 3, 0)}
						/>
					</Tooltip>
				</div>
			),
		},
	];

	const handleAudit = (
		item: NewsItem,
		auditState: number,
		publishState: number,
	) => {
		setDataSource(dataSource.filter((data) => data.id !== item.id));
		http.patch(`/news/${item.id}`, { auditState, publishState }).then(() => {
			notification.info({
				title: "通知",
				description: "您可以到 【审核管理/审核列表】 中查看您的新闻",
				placement: "bottomRight",
			});
		});
	};

	return (
		<Table
			dataSource={dataSource}
			columns={columns}
			pagination={{ pageSize: 5 }}
			rowKey={(item) => item.id}
		/>
	);
}
