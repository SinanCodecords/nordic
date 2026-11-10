"use client";

import { Check, Plus, X } from "lucide-react";
import { memo, type ReactNode, useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps } from "@/types";
import FormFieldWrapper from "./FormFieldWrapper";

interface OptionObject {
	value: string;
	label: string;
	disabled?: boolean;
}

interface CustomSelectProps extends BaseFormFieldProps {
	/**
	 * @property options - An array of options to be displayed in the select dropdown.
	 * Can be either string array or object array with value, label, and optional disabled properties.
	 */
	options: string[] | OptionObject[];
	/**
	 * @property placeholder - The placeholder text to display when no option is selected.
	 */
	placeholder?: string;
	/**
	 * @property value - The controlled value of the selected option.
	 */
	value?: string;
	/**
	 * @property defaultValue - The initial value of the selected option when uncontrolled.
	 */
	defaultValue?: string;
	/**
	 * @property onValueChange - Callback function invoked when the selected option changes.
	 */
	onValueChange?: (value: string) => void;
	/**
	 * @property icon - Optional icon to display in the select trigger.
	 */
	icon?: ReactNode;
	/**
	 * @property creatable - If true, allows users to add new options to the list.
	 */
	creatable?: boolean;
	/**
	 * @property onCreateOption - Callback function invoked when a new option is created.
	 */
	onCreateOption?: (option: OptionObject) => void;
	/**
	 * @property createButtonText - Custom text for the create button (defaults to "Add new item").
	 */
	createButtonText?: string;
	/**
	 * @property createInputPlaceholder - Placeholder for the create input field.
	 */
	createInputPlaceholder?: string;
	/**
	 * @property maxHeight - Maximum height for the dropdown content (defaults to "20rem").
	 */
	maxHeight?: string;
	/**
	 * @property name - Field name, so the selected value is sent with a regular form submit.
	 */
	name?: string;
}

const CustomSelect = ({
	options,
	placeholder,
	icon,
	creatable = false,
	onCreateOption,
	createButtonText = "Add new item",
	createInputPlaceholder = "Enter new option...",
	maxHeight = "20rem",
	...props
}: CustomSelectProps) => {
	// Process options to normalize them to OptionObject format
	const processedOptions = useMemo((): OptionObject[] => {
		return options.map((option) => {
			if (typeof option === "string") {
				return {
					value: option,
					label: option,
				};
			}
			return option;
		});
	}, [options]);

	const [internalOptions, setInternalOptions] = useState<OptionObject[]>(processedOptions);
	const [isCreating, setIsCreating] = useState(false);
	const [newOptionValue, setNewOptionValue] = useState("");

	// Memoized current options (internal + external)
	const currentOptions = useMemo(() => {
		// Use internal options if we have additions, otherwise use processed options
		return internalOptions.length !== processedOptions.length
			? internalOptions
			: processedOptions;
	}, [internalOptions, processedOptions]);

	// Update internal options when external options change (adjusting state during render)
	const [prevOptions, setPrevOptions] = useState(processedOptions);
	if (prevOptions !== processedOptions) {
		setPrevOptions(processedOptions);
		setInternalOptions(processedOptions);
	}

	const handleCreateOption = useCallback(() => {
		if (!newOptionValue.trim()) return;

		const newOption: OptionObject = {
			value: newOptionValue.trim(),
			label: newOptionValue.trim(),
		};

		// Check if option already exists
		const optionExists = currentOptions.some(
			(option) => option.value?.toLowerCase() === newOption.value?.toLowerCase(),
		);

		if (optionExists) {
			// Option already exists, just select it and close creation mode
			props.onValueChange?.(newOption.value);
			setIsCreating(false);
			setNewOptionValue("");
			return;
		}

		// Add to internal options
		const updatedOptions = [...currentOptions, newOption];
		setInternalOptions(updatedOptions);

		// Call external callback if provided
		onCreateOption?.(newOption);

		setTimeout(() => {
			props.onValueChange?.(newOption.value);
		}, 10);

		// Reset creation state
		setIsCreating(false);
		setNewOptionValue("");
	}, [newOptionValue, currentOptions, props.onValueChange, onCreateOption]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter") {
				e.preventDefault();
				handleCreateOption();
			} else if (e.key === "Escape") {
				setIsCreating(false);
				setNewOptionValue("");
			}
		},
		[handleCreateOption],
	);

	const handleCancelCreate = useCallback(() => {
		setIsCreating(false);
		setNewOptionValue("");
	}, []);

	return (
		<FormFieldWrapper {...props}>
			{(id, describedBy) => (
				<Select
					name={props.name}
					value={props.value}
					defaultValue={props.defaultValue}
					onValueChange={props.onValueChange}
					disabled={props.disabled}
				>
					<SelectTrigger
						className={cn(
							props.error && "border-destructive focus:ring-destructive",
							props.className,
						)}
						aria-invalid={!!props.error}
						aria-describedby={describedBy}
						id={id}
					>
						{icon && <span className="mr-1 flex items-center">{icon}</span>}
						<SelectValue placeholder={placeholder} />
					</SelectTrigger>
					<SelectContent>
						<ScrollArea style={{ maxHeight }}>
							{currentOptions.map((option) => (
								<SelectItem
									key={option.value}
									value={option.value}
									disabled={option.disabled}
								>
									{option.label}
								</SelectItem>
							))}

							{creatable &&
								(!isCreating ? (
									<div
										className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
										onClick={() => setIsCreating(true)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												setIsCreating(true);
											}
										}}
									>
										<Plus className="mr-2 h-4 w-4" />
										{createButtonText}
									</div>
								) : (
									<div className="flex items-center gap-1 px-2 py-1.5">
										<Input
											placeholder={createInputPlaceholder}
											value={newOptionValue}
											onChange={(e) => setNewOptionValue(e.target.value)}
											onKeyDown={handleKeyDown}
											autoFocus
											className="h-7 flex-1 text-sm"
										/>
										<Button
											type="button"
											size="sm"
											onClick={handleCreateOption}
											disabled={!newOptionValue.trim()}
											className="h-7 w-7 p-0"
										>
											<Check className="h-3 w-3" />
										</Button>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={handleCancelCreate}
											className="h-7 w-7 p-0"
										>
											<X className="h-3 w-3" />
										</Button>
									</div>
								))}
						</ScrollArea>
					</SelectContent>
				</Select>
			)}
		</FormFieldWrapper>
	);
};

export default memo(CustomSelect);
