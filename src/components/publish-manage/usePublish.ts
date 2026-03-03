import { notification } from "antd";
import { useEffect, useState } from "react";
import { getToken, http } from "@/lib/http";
import type { NewsItem } from "@/lib/types";

export function usePublish(type: number) {
	const [dataSource, setDataSource] = useState<NewsItem[]>([]);
	const username = getToken()?.username ?? "";

	useEffect(() => {
		http
			.get<NewsItem[]>(
				`/news?author=${username}&publishState=${type}&_expand=category`,
			)
			.then(setDataSource);
	}, [username, type]);

	const handlePublish = (id: number) => {
		setDataSource((prev) => prev.filter((item) => item.id !== id));
		http
			.patch(`/news/${id}`, { publishState: 2, publishTime: Date.now() })
			.then(() => {
				notification.info({
					title: "通知",
					description: "您可以到 【发布管理/已发布】 查看您的新闻",
					placement: "bottomRight",
				});
			});
	};

	const handleSunset = (id: number) => {
		setDataSource((prev) => prev.filter((item) => item.id !== id));
		http
			.patch(`/news/${id}`, { publishState: 3, publishTime: Date.now() })
			.then(() => {
				notification.info({
					title: "通知",
					description: "您可以到 【发布管理/已下线】 查看您的新闻",
					placement: "bottomRight",
				});
			});
	};

	const handleDelete = (id: number) => {
		setDataSource((prev) => prev.filter((item) => item.id !== id));
		http.delete(`/news/${id}`).then(() => {
			notification.info({
				title: "通知",
				description: "您已删除已下线的新闻",
				placement: "bottomRight",
			});
		});
	};

	return { dataSource, handlePublish, handleSunset, handleDelete };
}
