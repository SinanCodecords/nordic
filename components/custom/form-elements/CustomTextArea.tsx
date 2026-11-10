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
	// Keep wrapper-only props (label, hint, wrapperClass…) off the <textarea> element.
	const {
		error: _error,
		showHint: _showHint,
		label: _label,
		hint: _hint,
		hintclass: _hintclass,
		description: _description,
		wrapperClass: _wrapperClass,
		labelId: _labelId,
		className: _className,
		...textAreaProps
	} = props;
	return (
		<FormFieldWrapper {...props}>
			{(id, describedBy) => (
				<Textarea
					{...textAreaProps}
					id={id}
					className={cn(
						!resize && "resize-none",
						props.error && "border-destructive",
						props.className,
					)}
					aria-describedby={describedBy}
					aria-invalid={!!props.error}
				/>
			)}
		</FormFieldWrapper>
	);
};

export default memo(CustomTextArea);
