import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { TooltipWrapperProps } from "@/types";

const TooltipWrapper = ({
	children,
	content,
	onClick,
	duration = 500,
	preventdefault = false,
}: TooltipWrapperProps) => {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={duration}>
				<TooltipTrigger
					asChild
					onClick={(e) => {
						if (preventdefault) e.preventDefault();
						onClick?.();
					}}
				>
					{children}
				</TooltipTrigger>
				<TooltipContent className="px-2 py-1 text-xs">{content}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default TooltipWrapper;
