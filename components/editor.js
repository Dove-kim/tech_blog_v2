import React, { useCallback, useEffect, useState } from 'react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import jsCookie from 'js-cookie';
import axios from 'axios';
import './editor.scss';
import TagBox from './tagBox';

const editorConfiguration = {
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'link',
      'italic',
      'bulletedList',
      'numberedList',
      '|',
      'alignment',
      'indent',
      'outdent',
      'blockQuote',
      'codeBlock',
      'code',
      '|',
      'fontSize',
      'horizontalLine',
      'highlight',
      '|',
      'imageInsert',
      'insertTable',
      '|',
      'undo',
      'redo',
      '|',
      'MathType',
      'ChemType',
      'underline',
      'HtmlEmbed',
    ],
  },
  language: 'ko',
  image: {
    toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side'],
  },
  table: {
    contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells',
      'tableCellProperties',
      'tableProperties',
    ],
  },
};

// <p><img ~~~/></p> 형태에서 img의 src수정
function Base64toServerImage(fullstring, data) {
  const changeStr = fullstring.split('>');

  let count = 0;
  for (let i in changeStr) {
    if (changeStr[i].includes('<img')) {
      if (changeStr[i].includes('https') || changeStr[i].includes('https')) {
        changeStr[i] += '>';
        continue;
      }
      if (data[count].ori) {
        changeStr[i] = "<img src='" + data[count].name + "'>";
      } else {
        changeStr[i] =
          "<img src='/blog_img/" +
          data[count].name +
          "'" +
          (data[count].hasOpt ? ' width' + data[count].option : '') +
          '>';
      }
      count++;
    } else {
      changeStr[i] += '>';
    }
  }

  let result = changeStr.filter((v) => v !== false).join('');
  return result.substring(0, result.length - 1);
}

//이미지 데이터를 blob으로 변환
function DataURIToBlob(dataURI) {
  const splitDataURI = dataURI.split(',');
  const byteString =
    splitDataURI[0].indexOf('base64') >= 0
      ? atob(splitDataURI[1])
      : decodeURI(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(':')[1].split(';')[0];
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

  return new Blob([ia], { type: mimeString });
}

const EditorView = () => {
  const [context, setContext] = useState('');
  const [title, setTitle] = useState('');
  const [post_no, setPost_no] = useState(-1);
  const [localTags, setLocalTags] = useState([]);

  useEffect(async () => {
    let postno = -1;
    if (window.location.search.includes('post=')) {
      postno = Number(window.location.search.split('post=')[1]);
      setPost_no(postno);
    } else {
      setPost_no(-1);
    }
    //console.log(postno);
    if (jsCookie.get('token')) {
      axios.put('/api/auth', { token: jsCookie.get('token') }).then((data) => {
        data = data.data;
        if (data.result == 'yes') {
          document.getElementById('modalDiv').style.display = 'none';
        } else {
          jsCookie.remove('token', { path: '' });
        }
      });
    }
    if (postno > 0) {
      axios.get('/api/post/' + postno).then((data) => {
        data = data.data;
        //console.log(data);
        if (data.result == false) {
          //window.location.href = '/';
        }
        setTitle(data.post.title);
        setPost_no(data.post.no);
        setLocalTags(data.post.tag);
        setContext(data.post.body);
      });
    }

    document.body.onkeydown = function (e) {
      if (e.ctrlKey && String.fromCharCode(e.keyCode) === 'S') {
        e.preventDefault();
      } else if (e.keyCode == 46) {
        e.preventDefault();
      }
    };
  }, []);

  const onSave = useCallback(async () => {
    //console.log(context);
    const data = [];

    const content = context;
    let base64Data = content
      .split('src=')
      .filter(
        (v) =>
          v.startsWith('"data') ||
          v.startsWith('"/blog_img') ||
          v.startsWith('"https') ||
          v.startsWith('"http'),
      )
      .map((v) => {
        if (v.includes('blog_img')) {
          //사진이 존재함
          return v.split('>')[0].substring(1, v.split('>')[0].length - 1);
        } else if (v.startsWith('"https') || v.startsWith('"http')) {
          //사진이 url구조
          return v.split('"')[1];
        } else {
          return (
            v.split('>')[0].substring(1, v.split('>')[0].length - 1) + '>>0'
          );
        }
      });

    //console.log(base64Data);

    const formDataArr = [];
    let hasOption = false;
    if (base64Data.length > 0) {
      for (let i in base64Data) {
        if (!base64Data[i].includes('>>')) {
          data.push({
            name: base64Data[i],
            ori: true, //해당이미지는 존재함
          });
          continue;
        }
        const file = DataURIToBlob(base64Data[i].split('>>')[0]);
        const formData = new FormData();

        const nameMaking =
          `${Math.floor(Math.random() * 3000)}` +
          '_' +
          `${new Date().getTime()}` +
          '.' +
          file.type.split('/')[1];

        formData.append('img', file, nameMaking); //3번째는 filename
        hasOption = base64Data[i].split('>>')[1] == '1';
        data.push({
          name: nameMaking,
          hasOpt: hasOption,
          option: hasOption ? base64Data[i].split('>>')[2] : '',
          ori: false,
        });

        formDataArr.push(formData);
      }
    }
    let innerHTML = content;

    if (data.length > 0) {
      innerHTML = await Base64toServerImage(content, data);
    }

    //console.log(localTags);

    axios
      .post('/api/post', {
        title: title,
        body: innerHTML.replace(/\"/gi, "'"),
        tags: await localTags.map((data) => [data]),
        id: post_no,
        token: jsCookie.get('token'),
      })
      .then((data) => {
        data = data.data;
        if (data.result === 'yes') {
          formDataArr.forEach((img) => {
            axios.post('/api/uploads', img, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
          });
          alert('업로드 성공');
          window.location.href = '/';
          return;
        }
        alert('업로드 실패..');
        return;
      });
  }, [title, post_no, context, localTags]);

  const onDelete = useCallback(() => {
    if (post_no < 0) {
      return;
    }

    let files = context
      .split('src="')
      .filter((v) => v.startsWith('/blog_img'))
      .map((v) => v.split('"')[0]);

    if (confirm('삭제할꺼?')) {
      axios
        .delete('/api/post/' + post_no, {
          data: { token: jsCookie.get('token'), img: files },
        })
        .then((data) => {
          data = data.data;
          if (data.result == 'yes') {
            alert('삭제완료');
            window.location.href = '/';
            return;
          }
        });
    }
  }, [post_no, context]);

  const onTitleChange = useCallback(
    (e) => {
      setTitle(e.target.value);
    },
    [title],
  );

  const onChange = useCallback(
    async (event, editor) => {
      setContext(await editor.getData());
    },

    [context],
  );
  const setLocalTag = useCallback(
    (data) => {
      setLocalTags(data);
    },
    [localTags],
  );

  return (
    <div className="EditorBlock">
      <input
        onChange={onTitleChange}
        value={title}
        placeholder="제목을 입력하세요"
        className="TitleInput"
      />

      <TagBox localTags={localTags} setLocalTags={setLocalTag} />
      <CKEditor
        editor={Editor}
        config={editorConfiguration}
        data={context}
        onChange={onChange}
      />
      <div className="WriteActionButton">
        <button className="SubmitButton" onClick={onSave}>
          저장
        </button>

        <button className="SubmitButton" onClick={onDelete}>
          삭제
        </button>
      </div>
    </div>
  );
};

export default EditorView;
