"use client";
import React from "react";

type Props = {
  html: string;
  maxLength?: number;
  skipLinks?: boolean;
};

const VOID_TAGS = new Set([
  "area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"
]);

function domNodeToReact(
  node: ChildNode,
  key: number,
  maxLength: number,
  charCount: { count: number },
  skipLinks: boolean
): React.ReactNode {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || "";
    if (charCount.count >= maxLength) return null;

    let remaining = maxLength - charCount.count;
    charCount.count += text.length;

    return text.length > remaining ? text.slice(0, remaining) + "..." : text;
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;

    const props: any = { key };
    if (el.getAttribute("class")) props.className = el.getAttribute("class");
    if (el.getAttribute("id")) props.id = el.getAttribute("id");
    if (el.tagName.toLowerCase() === "a" && !skipLinks) {
      props.href = el.getAttribute("href");
      props.target = "_blank";
      props.rel = "noopener noreferrer";
    }

    if (skipLinks && el.tagName.toLowerCase() === "a") {
      return <span {...props} />;
    }

    // Void elements: no children
    if (VOID_TAGS.has(el.tagName.toLowerCase())) {
      return React.createElement(el.tagName.toLowerCase(), props);
    }

    // Normal elements
    const children: React.ReactNode[] = [];
    for (let i = 0; i < el.childNodes.length; i++) {
      const childNode = el.childNodes[i];
      const child = domNodeToReact(childNode, i, maxLength, charCount, skipLinks);
      if (child !== null) children.push(child);
      if (charCount.count >= maxLength) break;
    }

    return React.createElement(el.tagName.toLowerCase(), props, children);
  }

  return null;
}

export default function HtmlRenderer({ html, maxLength = Infinity, skipLinks = false }: Props) {
  const [parsedNodes, setParsedNodes] = React.useState<React.ReactNode[]>([]);

  React.useEffect(() => {
    if (!html) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const charCount = { count: 0 };
    const nodes = Array.from(doc.body.childNodes).map((node, i) =>
      domNodeToReact(node, i, maxLength, charCount, skipLinks)
    );
    setParsedNodes(nodes);
  }, [html, maxLength, skipLinks]);

  return <>{parsedNodes}</>;
}
