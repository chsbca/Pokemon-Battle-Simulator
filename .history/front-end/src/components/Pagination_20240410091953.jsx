import { useState } from "react";
import Pagination from 'react-bootstrap/Pagination';

const ResponsivePagination = ({ totalItems, itemsPerPage }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const maxPageItems = 5; // Max number of Pagination.Item components to show at once

    let startPage = currentPage - 2 <= 0 ? 1 : currentPage - 2;
    if (startPage + maxPageItems - 1 > totalPages) {
        startPage = totalPages - maxPageItems + 1 <= 0 ? 1 : totalPages - maxPageItems + 1;
    }

    const paginationItems = [];
    for (let number = startPage; number <= Math.min(startPage + maxPageItems - 1, totalPages); number++) {
        paginationItems.push(
            <Pagination.Item key={number} active={number === currentPage} onClick={() => setCurrentPage(number)}>
                {number}
            </Pagination.Item>,
        );
    }

    return (
        <Pagination>
            <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />

            {currentPage > 2 && <Pagination.Ellipsis disabled />}
            {paginationItems}
            {currentPage < totalPages - 1 && <Pagination.Ellipsis disabled />}

            <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
            <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
    );
};

export default ResponsivePagination;
