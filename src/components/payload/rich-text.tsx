"use client";

import React from "react";

interface LexicalNode {
    type: string;
    text?: string;
    tag?: string;
    format?: number;
    children?: LexicalNode[];
}

export function RichText({ content }: { content: { root: { children: LexicalNode[] } } }) {
    if (!content || !content.root || !content.root.children) {
        return null;
    }

    return (
        <div className="prose prose-brand max-w-none">
            {content.root.children.map((node: LexicalNode, index: number) => {
                if (node.type === 'paragraph') {
                    return (
                        <p key={index} className="mb-4">
                            {node.children?.map((child: LexicalNode, i: number) => {
                                if (child.type === 'text') {
                                    return <span key={i} style={{
                                        fontWeight: (child.format ?? 0) & 1 ? 'bold' : 'normal',
                                        fontStyle: (child.format ?? 0) & 2 ? 'italic' : 'normal',
                                        textDecoration: (child.format ?? 0) & 4 ? 'underline' : 'none'
                                    }}>{child.text}</span>;
                                }
                                return null;
                            })}
                        </p>
                    );
                }
                if (node.type === 'heading') {
                    const Tag = (node.tag || 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
                    return (
                        <Tag key={index} className="font-bold mb-2">
                            {node.children?.map((child: LexicalNode, i: number) => child.text).join('')}
                        </Tag>
                    );
                }
                return null;
            })}
        </div>
    );
}
