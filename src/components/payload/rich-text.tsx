"use client";

import React from "react";

export function RichText({ content }: { content: any }) {
    if (!content || !content.root || !content.root.children) {
        return null;
    }

    return (
        <div className="prose prose-brand max-w-none">
            {content.root.children.map((node: any, index: number) => {
                if (node.type === 'paragraph') {
                    return (
                        <p key={index} className="mb-4">
                            {node.children?.map((child: any, i: number) => {
                                if (child.type === 'text') {
                                    return <span key={i} style={{
                                        fontWeight: child.format & 1 ? 'bold' : 'normal',
                                        fontStyle: child.format & 2 ? 'italic' : 'normal',
                                        textDecoration: child.format & 4 ? 'underline' : 'none'
                                    }}>{child.text}</span>;
                                }
                                return null;
                            })}
                        </p>
                    );
                }
                if (node.type === 'heading') {
                    const Tag = `h${node.tag?.slice(1) || 2}` as any;
                    return (
                        <Tag key={index} className="font-bold mb-2">
                            {node.children?.map((child: any, i: number) => child.text).join('')}
                        </Tag>
                    );
                }
                return null;
            })}
        </div>
    );
}
