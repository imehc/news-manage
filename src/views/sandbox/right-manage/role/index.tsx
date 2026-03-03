import {
	DeleteOutlined,
	ExclamationCircleOutlined,
	UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Modal, Table, Tree } from "antd";
import { useEffect, useState } from "react";
import { http } from "@/lib/http";
import type { Right, Role } from "@/lib/types";

const { confirm } = Modal;

export function RoleList() {
	const [dataSource, setDataSource] = useState<Role[]>([]);
	const [rightList, setRightList] = useState<Right[]>([]);
	const [currentRights, setCurrentRights] = useState<string[]>([]);
	const [currentId, setCurrentId] = useState(0);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			render: (id: number) => <b>{id}</b>,
		},
		{ title: "角色名称", dataIndex: "roleName" },
		{
			title: "操作",
			render: (_: unknown, item: Role) => (
				<div>
					<Button
						style={{ marginRight: 10 }}
						danger
						type="primary"
						shape="circle"
						icon={<DeleteOutlined />}
						onClick={() => confirmMethod(item)}
					/>
					<Button
						type="primary"
						shape="circle"
						icon={<UnorderedListOutlined />}
						onClick={() => {
							setIsModalOpen(true);
							setCurrentRights(item.rights);
							setCurrentId(item.id);
						}}
					/>
				</div>
			),
		},
	];

	useEffect(() => {
		http.get<Role[]>("/roles").then(setDataSource);
	}, []);

	useEffect(() => {
		http.get<Right[]>("/rights?_embed=children").then(setRightList);
	}, []);

	const confirmMethod = (item: Role) => {
		confirm({
			title: "您确定要删除吗?",
			icon: <ExclamationCircleOutlined />,
			okText: "确定",
			cancelText: "取消",
			onOk() {
				setDataSource(dataSource.filter((data) => data.id !== item.id));
				http.delete(`/roles/${item.id}`);
			},
		});
	};

	const handleOk = () => {
		setIsModalOpen(false);
		setDataSource(
			dataSource.map((item) => {
				if (item.id === currentId) {
					return { ...item, rights: currentRights };
				}
				return item;
			}),
		);
		http.patch(`/roles/${currentId}`, { rights: currentRights });
	};

	const onCheck = (checkKeys: { checked: string[] } | string[]) => {
		if (Array.isArray(checkKeys)) {
			setCurrentRights(checkKeys);
		} else {
			setCurrentRights(checkKeys.checked);
		}
	};

	return (
		<div>
			<Table
				dataSource={dataSource}
				columns={columns}
				rowKey={(item) => item.id}
			/>
			<Modal
				title="权限分配"
				open={isModalOpen}
				onOk={handleOk}
				onCancel={() => setIsModalOpen(false)}
				cancelText="取消"
				okText="确定"
			>
				<Tree
					checkable
					checkedKeys={currentRights}
					onCheck={onCheck as (checked: unknown) => void}
					checkStrictly
					treeData={rightList.map((item) => ({
						...item,
						children: item.children ?? undefined,
					}))}
				/>
			</Modal>
		</div>
	);
}
