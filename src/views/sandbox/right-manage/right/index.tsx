import {
	DeleteOutlined,
	EditOutlined,
	ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Button, Modal, Popover, Switch, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { http } from "@/lib/http";
import type { Right, RightChild } from "@/lib/types";

const { confirm } = Modal;

type RightOrChild = Right | RightChild;

export function RightList() {
	const [dataSource, setDataSource] = useState<Right[]>([]);

	useEffect(() => {
		http.get<Right[]>("/rights?_embed=children").then((data) => {
			for (const item of data) {
				if (item.children && item.children.length === 0) {
					item.children = null;
				}
			}
			setDataSource(data);
		});
	}, []);

	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
			render: (id: number) => <b>{id}</b>,
		},
		{ title: "权限名称", dataIndex: "title", key: "title" },
		{
			title: "权限路径",
			dataIndex: "key",
			key: "key",
			render: (key: string) => <Tag color="orange">{key}</Tag>,
		},
		{
			title: "操作",
			render: (_: unknown, item: RightOrChild) => (
				<div>
					<Button
						style={{ marginRight: 10 }}
						danger
						type="primary"
						shape="circle"
						icon={<DeleteOutlined />}
						onClick={() => confirmMethod(item)}
					/>
					<Popover
						content={
							<div style={{ textAlign: "center" }}>
								<Switch
									checked={item.pagepermisson === 1}
									onChange={() => switchMethod(item)}
								/>
							</div>
						}
						title="页面配置项"
						trigger="click"
					>
						<Button
							type="primary"
							shape="circle"
							icon={<EditOutlined />}
							disabled={item.pagepermisson === undefined}
						/>
					</Popover>
				</div>
			),
		},
	];

	const confirmMethod = (item: RightOrChild) => {
		confirm({
			title: "您确定要删除吗?",
			icon: <ExclamationCircleOutlined />,
			okText: "确定",
			cancelText: "取消",
			onOk() {
				deleteMethod(item);
			},
		});
	};

	const deleteMethod = (item: RightOrChild) => {
		if (item.grade === 1) {
			setDataSource(dataSource.filter((data) => data.id !== item.id));
			http.delete(`/rights/${item.id}`);
		} else {
			const child = item as RightChild;
			const parent = dataSource.find((data) => data.id === child.rightId);
			if (parent?.children) {
				parent.children = parent.children.filter((data) => data.id !== item.id);
			}
			http.delete(`/children/${item.id}`);
			setDataSource([...dataSource]);
		}
	};

	const switchMethod = (item: RightOrChild) => {
		item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
		setDataSource([...dataSource]);
		if (item.grade === 1) {
			http.patch(`/rights/${item.id}`, {
				pagepermisson: item.pagepermisson,
			});
		} else {
			http.patch(`/children/${item.id}`, {
				pagepermisson: item.pagepermisson,
			});
		}
	};

	return (
		<Table
			dataSource={dataSource}
			columns={columns}
			pagination={{ pageSize: 5 }}
		/>
	);
}
