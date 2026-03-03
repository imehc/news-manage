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
import { useNavigate, useParams } from "react-router";
import { NewsEditor } from "@/components/news-manage/NewsEditor";
import { http } from "@/lib/http";
import type { Category, NewsItem } from "@/lib/types";
import styles from "@/styles/news.module.css";

export function NewsUpdate() {
	const [current, setCurrent] = useState(0);
	const [categoryList, setCategoryList] = useState<Category[]>([]);
	const [formInfo, setFormInfo] = useState<{
		title: string;
		categoryId: number;
	}>({ title: "", categoryId: 0 });
	const [content, setContent] = useState("");
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const newsForm = useRef<FormInstance>(null);

	useEffect(() => {
		http.get<Category[]>("/categories").then(setCategoryList);
	}, []);

	useEffect(() => {
		if (!id) return;
		http.get<NewsItem>(`/news/${id}?_expand=category`).then((res) => {
			newsForm.current?.setFieldsValue({
				title: res.title,
				categoryId: res.categoryId,
			});
			setContent(res.content);
		});
	}, [id]);

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
		if (!id) return;
		http
			.patch(`/news/${id}`, {
				...formInfo,
				content,
				auditState,
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
			<div style={{ marginBottom: 16 }}>
				<Button onClick={() => navigate(-1)} style={{ marginRight: 8 }}>
					返回
				</Button>
				<span style={{ fontSize: 20, fontWeight: "bold" }}>更新新闻</span>
			</div>
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
					<NewsEditor
						getContent={(value) => setContent(value)}
						content={content}
					/>
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
