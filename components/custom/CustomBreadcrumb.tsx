import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { BreadcrumbItemType, CustomBreadcrumbProps } from "@/types";

const CustomBreadcrumb = ({
	items,
	isLoading = false,
	currentClassName,
	className,
	collapseAt = 6,
	dropdownStartIndex = 1,
	keepVisibleAtEnd = 2,
}: CustomBreadcrumbProps) => {
	if (isLoading) {
		return (
			<Breadcrumb className={cn(className)}>
				<BreadcrumbList>
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="flex items-center">
							<BreadcrumbItem>
								<Skeleton className="h-4 w-16" />
							</BreadcrumbItem>
							{i < 2 && <BreadcrumbSeparator />}
						</div>
					))}
				</BreadcrumbList>
			</Breadcrumb>
		);
	}

	const renderItem = (item: BreadcrumbItemType) =>
		item.isCurrentPage ? (
			<BreadcrumbPage className={currentClassName}>{item.label}</BreadcrumbPage>
		) : (
			<BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
		);

	const renderDropdown = (collapsed: BreadcrumbItemType[]) => (
		<DropdownMenu>
			<DropdownMenuTrigger className="hover:text-foreground">
				<BreadcrumbEllipsis />
				<span className="sr-only">Toggle menu</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				{collapsed.map((ci, idx) => (
					<DropdownMenuItem key={idx} asChild>
						<a href={ci.href}>{ci.label}</a>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);

	/* ---------- Collapse logic ---------- */
	const shouldCollapse =
		items.length >= collapseAt && dropdownStartIndex < items.length - keepVisibleAtEnd;

	let elements: React.ReactNode[] = [];

	if (!shouldCollapse) {
		/* Render everything normally */
		elements = items.map((item, idx) => (
			<div key={idx} className="flex items-center">
				<BreadcrumbItem>{renderItem(item)}</BreadcrumbItem>
				{idx < items.length - 1 && <BreadcrumbSeparator />}
			</div>
		));
	} else {
		/*
      Visible section:   items[0 .. dropdownStartIndex-1]
      Dropdown section:  items[dropdownStartIndex .. items.length - keepVisibleAtEnd - 1]
      End visible:       items[items.length - keepVisibleAtEnd .. items.length - 1]
    */
		const dropdownEndIndex = items.length - keepVisibleAtEnd;
		const collapsed = items.slice(dropdownStartIndex, dropdownEndIndex);
		const endItems = items.slice(dropdownEndIndex);

		// Front items (before dropdown)
		for (let i = 0; i < dropdownStartIndex; i++) {
			elements.push(
				<div key={i} className="flex items-center">
					<BreadcrumbItem>{renderItem(items[i])}</BreadcrumbItem>
					<BreadcrumbSeparator />
				</div>,
			);
		}

		// Dropdown (if there are items to collapse)
		if (collapsed.length > 0) {
			elements.push(
				<div key="dropdown" className="flex items-center">
					<BreadcrumbItem>{renderDropdown(collapsed)}</BreadcrumbItem>
					<BreadcrumbSeparator />
				</div>,
			);
		}

		// End items (including current page)
		endItems.forEach((item, idx) => {
			const isLast = idx === endItems.length - 1;
			elements.push(
				<div key={`end-${idx}`} className="flex items-center">
					<BreadcrumbItem>{renderItem(item)}</BreadcrumbItem>
					{!isLast && <BreadcrumbSeparator />}
				</div>,
			);
		});
	}

	return (
		<Breadcrumb className={cn(className)}>
			<BreadcrumbList>{elements}</BreadcrumbList>
		</Breadcrumb>
	);
};

export default CustomBreadcrumb;
