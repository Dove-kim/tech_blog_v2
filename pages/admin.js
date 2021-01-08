import axios from 'axios';
import Layout from '../components/layout';
import './admin.scss';
const crypto = require('crypto');
import React from 'react';
import jsCookie from 'js-cookie';
import dynamic from 'next/dynamic';
const Editor = dynamic(() => import('../components/editor'), {
  ssr: false,
});

export const getServerSideProps = async (context) => {
  const post = 1;

  return {
    props: {
      post,
    },
  };
};

const Admin = ({ post }) => {
  const onEnter = () => {
    if (window.event.keyCode == 13) {
      let password = crypto
        .createHash('sha512')
        .update(document.getElementById('code').value)
        .digest('base64');
      //console.log(password);

      axios.post('/api/auth', { password: password }).then((data) => {
        if (data.data.result === 'yes') {
          jsCookie.set('token', data.data.token, { expires: 1 });
          window.alert('환영합니다. DK');
          document.getElementById('modalDiv').style.display = 'none';
        } else {
          window.alert('잘못된 접근입니다.');
        }
      });
    }
  };

  return (
    <Layout>
      <div className="modalDiv" id="modalDiv">
        <div className="ModalOverlay" />
        <div className="ModalWrapper">
          <div className="ModalInner" name="content">
            <div className="Login">
              <p className="quest">이곳은 관리자 페이지 입니다.</p>
              <p>who are you?</p>
              <input
                id="code"
                type="password"
                onKeyPress={onEnter}
                placeholder="코드를 입력해주세요"
              ></input>
            </div>
          </div>
        </div>
      </div>
      <Editor />
    </Layout>
  );
};

export default Admin;
