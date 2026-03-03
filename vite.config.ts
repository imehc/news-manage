import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
		},
	},
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:5000",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("node_modules")) {
						if (id.includes("antd") || id.includes("@ant-design")) {
							return "antd";
						}
						if (id.includes("echarts") || id.includes("zrender")) {
							return "echarts";
						}
						if (id.includes("lexical")) {
							return "lexical";
						}
						if (id.includes("react-dom") || id.includes("react/")) {
							return "vendor";
						}
					}
				},
			},
		},
	},
});
