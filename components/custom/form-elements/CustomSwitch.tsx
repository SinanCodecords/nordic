import { memo } from "react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps } from "@/types";
import FormFieldWrapper from "./FormFieldWrapper";

interface CustomSwitchProps extends BaseFormFieldProps {
	/**
	 * @property checked - The controlled checked state of the switch.
	 */
	checked?: boolean;
	/**
	 * @property defaultChecked - The initial checked state of the switch when uncontrolled.
	 */
	defaultChecked?: boolean;
	/**
	 * @property onCheckedChange - Callback function invoked when the checked state of the switch changes.
	 */
	onCheckedChange?: (checked: boolean) => void;
}

const CustomSwitch = (props: CustomSwitchProps) => (
	<FormFieldWrapper {...props}>
		{(id, describedBy) => (
			<div className="flex items-start space-x-3">
				<Switch
					id={id}
					checked={props.checked}
					defaultChecked={props.defaultChecked}
					onCheckedChange={props.onCheckedChange}
					disabled={props.disabled}
					className={cn(
						"cursor-pointer",
						props.error && "data-[state=unchecked]:bg-destructive/20",
						props.className,
					)}
					aria-invalid={!!props.error}
					aria-describedby={describedBy}
				/>
			</div>
		)}
	</FormFieldWrapper>
);

export default memo(CustomSwitch);
