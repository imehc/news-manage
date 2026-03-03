import { Layout } from "antd";
import NProgress from "nprogress";
import { useEffect } from "react";
import "nprogress/nprogress.css";
import { NewsRouter } from "@/components/NewsRouter";
import { SideMenu } from "@/components/SideMenu";
import { TopHeader } from "@/components/TopHeader";

const { Content } = Layout;

export function NewsSandBox() {
	NProgress.start();
	useEffect(() => {
		NProgress.done();
	});

	return (
		<Layout style={{ height: "100vh" }}>
			<SideMenu />
			<Layout>
				<TopHeader />
				<Content
					className="site-layout-background"
					style={{
						margin: "24px 16px",
						padding: 24,
						overflow: "auto",
					}}
				>
					<NewsRouter />
				</Content>
			</Layout>
		</Layout>
	);
}
