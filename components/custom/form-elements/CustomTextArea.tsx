import { memo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps } from "@/types";
import FormFieldWrapper from "./FormFieldWrapper";

interface CustomTextAreaProps
	extends BaseFormFieldProps,
		React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	/**
	 * @property resize - If true, allows the textarea to be resized by the user. Defaults to true.
	 */
	resize?: boolean;
}

const CustomTextArea = ({ resize = true, ...props }: CustomTextAreaProps) => {
	// biome-ignore lint/correctness/noUnusedVariables: we are extracting error and showHint use in the text component
	const { error, showHint, ...textAreaProps } = props;
	return (
		<FormFieldWrapper {...props}>
			{(id, describedBy) => (
				<Textarea
					id={id}
					className={cn(
						!resize && "resize-none",
						props.error && "border-destructive",
						props.className,
					)}
					aria-describedby={describedBy}
					aria-invalid={!!props.error}
					{...textAreaProps}
				/>
			)}
		</FormFieldWrapper>
	);
};

export default memo(CustomTextArea);
