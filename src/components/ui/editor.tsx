'use client'

import * as React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import {
  ClassicEditor,
  Essentials,
  Bold,
  Italic,
  Paragraph,
  Heading,
  Link,
  List,
  Undo
} from 'ckeditor5'

import 'ckeditor5/ckeditor5.css'

interface EditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function Editor({ value, onChange, placeholder }: EditorProps) {
  return (
    <div className="w-full prose max-w-none">
      <CKEditor
        editor={ClassicEditor}
        config={{
          plugins: [Essentials, Bold, Italic, Paragraph, Heading, Link, List, Undo],
          toolbar: [
            'undo', 'redo', '|',
            'heading', '|',
            'bold', 'italic', '|',
            'link', 'bulletedList', 'numberedList'
          ],
          placeholder: placeholder
        }}
        data={value}
        onChange={(event, editor) => {
          const data = editor.getData()
          onChange(data)
        }}
      />
    </div>
  )
}
