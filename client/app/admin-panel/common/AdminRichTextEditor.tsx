'use client';

import dynamic from 'next/dynamic';

const TinyMceEditor = dynamic(
  () => import('@tinymce/tinymce-react').then((module) => module.Editor),
  {
    ssr: false,
    loading: () => <div className="admin-rich-text-loading" role="status">Loading editor…</div>,
  },
);

type AdminRichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function AdminRichTextEditor({ value, onChange }: AdminRichTextEditorProps) {
  return (
    <div className="admin-rich-text-editor">
      <TinyMceEditor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        value={value}
        onEditorChange={onChange}
        init={{
          height: 220,
          menubar: false,
          plugins: 'lists link image media table code fullscreen',
          toolbar: 'undo redo | blocks | bold italic underline forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table | removeformat code fullscreen',
          toolbar_mode: 'sliding',
          color_map: [
            'F0CA73', 'Gold',
            'D3A84F', 'Muted gold',
            'F3EFE7', 'Off-white',
            'B8B3A8', 'Muted text',
            '100E0B', 'Dark background',
            '403522', 'Border',
          ],
          color_cols: 3,
          skin: 'oxide-dark',
          content_css: 'dark',
          content_style: 'body { background-color: #100e0b; color: #f3efe7; font-family: Arial, sans-serif; font-size: 14px; } a { color: #e5bd63; }',
          statusbar: false,
          branding: false,
          promotion: false,
          resize: false,
          iframe_attrs: { title: 'Description rich text editor' },
        }}
      />
    </div>
  );
}
