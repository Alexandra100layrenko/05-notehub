import ReactPaginate from 'react-paginate';
import styles from './Pagination.module.css';

interface PaginationProps {
  readonly pageCount: number;
  readonly forcePage?: number;
  readonly onPageChange: (selected: number) => void;
}

export default function Pagination({ pageCount, forcePage = 0, onPageChange }: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={pageCount}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      onPageChange={({ selected }) => onPageChange(selected)}
      forcePage={forcePage}
      containerClassName={styles.pagination}
      activeClassName={styles.active}
      nextLabel="→"
      previousLabel="←"
    />
  );
}
