import React, { useRef, useEffect, useState, useCallback } from 'react';
import Quill from 'quill';

import ImageResize from 'quill-image-resize-module-react';
Quill.register('modules/imageResize', ImageResize);

import './editor.scss';
import jsCookie from 'js-cookie';
import WriteActionButton from './WriteActionButton';
import axios from 'axios';

// <p><img ~~~/></p> 형태에서 img의 src수정
function Base64toServerImage(fullstring, data) {
  const changeStr = fullstring.split('>');

  let count = 0;
  for (let i in changeStr) {
    if (changeStr[i].includes('<p')) {
      changeStr[i] += '>';
    } else if (changeStr[i].includes('</p')) {
      changeStr[i] += '>';
    } else if (changeStr[i].includes('<img')) {
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
    }
  }

  return changeStr.filter((v) => v !== false).join('');
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

const Editor = ({ postno }) => {
  const quillElement = useRef(null);
  const quillinstance = useRef(null);
  const [title, setTitle] = useState('');
  const [post_no, setPost_no] = useState(-1);
  const [categoryList, setCategoryList] = useState('');
  const [cate, setCate] = useState(-1);

  const onSave = useCallback(async () => {
    if (cate < 0) {
      alert('카테고리를 선택하세요');
      return;
    }
    const quill = quillinstance.current;
    const data = [];

    const base64Data = quill.root.innerHTML
      .split('src=')
      .filter((v) => v.startsWith('"data') || v.startsWith("'blog_img"))
      .map((v) => {
        if (v.includes('width')) {
          return (
            v.split('width')[0].substring(0, v.split('width')[0].length - 2) +
            '>>1>>' +
            v.split('width')[1].split('>')[0].replace(/\"/gi, "'")
          );
        } else if (v.includes('blog_img')) {
          //사진이 존재함
          return v;
        } else {
          return (
            v.split('>')[0].substring(0, v.split('>')[0].length - 1) + '>>0'
          );
        }
      });
    const formDataArr = [];
    let hasOption = false;
    if (base64Data.length > 0) {
      for (let i in base64Data) {
        if (!base64Data[i].includes('>>')) {
          data.push({
            name: base64Data[i],
            ori: true, //해당이미지는 존재함
          });
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
    let innerHTML = quill.root.innerHTML;
    if (data.length > 0) {
      innerHTML = await Base64toServerImage(quill.root.innerHTML, data);
    }

    axios
      .post('/api/post', {
        title: title,
        body: innerHTML.replace(/\"/gi, "'"),
        category: cate,
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
  }, [title, post_no, cate]);

  const onDelete = useCallback(() => {
    if (post_no < 0) {
      return;
    }
    if (confirm('삭제할꺼?')) {
      axios
        .delete('/api/post/' + post_no, {
          data: { token: jsCookie.get('token') },
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
  }, [post_no]);

  const onTitleChange = useCallback(
    (e) => {
      setTitle(e.target.value);
    },
    [title],
  );

  const onCeteChange = useCallback(
    (e) => {
      setCate(e.target.id);
      document.getElementById('selectedCategory').innerHTML =
        '선택된 카테고리: ' + e.target.innerHTML;
    },
    [cate],
  );

  useEffect(async () => {
    setPost_no(postno);
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

    await axios.get('/api/category').then((data) => {
      data = data.data;
      let items;
      items = data.map((data) => (
        <div key={data.no} onClick={onCeteChange} id={data.no}>
          {data.name}
        </div>
      ));
      setCategoryList(items);
    });

    quillinstance.current = new Quill(quillElement.current, {
      theme: 'snow',
      placeholder: '내용을 작성하세요',
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ size: ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          ['blockquote', 'code-block', 'link', 'image'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ align: [] }],
          ['clean'],
        ],
        imageResize: {
          modules: ['Resize', 'DisplaySize'],
        },
      },
    });

    if (postno > 0) {
      axios.get('/api/post/' + postno).then((data) => {
        data = data.data;
        if (data.result) {
          window.location.href = '/';
        }
        setTitle(data.title);
        setPost_no(data.no);
        document.getElementById('selectedCategory').innerHTML =
          '선택된 카테고리: ' + data.category;
        setCate(data.cate);
        console.log(data.body);
        quillinstance.current.root.innerHTML = data.body;
      });
    }
  }, []);

  return (
    <div className="EditorBlock">
      <input
        onChange={onTitleChange}
        value={title}
        placeholder="제목을 입력하세요"
        className="TitleInput"
      />
      <div className="dropdown">
        <button className="dropbtn">카테고리</button>
        <div className="dropdown-content">{categoryList}</div>
      </div>
      <div id="selectedCategory"></div>
      <div className="QuillWrapper">
        <div ref={quillElement} />
      </div>
      <WriteActionButton onSave={onSave} onDelete={onDelete} />
    </div>
  );
};

export default Editor;
