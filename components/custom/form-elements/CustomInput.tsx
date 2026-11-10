import { EyeIcon, EyeOffIcon } from "lucide-react";
import { InputHTMLAttributes, memo, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps } from "@/types";
import FormFieldWrapper from "./FormFieldWrapper";

interface CustomInputProps extends BaseFormFieldProps, InputHTMLAttributes<HTMLInputElement> {}

const CustomInput = ({ type, ...props }: CustomInputProps) => {
	const [showPassword, setShowPassword] = useState(false);

	// biome-ignore lint/correctness/noUnusedVariables: we are extracting error and showHint use in the input component
	const { error, showHint, ...inputProps } = props;
	const isPassword = type === "password";
	const inputType = isPassword && showPassword ? "text" : type;

	return (
		<FormFieldWrapper {...props}>
			{(id, describedBy) => (
				<div className="relative">
					<Input
						id={id}
						type={inputType}
						className={cn(
							props.error && "border-destructive focus-visible:ring-destructive",
							isPassword && "pr-10",
							props.className,
						)}
						aria-describedby={describedBy}
						aria-invalid={!!props.error}
						{...inputProps}
					/>
					{isPassword && (
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="-translate-y-1/2 absolute top-1/2 right-3 cursor-pointer text-muted-foreground hover:text-foreground"
							aria-label={showPassword ? "Hide password" : "Show password"}
						>
							{showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
						</button>
					)}
				</div>
			)}
		</FormFieldWrapper>
	);
};

export default memo(CustomInput);
