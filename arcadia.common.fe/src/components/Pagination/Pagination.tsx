import React from 'react';
import classNames from 'classnames';
import ReactPaginate, { ReactPaginateProps } from 'react-paginate';
import IconArrowLeft from '../../assets/svg/arrowLeft.svg';
import './styles/Pagination.scss';

// This component is wrapper under https://github.com/AdeleD/react-paginate
// So you can use any props declared in documentation with addition props declared in this wrapper
export interface IPaginationProps extends Partial<ReactPaginateProps> {
}

export const Pagination: React.FC<IPaginationProps> = ({
  containerClassName,
  pageCount = 0,
  pageRangeDisplayed = 3,
  marginPagesDisplayed = 3,
  disableInitialCallback = true,
  ...restProps
}) => {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <ReactPaginate
      containerClassName={classNames('pagination', containerClassName)}
      pageClassName="pagination__page"
      pageLinkClassName="pagination__page-link"
      activeClassName="pagination__page-active"
      previousClassName="pagination__btn-previous"
      nextClassName="pagination__btn-next"
      previousLinkClassName="pagination__btn-previous-link"
      nextLinkClassName="pagination__btn-next-link"
      breakClassName="pagination__break"
      disabledClassName="pagination--disabled"
      previousLabel={<IconArrowLeft className="pagination__arrow" />}
      nextLabel={<IconArrowLeft className="pagination__arrow pagination__arrow--right" />}
      pageCount={Math.ceil(pageCount)}
      pageRangeDisplayed={pageRangeDisplayed}
      marginPagesDisplayed={marginPagesDisplayed}
      disableInitialCallback={disableInitialCallback}
      {...restProps}
    />
  );
};
