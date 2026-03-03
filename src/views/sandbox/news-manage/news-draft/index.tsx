import {
	DeleteOutlined,
	EditOutlined,
	ExclamationCircleOutlined,
	UploadOutlined,
} from "@ant-design/icons";
import { Button, Modal, notification, Table } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getToken, http } from "@/lib/http";
import type { NewsItem } from "@/lib/types";

const { confirm } = Modal;

export function NewsDraft() {
	const [dataSource, setDataSource] = useState<NewsItem[]>([]);
	const navigate = useNavigate();
	const username = getToken()?.username ?? "";

	useEffect(() => {
		http
			.get<NewsItem[]>(`/news?author=${username}&auditState=0&_expand=category`)
			.then(setDataSource);
	}, [username]);

	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
			render: (id: number) => <b>{id}</b>,
		},
		{
			title: "新闻标题",
			dataIndex: "title",
			key: "title",
			render: (title: string, item: NewsItem) => (
				<a href={`/news-manage/preview/${item.id}`}>{title}</a>
			),
		},
		{ title: "作者", dataIndex: "author", key: "author" },
		{
			title: "分类",
			dataIndex: "category",
			key: "category",
			render: (category: NewsItem["category"]) => category?.title,
		},
		{
			title: "操作",
			render: (_: unknown, item: NewsItem) => (
				<div>
					<Button
						danger
						shape="circle"
						icon={<DeleteOutlined />}
						onClick={() => confirmDelete(item)}
					/>
					<Button
						shape="circle"
						icon={<EditOutlined />}
						style={{ margin: "0 10px" }}
						onClick={() => navigate(`/news-manage/update/${item.id}`)}
					/>
					<Button
						type="primary"
						shape="circle"
						icon={<UploadOutlined />}
						onClick={() => handleCheck(item.id)}
					/>
				</div>
			),
		},
	];

	const handleCheck = (id: number) => {
		confirm({
			title: "您确定要提交审核吗?",
			icon: <ExclamationCircleOutlined />,
			okText: "确定",
			cancelText: "取消",
			onOk() {
				http.patch(`/news/${id}`, { auditState: 1 }).then(() => {
					navigate("/audit-manage/list");
					notification.info({
						title: "通知",
						description: "您可以到审核列表查看您的新闻",
						placement: "bottomRight",
					});
				});
			},
		});
	};

	const confirmDelete = (item: NewsItem) => {
		confirm({
			title: "您确定要删除吗?",
			icon: <ExclamationCircleOutlined />,
			okText: "确定",
			cancelText: "取消",
			onOk() {
				setDataSource(dataSource.filter((data) => data.id !== item.id));
				http.delete(`/news/${item.id}`);
			},
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
