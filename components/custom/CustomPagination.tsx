"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
} from "@/components/ui/pagination";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import usePagination from "@/hooks/pagination/usePagination";
import usePaginationState from "@/hooks/pagination/usePaginationState";
import type { CustomPaginationProps } from "@/types";
import TooltipWrapper from "~/TooltipWrapper";

const CustomPagination = ({
	totalPages,
	paginationItemsToDisplay = 5,
	pageSizeOptions = [5, 7, 10, 12, 20, 25, 50],
	showPageInfo = true,
	showPageSizeSelector = true,
	disabled = false,
	className = "",
}: CustomPaginationProps) => {
	const { currentPage, pageSize, handlePageChange, handlePageSizeChange } = usePaginationState();

	const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
		currentPage,
		totalPages,
		paginationItemsToDisplay,
	});

	const handleLinkClick = (page: number) => (e: React.MouseEvent) => {
		e.preventDefault();
		if (!disabled) {
			handlePageChange(page);
		}
	};

	const handlePageSizeSelect = (value: string) => {
		if (!disabled) {
			const newPageSize = Number(value);
			handlePageSizeChange(newPageSize);
		}
	};

	const isPreviousDisabled = disabled || currentPage === 1;
	const isNextDisabled = disabled || currentPage === totalPages;

	return (
		<div
			className={`flex items-center justify-between gap-3 max-sm:flex-col ${disabled ? "pointer-events-none opacity-50" : ""} ${className}`}
		>
			{showPageInfo && (
				<p
					className="flex-1 whitespace-nowrap text-muted-foreground text-sm"
					aria-live="polite"
				>
					Page <span className="text-foreground">{currentPage}</span> of{" "}
					<span className="text-foreground">{totalPages}</span>
				</p>
			)}

			{/* Pagination */}
			<div className={showPageInfo ? "grow" : "flex-1"}>
				<Pagination>
					<PaginationContent>
						{/* Previous page button */}
						<PaginationItem>
							<TooltipWrapper
								content={
									disabled
										? "Pagination disabled"
										: isPreviousDisabled
											? "Already on first page"
											: `Go to page ${currentPage - 1}`
								}
								duration={300}
							>
								<PaginationLink
									className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
									onClick={
										isPreviousDisabled
											? undefined
											: handleLinkClick(currentPage - 1)
									}
									aria-label="Go to previous page"
									aria-disabled={isPreviousDisabled}
									style={{
										cursor: isPreviousDisabled ? "default" : "pointer",
									}}
								>
									<ChevronLeftIcon size={16} aria-hidden="true" />
								</PaginationLink>
							</TooltipWrapper>
						</PaginationItem>

						{/* Left ellipsis (...) */}
						{showLeftEllipsis && (
							<PaginationItem>
								<TooltipWrapper
									content={
										disabled ? "Pagination disabled" : "More pages available"
									}
									duration={300}
								>
									<PaginationEllipsis />
								</TooltipWrapper>
							</PaginationItem>
						)}

						{/* Page number links */}
						{pages.map((page) => (
							<PaginationItem key={page}>
								<TooltipWrapper
									content={
										disabled
											? "Pagination disabled"
											: page === currentPage
												? `Current page: ${page}`
												: `Go to page ${page}`
									}
									duration={300}
								>
									<PaginationLink
										onClick={handleLinkClick(page)}
										isActive={page === currentPage}
										style={{ cursor: disabled ? "default" : "pointer" }}
										aria-disabled={disabled}
									>
										{page}
									</PaginationLink>
								</TooltipWrapper>
							</PaginationItem>
						))}

						{/* Right ellipsis (...) */}
						{showRightEllipsis && (
							<PaginationItem>
								<TooltipWrapper
									content={
										disabled ? "Pagination disabled" : "More pages available"
									}
									duration={300}
								>
									<PaginationEllipsis />
								</TooltipWrapper>
							</PaginationItem>
						)}

						{/* Next page button */}
						<PaginationItem>
							<TooltipWrapper
								content={
									disabled
										? "Pagination disabled"
										: isNextDisabled
											? "Already on last page"
											: `Go to page ${currentPage + 1}`
								}
								duration={300}
							>
								<PaginationLink
									className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
									onClick={
										isNextDisabled
											? undefined
											: handleLinkClick(currentPage + 1)
									}
									aria-label="Go to next page"
									aria-disabled={isNextDisabled}
									style={{
										cursor: isNextDisabled ? "default" : "pointer",
									}}
								>
									<ChevronRightIcon size={16} aria-hidden="true" />
								</PaginationLink>
							</TooltipWrapper>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>

			{/* Results per page */}
			{showPageSizeSelector && (
				<div className="flex flex-1 justify-end">
					<TooltipWrapper
						content={
							disabled ? "Pagination disabled" : "Change number of results per page"
						}
						duration={300}
					>
						<Select
							value={pageSize.toString()}
							onValueChange={handlePageSizeSelect}
							aria-label="Results per page"
							disabled={disabled}
						>
							<SelectTrigger className="w-fit whitespace-nowrap">
								<SelectValue placeholder="Select number of results" />
							</SelectTrigger>
							<SelectContent>
								{pageSizeOptions.map((size) => (
									<SelectItem key={size} value={size.toString()}>
										{size} / page
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</TooltipWrapper>
				</div>
			)}
		</div>
	);
};

export default CustomPagination;
