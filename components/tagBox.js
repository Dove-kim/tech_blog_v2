import React, { useCallback, useEffect, useState } from 'react';
import './tagBox.scss';
import axios from 'axios';

const TagItem = React.memo(({ tag, onRemove }) => (
  <div className="tag_item" onClick={() => onRemove(tag)}>
    #{tag}
  </div>
));

const TagList = React.memo(({ tags, onRemove }) => (
  <div className="tag_list">
    {tags.map((tag) => (
      <TagItem key={tag} tag={tag} onRemove={onRemove} />
    ))}
  </div>
));

const SearchPreviewItem = React.memo(({ no, name, onSearchItemClick }) => (
  <div
    className="search_prev_item"
    onClick={onSearchItemClick}
    value={no}
    name={name}
  >
    {name}
  </div>
));

const SearchPreviewList = React.memo(({ items, onSearchItemClick }) => (
  <div className="search_prev_list">
    {items.map((item) => (
      <SearchPreviewItem
        key={item.no}
        no={item.no}
        name={item.name}
        onSearchItemClick={onSearchItemClick}
      />
    ))}
  </div>
));

const TagBox = ({ localTags, setLocalTags }) => {
  const [input, setInput] = useState('');
  const [dataTags, setDataTags] = useState([]);
  const [result, setResult] = useState([]);

  const onSearchItemClick = useCallback(
    (e) => {
      setResult([]);
      setInput(e.target.innerHTML.trim());
    },
    [input],
  );

  const insertTag = useCallback(
    (tag) => {
      if (!tag) return; // 공백이라면 추가하지 않음
      if (localTags.includes(tag)) return; // 이미 존재한다면 추가하지 않음
      const nextTags = [...localTags, tag];
      setLocalTags(nextTags);
    },
    [localTags],
  );

  const onRemove = useCallback(
    (tag) => {
      const nextTags = localTags.filter((t) => t !== tag);
      setLocalTags(nextTags);
    },
    [localTags],
  );

  const matchName = (name, keyword) => {
    var keyLen = keyword.length >= 0 ? keyword.length : 0;
    name = name.toLowerCase().substring(0, keyLen);
    return name == keyword && keyLen != 0;
  };

  const onChange = useCallback(
    (e) => {
      setInput(e.target.value);
      var results = dataTags.filter(
        (item) => true == matchName(item.name, e.target.value),
      );
      setResult(results);
      console.log(localTags);
    },
    [localTags, result],
  );

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      insertTag(input.trim());
      setInput('');
    },
    [input, insertTag],
  );

  useEffect(async () => {
    const data = await axios.get('/api/tag');
    setDataTags(data.data);
  }, []);

  return (
    <div className="tag_box">
      <form className="tag_form" onSubmit={onSubmit}>
        <input
          placeholder="태그를 입력하세요"
          value={input}
          onChange={onChange}
        />

        <button type="submit">추가</button>
      </form>
      <SearchPreviewList items={result} onSearchItemClick={onSearchItemClick} />
      <TagList tags={localTags} onRemove={onRemove} />
    </div>
  );
};

export default TagBox;
