import { memo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps } from "@/types";
import FormFieldWrapper from "./FormFieldWrapper";

interface CustomCheckBoxProps extends BaseFormFieldProps {
	/**
	 * @property defaultChecked - The initial checked state of the checkbox when it is first rendered.
	 */
	defaultChecked?: boolean;
	/**
	 * @property onCheckedChange - Callback function invoked when the checked state of the checkbox changes.
	 */
	onCheckedChange?: (checked: boolean) => void;
	/**
	 * @property checked - The controlled checked state of the checkbox.
	 */
	checked?: boolean;
}

const CustomCheckbox = (props: CustomCheckBoxProps) => (
	<FormFieldWrapper {...props}>
		{(id, describedBy) => (
			<Checkbox
				id={id}
				checked={props.checked}
				defaultChecked={props.defaultChecked}
				onCheckedChange={props.onCheckedChange}
				disabled={props.disabled}
				className={cn(
					props.error &&
						"cursor-pointer border-destructive data-[state=checked]:bg-destructive",
					props.className,
				)}
				aria-invalid={!!props.error}
				aria-describedby={describedBy}
			/>
		)}
	</FormFieldWrapper>
);

export default memo(CustomCheckbox);
