interface LexicalNode {
    type: string;
    text?: string;
    children?: LexicalNode[];
}

interface ShopDescriptionProps {
    description: string | { root: { children: LexicalNode[] } } | null | undefined;
}

export function ShopDescription({ description }: ShopDescriptionProps) {
    if (!description) return null;

    return (
        <div className="space-y-2">
            <h2 className="text-lg font-bold">Acerca de</h2>
            <div className="text-muted-foreground leading-relaxed">
                {typeof description === 'string'
                    ? description
                    : (description as any)?.root?.children?.map((node: LexicalNode, idx: number) => {
                        if (node.type === 'paragraph') {
                            return (
                                <p key={idx} className="mb-3">
                                    {node.children?.map((child: LexicalNode, childIdx: number) => {
                                        if (child.type === 'text') {
                                            return <span key={childIdx}>{child.text}</span>;
                                        }
                                        return null;
                                    })}
                                </p>
                            );
                        }
                        return null;
                    })
                }
            </div>
        </div>
    );
}
