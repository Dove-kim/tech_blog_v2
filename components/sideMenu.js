import { useEffect, useState } from 'react';
import './sideMenu.scss';
import axios from 'axios';

const SideMenu = () => {
  const [categories, setCategories] = useState();

  useEffect(async () => {
    await axios.get('/api/category').then((data) => {
      data = data.data;
      let items;
      items = data.map((data) => (
        <a key={data.no} href={`/?category=${data.no}`}>
          {data.name}
        </a>
      ));
      setCategories(items);
    });
  }, []);

  const openNav = () => {
    document.getElementById('mySidenav').style.width = '250px';
  };

  const closeNav = () => {
    document.getElementById('mySidenav').style.width = '0';
  };
  return (
    <div className="sideMenu">
      <div id="mySidenav" className="sidenav">
        <a href={null} className="closebtn" onClick={closeNav}>
          &times;
        </a>
        <a href="/">전체보기</a>
        {categories}
      </div>
      <span style={{ fontSize: '45px', cursor: 'pointer' }} onClick={openNav}>
        &#9776;
      </span>
    </div>
  );
};
export default SideMenu;
