import { Table } from "antd";
import type { ReactNode } from "react";
import type { NewsItem } from "@/lib/types";

interface NewsPublishProps {
	dataSource: NewsItem[];
	button: (id: number) => ReactNode;
}

export function NewsPublish({ dataSource, button }: NewsPublishProps) {
	const columns = [
		{
			title: "新闻标题",
			dataIndex: "title",
			render: (title: string, item: NewsItem) => (
				<a href={`/news-manage/preview/${item.id}`}>{title}</a>
			),
		},
		{
			title: "作者",
			dataIndex: "author",
		},
		{
			title: "新闻分类",
			dataIndex: "category",
			render: (category: NewsItem["category"]) => <div>{category?.title}</div>,
		},
		{
			title: "操作",
			render: (_: unknown, item: NewsItem) => <div>{button(item.id)}</div>,
		},
	];

	return (
		<Table
			dataSource={dataSource}
			columns={columns}
			pagination={{ pageSize: 5 }}
			rowKey={(item) => item.id}
		/>
	);
}
