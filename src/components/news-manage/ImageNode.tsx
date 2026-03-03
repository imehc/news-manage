import type {
	DOMConversionMap,
	DOMExportOutput,
	LexicalNode,
	SerializedLexicalNode,
} from "lexical";
import { $applyNodeReplacement, createCommand, DecoratorNode } from "lexical";
import type { JSX } from "react";

export interface ImagePayload {
	src: string;
	altText: string;
	width?: number;
	height?: number;
}

export const INSERT_IMAGE_COMMAND = createCommand<ImagePayload>(
	"INSERT_IMAGE_COMMAND",
);

interface SerializedImageNode extends SerializedLexicalNode {
	src: string;
	altText: string;
	width?: number;
	height?: number;
}

export class ImageNode extends DecoratorNode<JSX.Element> {
	__src: string;
	__altText: string;
	__width: number | undefined;
	__height: number | undefined;

	static getType(): string {
		return "image";
	}

	static clone(node: ImageNode): ImageNode {
		return new ImageNode(
			node.__src,
			node.__altText,
			node.__width,
			node.__height,
			node.__key,
		);
	}

	constructor(
		src: string,
		altText: string,
		width?: number,
		height?: number,
		key?: string,
	) {
		super(key);
		this.__src = src;
		this.__altText = altText;
		this.__width = width;
		this.__height = height;
	}

	createDOM(): HTMLElement {
		const span = document.createElement("span");
		span.style.display = "block";
		span.style.textAlign = "center";
		span.style.margin = "8px 0";
		return span;
	}

	updateDOM(): false {
		return false;
	}

	exportDOM(): DOMExportOutput {
		const img = document.createElement("img");
		img.setAttribute("src", this.__src);
		img.setAttribute("alt", this.__altText);
		if (this.__width) img.setAttribute("width", String(this.__width));
		if (this.__height) img.setAttribute("height", String(this.__height));
		img.style.maxWidth = "100%";
		return { element: img };
	}

	static importDOM(): DOMConversionMap | null {
		return {
			img: () => ({
				conversion: (domNode: HTMLElement) => {
					const img = domNode as HTMLImageElement;
					const src = img.getAttribute("src") || "";
					const altText = img.getAttribute("alt") || "";
					const width = img.width || undefined;
					const height = img.height || undefined;
					const node = $createImageNode({ src, altText, width, height });
					return { node };
				},
				priority: 0,
			}),
		};
	}

	exportJSON(): SerializedImageNode {
		return {
			type: "image",
			version: 1,
			src: this.__src,
			altText: this.__altText,
			width: this.__width,
			height: this.__height,
		};
	}

	static importJSON(json: SerializedImageNode): ImageNode {
		return $createImageNode({
			src: json.src,
			altText: json.altText,
			width: json.width,
			height: json.height,
		});
	}

	decorate(): JSX.Element {
		return (
			<img
				src={this.__src}
				alt={this.__altText}
				width={this.__width}
				height={this.__height}
				style={{ maxWidth: "100%", display: "block", margin: "0 auto" }}
			/>
		);
	}
}

export function $createImageNode(payload: ImagePayload): ImageNode {
	return $applyNodeReplacement(
		new ImageNode(payload.src, payload.altText, payload.width, payload.height),
	);
}

export function $isImageNode(
	node: LexicalNode | null | undefined,
): node is ImageNode {
	return node instanceof ImageNode;
}
