import { Card, Col, Pagination, Row } from "antd";
import { useEffect, useState } from "react";
import { http } from "@/lib/http";
import type { NewsItem } from "@/lib/types";

function groupBy<T>(arr: T[], fn: (item: T) => string): Record<string, T[]> {
	const result: Record<string, T[]> = {};
	for (const item of arr) {
		const key = fn(item);
		if (!result[key]) result[key] = [];
		result[key]?.push(item);
	}
	return result;
}

const PAGE_SIZE = 3;

function PaginatedList({ items }: { items: NewsItem[] }) {
	const [page, setPage] = useState(1);
	const paged = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	return (
		<>
			<ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
				{paged.map((data) => (
					<li
						key={data.id}
						style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}
					>
						<a href={`/detail/${data.id}`}>{data.title}</a>
					</li>
				))}
			</ul>
			{items.length > PAGE_SIZE && (
				<Pagination
					size="small"
					current={page}
					pageSize={PAGE_SIZE}
					total={items.length}
					onChange={setPage}
					style={{ marginTop: 8, textAlign: "right" }}
				/>
			)}
		</>
	);
}

export function NewsList() {
	const [list, setList] = useState<[string, NewsItem[]][]>([]);

	useEffect(() => {
		http
			.get<NewsItem[]>("/news?publishState=2&_expand=category")
			.then((data) => {
				setList(
					Object.entries(groupBy(data, (item) => item.category?.title ?? "")),
				);
			});
	}, []);

	return (
		<div style={{ width: "95%", margin: "0 auto" }}>
			<h1 style={{ fontSize: 24, margin: "16px 0" }}>环球新闻</h1>
			<div className="site-card-wrapper">
				<Row gutter={[16, 16]}>
					{list.map((entry) => (
						<Col span={8} key={entry[0]}>
							<Card title={entry[0]} hoverable>
								<PaginatedList items={entry[1]} />
							</Card>
						</Col>
					))}
				</Row>
			</div>
		</div>
	);
}
