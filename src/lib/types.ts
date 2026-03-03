// ===== User & Auth =====
export interface Role {
	id: number;
	roleName: string;
	roleType: number;
	rights: string[];
}

export interface User {
	id: number;
	username: string;
	password: string | number;
	roleState: boolean;
	default: boolean;
	region: string;
	roleId: number;
	role?: Role;
	avatar?: string;
}

// ===== Rights =====
export interface RightChild {
	id: number;
	title: string;
	key: string;
	rightId: number;
	grade: number;
	pagepermisson?: number;
	routepermisson?: number;
}

export interface Right {
	id: number;
	title: string;
	key: string;
	pagepermisson?: number;
	grade: number;
	children: RightChild[] | null;
}

// ===== News =====
export interface Category {
	id: number;
	title: string;
	value: string;
}

export interface NewsItem {
	id: number;
	title: string;
	categoryId: number;
	content: string;
	region: string;
	author: string;
	roleId: number;
	auditState: number;
	publishState: number;
	createTime: number;
	star: number;
	view: number;
	publishTime?: number;
	category?: Category;
}

// ===== Region =====
export interface Region {
	id: number;
	title: string;
	value: string;
}

// ===== Route =====
export interface RouteRight {
	id: number;
	title: string;
	key: string;
	pagepermisson?: number;
	routepermisson?: number;
	grade: number;
	rightId?: number;
}
