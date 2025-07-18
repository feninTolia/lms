'use client';

import TextAlignKit from '@tiptap/extension-text-align';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from './MenuBar';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RichTextEditor = ({ field }: { field: any }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlignKit.configure({ types: ['heading', 'paragraph'] }),
    ],
    editorProps: {
      attributes: {
        class:
          'dark:bg-input/30 min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !max-w-none !w-full',
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      field?.onChange(JSON.stringify(editor.getJSON()));
    },
    content: field.value ? JSON.parse(field.value) : '',
  });

  return (
    <div className="w-full space-y-4 border border-input rounded-md overflow-hidden ">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
