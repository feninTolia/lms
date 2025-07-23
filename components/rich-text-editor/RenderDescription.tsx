'use client';

import TextAlignKit from '@tiptap/extension-text-align';
import { generateHTML } from '@tiptap/html';
import { JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useMemo } from 'react';
import parse from 'html-react-parser';

export function RenderDescription({ json }: { json: JSONContent }) {
  const output = useMemo(() => {
    return generateHTML(json, [
      StarterKit,
      TextAlignKit.configure({ types: ['heading', 'paragraph'] }),
    ]);
  }, [json]);

  return (
    <div className="prose dark:prose-invert prose-li:marker:text-primary">
      {parse(output)}
    </div>
  );
}
