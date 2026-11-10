type UsePaginationProps = {
	currentPage: number;
	totalPages: number;
	paginationItemsToDisplay: number;
};

const usePagination = ({
	currentPage,
	totalPages,
	paginationItemsToDisplay,
}: UsePaginationProps) => {
	const showLeftEllipsis = currentPage > Math.ceil(paginationItemsToDisplay / 2) + 1;

	const showRightEllipsis = currentPage < totalPages - Math.floor(paginationItemsToDisplay / 2);

	const calculatePaginationRange = () => {
		if (totalPages <= paginationItemsToDisplay) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		const halfDisplay = Math.floor(paginationItemsToDisplay / 2);

		let start = currentPage - halfDisplay;
		let end = currentPage + halfDisplay;

		if (start < 1) {
			start = 1;
			end = paginationItemsToDisplay;
		}

		if (end > totalPages) {
			end = totalPages;
			start = totalPages - paginationItemsToDisplay + 1;
		}

		if (showLeftEllipsis) start += 1;
		if (showRightEllipsis) end -= 1;

		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	};

	const pages = calculatePaginationRange();

	return {
		pages,
		showLeftEllipsis,
		showRightEllipsis,
	};
};

export default usePagination;
