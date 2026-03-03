import { Button, notification, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getToken, http } from "@/lib/http";
import type { NewsItem } from "@/lib/types";

export function AuditList() {
	const [dataSource, setDataSource] = useState<NewsItem[]>([]);
	const navigate = useNavigate();
	const username = getToken()?.username ?? "";

	useEffect(() => {
		http
			.get<NewsItem[]>(
				`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`,
			)
			.then(setDataSource);
	}, [username]);

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
			title: "审核状态",
			dataIndex: "auditState",
			render: (auditState: number) => {
				const colorList = ["", "orange", "green", "red"];
				const auditLabels = ["草稿箱", "审核中", "已通过", "未通过"];
				return (
					<Tag color={colorList[auditState]}>{auditLabels[auditState]}</Tag>
				);
			},
		},
		{
			title: "操作",
			render: (_: unknown, item: NewsItem) => (
				<div>
					{item.auditState === 1 && (
						<Button
							style={{ marginRight: 10 }}
							danger
							onClick={() => handleRevert(item)}
						>
							撤销
						</Button>
					)}
					{item.auditState === 2 && (
						<Button
							style={{ marginRight: 10 }}
							onClick={() => handlePublish(item)}
						>
							发布
						</Button>
					)}
					{item.auditState === 3 && (
						<Button
							style={{ marginRight: 10 }}
							type="primary"
							onClick={() => handleUpdate(item)}
						>
							修改
						</Button>
					)}
				</div>
			),
		},
	];

	const handleRevert = (item: NewsItem) => {
		setDataSource(dataSource.filter((data) => data.id !== item.id));
		http.patch(`/news/${item.id}`, { auditState: 0 }).then(() => {
			notification.info({
				title: "通知",
				description: "您可以到草稿箱查看您的新闻",
				placement: "bottomRight",
			});
		});
	};

	const handleUpdate = (item: NewsItem) => {
		navigate(`/news-manage/update/${item.id}`);
	};

	const handlePublish = (item: NewsItem) => {
		http
			.patch(`/news/${item.id}`, {
				publishState: 2,
				publishTime: Date.now(),
			})
			.then(() => {
				navigate("/publish-manage/published");
				notification.info({
					title: "通知",
					description: "您可以到 【发布管理/已发布】 查看您的新闻",
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
