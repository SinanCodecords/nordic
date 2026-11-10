import { memo } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps } from "@/types";
import FormFieldWrapper from "./FormFieldWrapper";

interface RadioOption {
	/**
	 * @property value - The unique value associated with the radio option.
	 */
	value: string;
	/**
	 * @property label - The display label for the radio option.
	 */
	label: string;
	/**
	 * @property description - An optional description for the radio option.
	 */
	description?: string;
	/**
	 * @property disabled - If true, the radio option will be disabled.
	 */
	disabled?: boolean;
}

interface CustomRadioGroupProps extends BaseFormFieldProps {
	/**
	 * @property options - An array of radio options to be displayed.
	 */
	options: RadioOption[];
	/**
	 * @property value - The controlled value of the selected radio option.
	 */
	value?: string;
	/**
	 * @property defaultValue - The initial value of the selected radio option when uncontrolled.
	 */
	defaultValue?: string;
	/**
	 * @property onValueChange - Callback function invoked when the selected radio option changes.
	 */
	onValueChange?: (value: string) => void;
	/**
	 * @property orientation - The orientation of the radio group. Defaults to "vertical".
	 */
	orientation?: "horizontal" | "vertical";
}

const CustomRadioGroup = ({
	options,
	orientation = "vertical",
	...props
}: CustomRadioGroupProps) => (
	<FormFieldWrapper {...props}>
		{(id, describedBy) => (
			<RadioGroup
				value={props.value}
				defaultValue={props.defaultValue}
				onValueChange={props.onValueChange}
				disabled={props.disabled}
				className={cn(
					"space-y-3",
					orientation === "horizontal" && "flex space-x-6 space-y-0",
					props.className,
				)}
				aria-invalid={!!props.error}
				aria-describedby={describedBy}
			>
				{options.map((option) => (
					<div key={option.value} className="flex items-start space-x-3">
						<RadioGroupItem
							value={option.value}
							id={`${id}-${option.value}`}
							disabled={option.disabled}
							className={cn(
								"mt-3 cursor-pointer",
								props.error && "border-destructive",
							)}
						/>
						<div className="flex-1">
							<label
								htmlFor={`${id}-${option.value}`}
								className={cn(
									"cursor-pointer font-medium text-sm leading-none",
									props.error && "text-destructive",
									(option.disabled || props.disabled) &&
										"cursor-not-allowed opacity-50",
								)}
							>
								{option.label}
							</label>
							{option.description && (
								<p className="text-muted-foreground text-xs">
									{option.description}
								</p>
							)}
						</div>
					</div>
				))}
			</RadioGroup>
		)}
	</FormFieldWrapper>
);

export default memo(CustomRadioGroup);
