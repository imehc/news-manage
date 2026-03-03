import {
	EditOutlined,
	EllipsisOutlined,
	PieChartOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Col, Drawer, Row } from "antd";
import * as Echarts from "echarts";
import {
	useCallback,
	useEffect,
	useEffectEvent,
	useRef,
	useState,
} from "react";
import { getToken, http } from "@/lib/http";
import type { NewsItem } from "@/lib/types";

const { Meta } = Card;

function groupBy<T>(arr: T[], fn: (item: T) => string): Record<string, T[]> {
	const result: Record<string, T[]> = {};
	for (const item of arr) {
		const key = fn(item);
		if (!result[key]) result[key] = [];
		result[key]?.push(item);
	}
	return result;
}

export function Home() {
	const [viewList, setViewList] = useState<NewsItem[]>([]);
	const [starList, setStarList] = useState<NewsItem[]>([]);
	const [open, setOpen] = useState(false);
	const [pieChart, setPieChart] = useState<Echarts.ECharts | null>(null);
	const [allList, setAllList] = useState<NewsItem[]>([]);
	const barRef = useRef<HTMLDivElement>(null);
	const pieRef = useRef<HTMLDivElement>(null);

	const token = getToken();
	const username = token?.username ?? "";
	const region = token?.region ?? "";
	const roleName = token?.role?.roleName ?? "";
	const avatar = token?.avatar;

	useEffect(() => {
		http
			.get<NewsItem[]>(
				"/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6",
			)
			.then(setViewList);
	}, []);

	useEffect(() => {
		http
			.get<NewsItem[]>(
				"/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6",
			)
			.then(setStarList);
	}, []);

	useEffect(() => {
		http
			.get<NewsItem[]>("/news?publishState=2&_expand=category")
			.then((data) => {
				renderBarView(groupBy(data, (item) => item.category?.title ?? ""));
				setAllList(data);
			});
		return () => {
			window.onresize = null;
		};
	}, []);

	const renderBarView = useEffectEvent((obj: Record<string, NewsItem[]>) => {
		if (!barRef.current) return;
		const myChart = Echarts.init(barRef.current);
		myChart.setOption({
			title: { text: "新闻分类图示" },
			tooltip: {},
			legend: { data: ["数量"] },
			xAxis: {
				data: Object.keys(obj),
				axisLabel: { rotate: 45, interval: 0 },
			},
			yAxis: { minInterval: 1 },
			series: [
				{
					name: "数量",
					type: "bar",
					data: Object.values(obj).map((items) => items.length),
				},
			],
		});
		window.onresize = () => myChart.resize();
	});

	const renderPieView = useCallback(() => {
		const currentList = allList.filter((item) => item.author === username);
		const grouped = groupBy(currentList, (item) => item.category?.title ?? "");
		const list = Object.entries(grouped).map(([name, items]) => ({
			name,
			value: items.length,
		}));

		let myChart: Echarts.ECharts;
		if (!pieChart) {
			if (!pieRef.current) return;
			myChart = Echarts.init(pieRef.current);
			setPieChart(myChart);
		} else {
			myChart = pieChart;
		}

		myChart.setOption({
			title: { text: "当前用户新闻分类图示", left: "center" },
			tooltip: { trigger: "item" },
			legend: { orient: "vertical", left: "left" },
			series: [
				{
					name: "发布数量",
					type: "pie",
					radius: "50%",
					data: list,
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: "rgba(0, 0, 0, 0.5)",
						},
					},
				},
			],
		});
	}, [allList, username, pieChart]);

	return (
		<div className="site-card-wrapper">
			<Row gutter={16}>
				<Col span={8}>
					<Card title="用户最常浏览">
						<ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
							{viewList.map((item) => (
								<li
									key={item.id}
									style={{
										padding: "8px 0",
										borderBottom: "1px solid #f0f0f0",
									}}
								>
									<a href={`/news-manage/preview/${item.id}`}>{item.title}</a>
								</li>
							))}
						</ul>
					</Card>
				</Col>
				<Col span={8}>
					<Card title="用户点赞最多">
						<ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
							{starList.map((item) => (
								<li
									key={item.id}
									style={{
										padding: "8px 0",
										borderBottom: "1px solid #f0f0f0",
									}}
								>
									<a href={`/news-manage/preview/${item.id}`}>{item.title}</a>
								</li>
							))}
						</ul>
					</Card>
				</Col>
				<Col span={8}>
					<Card
						cover={
							<img
								alt="example"
								src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
							/>
						}
						actions={[
							<PieChartOutlined
								key="setting"
								onClick={() => {
									setTimeout(() => {
										setOpen(true);
										renderPieView();
									}, 0);
								}}
							/>,
							<EditOutlined key="edit" />,
							<EllipsisOutlined key="ellipsis" />,
						]}
					>
						<Meta
							avatar={
								<Avatar
									src={
										avatar ||
										"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
									}
								/>
							}
							title={username}
							description={
								<div>
									<b style={{ marginRight: 20 }}>{region || "全球"}</b>
									{roleName}
								</div>
							}
						/>
					</Card>
				</Col>
			</Row>
			<Drawer
				title="个人新闻分类"
				placement="right"
				closable
				onClose={() => setOpen(false)}
				open={open}
			>
				<div ref={pieRef} style={{ height: 400, marginTop: 30 }} />
			</Drawer>
			<div ref={barRef} style={{ height: 400, marginTop: 30 }} />
		</div>
	);
}
