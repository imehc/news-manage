import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import { Button, Form, Input, Modal, Table } from "antd";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { http } from "@/lib/http";
import type { Category } from "@/lib/types";

const { confirm } = Modal;
const EditableContext = createContext<FormInstance | null>(null);

function EditableRow(props: Record<string, unknown>) {
	const [form] = Form.useForm();
	return (
		<Form form={form} component={false}>
			<EditableContext.Provider value={form}>
				<tr {...props} />
			</EditableContext.Provider>
		</Form>
	);
}

interface EditableCellProps {
	title: string;
	editable: boolean;
	children: ReactNode;
	dataIndex: string;
	record: Category;
	handleSave: (record: Category) => void;
}

function EditableCell({
	editable,
	children,
	dataIndex,
	record,
	handleSave,
	...restProps
}: EditableCellProps) {
	const [editing, setEditing] = useState(false);
	const inputRef = useRef<import("antd/es/input").InputRef>(null);
	const form = useContext(EditableContext);

	useEffect(() => {
		if (editing) {
			inputRef.current?.focus();
		}
	}, [editing]);

	const toggleEdit = () => {
		setEditing(!editing);
		form?.setFieldsValue({ [dataIndex]: record[dataIndex as keyof Category] });
	};

	const save = async () => {
		try {
			const values = await form?.validateFields();
			toggleEdit();
			handleSave({ ...record, ...values });
		} catch (_errInfo) {
			// validation failed
		}
	};

	let childNode = children;
	if (editable) {
		childNode = editing ? (
			<Form.Item
				style={{ margin: 0 }}
				name={dataIndex}
				rules={[{ required: true, message: "必填项" }]}
			>
				<Input
					ref={inputRef}
					onPressEnter={save}
					onBlur={save}
					style={{ width: 200 }}
				/>
			</Form.Item>
		) : (
			<button
				type="button"
				className="editable-cell-value-wrap"
				style={{ paddingRight: 24, cursor: "pointer" }}
				onClick={toggleEdit}
				onKeyDown={(e) => {
					if (e.key === "Enter") toggleEdit();
				}}
			>
				{children}
			</button>
		);
	}

	return <td {...restProps}>{childNode}</td>;
}

export function NewsCategory() {
	const [dataSource, setDataSource] = useState<Category[]>([]);

	useEffect(() => {
		http.get<Category[]>("/categories").then(setDataSource);
	}, []);

	const handleSave = (record: Category) => {
		setDataSource(
			dataSource.map((item) => {
				if (item.id === record.id) {
					return { id: item.id, title: record.title, value: record.title };
				}
				return item;
			}),
		);
		http.patch(`/categories/${record.id}`, {
			title: record.title,
			value: record.title,
		});
	};

	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
			render: (id: number) => <b>{id}</b>,
		},
		{
			title: "栏目名称",
			dataIndex: "title",
			onCell: (record: Category) => ({
				record,
				editable: true,
				dataIndex: "title",
				title: "栏目名称",
				handleSave,
			}),
		},
		{
			title: "操作",
			render: (_: unknown, item: Category) => (
				<Button
					style={{ marginRight: 10 }}
					danger
					type="primary"
					shape="circle"
					icon={<DeleteOutlined />}
					onClick={() => confirmMethod(item)}
				/>
			),
		},
	];

	const confirmMethod = (item: Category) => {
		confirm({
			title: "您确定要删除吗?",
			icon: <ExclamationCircleOutlined />,
			okText: "确定",
			cancelText: "取消",
			onOk() {
				setDataSource(dataSource.filter((data) => data.id !== item.id));
				http.delete(`/categories/${item.id}`);
			},
		});
	};

	return (
		<Table
			dataSource={dataSource}
			columns={columns}
			pagination={{ pageSize: 5 }}
			rowKey={(item) => item.id}
			components={{
				body: {
					row: EditableRow,
					cell: EditableCell,
				},
			}}
		/>
	);
}
