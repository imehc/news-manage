import { Navigate, Route, Routes } from "react-router";
import { getToken } from "./lib/http";
import { Login } from "./views/login";
import { NewsDetail } from "./views/news/detail";
import { NewsList } from "./views/news/list";
import { NewsSandBox } from "./views/sandbox";

function ProtectedRoute() {
	const token = getToken();
	return token ? <NewsSandBox /> : <Navigate to="/login" replace />;
}

export function AppRouter() {
	return (
		<Routes>
			<Route path="/news" element={<NewsList />} />
			<Route path="/detail/:id" element={<NewsDetail />} />
			<Route path="/login" element={<Login />} />
			<Route path="/*" element={<ProtectedRoute />} />
		</Routes>
	);
}
