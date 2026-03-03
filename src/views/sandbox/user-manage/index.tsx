import {
	DeleteOutlined,
	EditOutlined,
	ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { FormInstance } from "antd";
import { Button, Modal, Switch, Table } from "antd";
import { useEffect, useRef, useState } from "react";
import { UserForm } from "@/components/user-manage/UserForm";
import { getToken, http } from "@/lib/http";
import type { Region, Role, User } from "@/lib/types";

const { confirm } = Modal;

const roleObj: Record<string, string> = {
	"1": "superadmin",
	"2": "admin",
	"3": "editor",
};

export function UserList() {
	const [dataSource, setDataSource] = useState<User[]>([]);
	const [isAddVisible, setIsAddVisible] = useState(false);
	const [isUpdateVisible, setIsUpdateVisible] = useState(false);
	const [rolelist, setRolelist] = useState<Role[]>([]);
	const [regionList, setRegionList] = useState<Region[]>([]);
	const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);
	const [current, setCurrent] = useState<User | null>(null);

	const addForm = useRef<FormInstance>(null);
	const updateForm = useRef<FormInstance>(null);

	const token = getToken();
	const roleId = String(token?.roleId ?? "");
	const username = token?.username ?? "";
	const region = token?.region ?? "";

	useEffect(() => {
		http.get<User[]>("/users?_expand=role").then((list) => {
			setDataSource(
				roleObj[roleId] === "superadmin"
					? list
					: [
							...list.filter((item) => item.username === username),
							...list.filter(
								(item) =>
									item.region === region &&
									roleObj[String(item.roleId)] === "editor",
							),
						],
			);
		});
	}, [roleId, username, region]);

	useEffect(() => {
		http.get<Region[]>("/regions").then(setRegionList);
	}, []);

	useEffect(() => {
		http.get<Role[]>("/roles").then(setRolelist);
	}, []);

	const columns = [
		{
			title: "区域",
			dataIndex: "region",
			filters: [
				...regionList.map((item) => ({ text: item.title, value: item.value })),
				{ text: "全球", value: "全球" },
			],
			onFilter: (value: unknown, record: User) => {
				if (value === "全球") return record.region === "";
				return record.region === value;
			},
			key: "region",
			render: (region: string) => <b>{region === "" ? "全球" : region}</b>,
		},
		{
			title: "角色名称",
			dataIndex: "role",
			render: (role: Role | undefined) => role?.roleName,
		},
		{ title: "用户名", dataIndex: "username", key: "username" },
		{
			title: "用户状态",
			dataIndex: "roleState",
			key: "roleState",
			render: (roleState: boolean, item: User) => (
				<Switch
					checked={roleState}
					disabled={item.default}
					onChange={() => handleChange(item)}
				/>
			),
		},
		{
			title: "操作",
			render: (_: unknown, item: User) => (
				<div>
					<Button
						style={{ marginRight: 10 }}
						danger
						type="primary"
						shape="circle"
						icon={<DeleteOutlined />}
						onClick={() => confirmMethod(item)}
						disabled={item.default || username === item.username}
					/>
					<Button
						type="primary"
						shape="circle"
						icon={<EditOutlined />}
						disabled={item.default}
						onClick={() => handleUpdate(item)}
					/>
				</div>
			),
		},
	];

	const handleUpdate = (item: User) => {
		setCurrent(item);
		setIsUpdateVisible(true);
		setIsUpdateDisabled(item.roleId === 1);
		updateForm.current?.setFieldsValue(item);
	};

	const handleChange = (item: User) => {
		item.roleState = !item.roleState;
		setDataSource([...dataSource]);
		http.patch(`/users/${item.id}`, { roleState: item.roleState });
	};

	const confirmMethod = (item: User) => {
		confirm({
			title: "您确定要删除吗?",
			icon: <ExclamationCircleOutlined />,
			okText: "确定",
			cancelText: "取消",
			onOk() {
				setDataSource(dataSource.filter((data) => data.id !== item.id));
				http.delete(`/users/${item.id}`);
			},
		});
	};

	const addFormOK = () => {
		addForm.current
			?.validateFields()
			.then(
				(value: {
					username: string;
					password: string;
					region: string;
					roleId: number;
				}) => {
					setIsAddVisible(false);
					addForm.current?.resetFields();
					http
						.post<User>("/users", {
							...value,
							roleState: true,
							default: false,
						})
						.then((res) => {
							setDataSource([
								...dataSource,
								{
									...res,
									role: rolelist.find((item) => item.id === value.roleId),
								},
							]);
						});
				},
			);
	};

	const updateFormOK = () => {
		updateForm.current
			?.validateFields()
			.then(
				(value: {
					username: string;
					password: string;
					region: string;
					roleId: number;
				}) => {
					setIsUpdateVisible(false);
					setDataSource(
						dataSource.map((item) => {
							if (item.id === current?.id) {
								return {
									...item,
									...value,
									role: rolelist.find((data) => data.id === value.roleId),
								};
							}
							return item;
						}),
					);
					setIsUpdateDisabled(!isUpdateDisabled);
					if (current) http.patch(`/users/${current.id}`, value);
				},
			);
	};

	return (
		<div>
			<Button
				type="primary"
				style={{ marginBottom: 20 }}
				onClick={() => setIsAddVisible(true)}
			>
				新增用户
			</Button>
			<Table
				dataSource={dataSource}
				columns={columns}
				pagination={{ pageSize: 5 }}
				rowKey={(item) => item.id}
			/>
			<Modal
				open={isAddVisible}
				title="新增用户"
				okText="确定"
				cancelText="取消"
				onCancel={() => {
					setIsAddVisible(false);
					addForm.current?.resetFields();
				}}
				onOk={addFormOK}
			>
				<UserForm regionList={regionList} rolelist={rolelist} ref={addForm} />
			</Modal>
			<Modal
				open={isUpdateVisible}
				title="更新用户"
				okText="更新"
				cancelText="取消"
				forceRender
				onCancel={() => {
					setIsUpdateVisible(false);
					updateForm.current?.resetFields();
				}}
				onOk={updateFormOK}
			>
				<UserForm
					regionList={regionList}
					rolelist={rolelist}
					ref={updateForm}
					isUpdateDisabled={isUpdateDisabled}
					isUpdate
				/>
			</Modal>
		</div>
	);
}
