import React from 'react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';

const editorConfiguration = {
  toolbar: 'None',
  image: {
    toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side'],
  },
};

const Post = ({ text }) => {
  return (
    <CKEditor
      editor={Editor}
      data={text}
      config={editorConfiguration}
      onReady={(editor) => {
        editor.isReadOnly = true;
        document.getElementsByClassName('loading_div')[0].style.display =
          'none';
      }}
    />
  );
};

export default Post;
