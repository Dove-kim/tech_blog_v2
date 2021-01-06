import React from 'react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';

const Post = ({ text }) => {
  return (
    <CKEditor
      editor={Editor}
      data={text}
      onReady={(editor) => {
        editor.isReadOnly = true;
      }}
    />
  );
};

export default Post;
