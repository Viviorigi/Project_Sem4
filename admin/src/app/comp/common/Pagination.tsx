import React from 'react';

const Pagination = (props: any) => {
  const { totalPage, currentPage, handlePageClick, prev, next } = props;
  return (
    <>
      <button className="page-link" data-list-pagination="prev" onClick={prev}>
        <span className="fas fa-chevron-left" />
      </button>
      <ul className="mb-0 pagination mx-2">
        {[...Array(totalPage)].map((_, index) => (
          <li
            key={index}
            className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => handlePageClick(index + 1)}
          >
            <span className="page-link">{index + 1}</span>
          </li>
        ))}
      </ul>
      <button className="page-link pe-0" data-list-pagination="next" onClick={next}>
        <span className="fas fa-chevron-right" />
      </button>
    </>
  );
};

export default Pagination;
