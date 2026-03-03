import type { FormInstance } from "antd";
import {
	Button,
	Form,
	Input,
	message,
	notification,
	Select,
	Steps,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { NewsEditor } from "@/components/news-manage/NewsEditor";
import { getToken, http } from "@/lib/http";
import type { Category, NewsItem } from "@/lib/types";
import styles from "@/styles/news.module.css";

export function NewsAdd() {
	const [current, setCurrent] = useState(0);
	const [categoryList, setCategoryList] = useState<Category[]>([]);
	const [formInfo, setFormInfo] = useState<{
		title: string;
		categoryId: number;
	}>({ title: "", categoryId: 0 });
	const [content, setContent] = useState("");
	const navigate = useNavigate();
	const newsForm = useRef<FormInstance>(null);

	const user = getToken();

	useEffect(() => {
		http.get<Category[]>("/categories").then(setCategoryList);
	}, []);

	const handleNext = () => {
		if (current === 0) {
			newsForm.current
				?.validateFields()
				.then((res: { title: string; categoryId: number }) => {
					setFormInfo(res);
					setCurrent(current + 1);
				});
		} else {
			if (content === "") {
				message.error("新闻内容不能为空");
			} else {
				setCurrent(current + 1);
			}
		}
	};

	const handleSave = (auditState: number) => {
		http
			.post<NewsItem>("/news", {
				...formInfo,
				content,
				region: user?.region || "全球",
				author: user?.username,
				roleId: user?.roleId,
				auditState,
				publishState: 0,
				createTime: Date.now(),
				star: 0,
				view: 0,
			})
			.then(() => {
				navigate(
					auditState === 0 ? "/news-manage/draft" : "/audit-manage/list",
				);
				notification.info({
					title: "通知",
					description: `您可以到${auditState === 0 ? "草稿箱" : "审核列表"}查看您的新闻`,
					placement: "bottomRight",
				});
			});
	};

	const stepsItems = [
		{ title: "基本信息", content: "新闻标题，新闻分类" },
		{ title: "新闻内容", content: "新闻主题内容" },
		{ title: "新闻提交", content: "保存草稿或提交审核" },
	];

	return (
		<div>
			<h2>撰写新闻</h2>
			<Steps current={current} items={stepsItems} />
			<div style={{ marginTop: 50 }}>
				<div className={current === 0 ? undefined : styles.active}>
					<Form name="basic" ref={newsForm}>
						<Form.Item
							label="新闻标题"
							name="title"
							rules={[{ required: true, message: "请输入新闻标题!" }]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							label="新闻分类"
							name="categoryId"
							rules={[{ required: true, message: "请选择新闻分类!" }]}
						>
							<Select>
								{categoryList.map((item) => (
									<Select.Option value={item.id} key={item.id}>
										{item.title}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
					</Form>
				</div>
				<div className={current === 1 ? undefined : styles.active}>
					<NewsEditor getContent={(value) => setContent(value)} />
				</div>
				<div style={{ marginTop: 50 }}>
					{current === 2 && (
						<span>
							<Button
								type="primary"
								style={{ marginRight: 10 }}
								onClick={() => handleSave(0)}
							>
								保存草稿箱
							</Button>
							<Button
								danger
								style={{ marginRight: 10 }}
								onClick={() => handleSave(1)}
							>
								提交审核
							</Button>
						</span>
					)}
					{current < 2 && (
						<Button
							type="primary"
							style={{ marginRight: 10 }}
							onClick={handleNext}
						>
							下一步
						</Button>
					)}
					{current > 0 && (
						<Button onClick={() => setCurrent(current - 1)}>上一步</Button>
					)}
				</div>
			</div>
		</div>
	);
}
