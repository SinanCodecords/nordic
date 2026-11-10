import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { ConfirmationDialogProps } from "@/types";
import CustomInput from "~/form-elements/CustomInput";

const ConfirmationDialog = ({
	isOpen,
	onClose,
	onConfirm,
	title = "Confirm Action",
	description = "Are you sure you want to proceed? This action cannot be undone.",
	confirmText = "Confirm",
	cancelText = "Cancel",
	confirmVariant = "default",
	cancelVariant = "outline",
	loading = false,
	requireReason = false,
	reasonPlaceholder = "Enter reason...",
	reasonLabel = "Reason",
}: ConfirmationDialogProps) => {
	const [reason, setReason] = useState("");

	const handleConfirm = () => {
		if (requireReason) {
			onConfirm(reason);
		} else {
			onConfirm();
		}
		setReason("");
	};

	const handleClose = () => {
		setReason("");
		onClose();
	};

	const isConfirmDisabled = loading || (requireReason && !reason.trim());

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent>
				<DialogHeader>
					<div className="flex items-center gap-3">
						<DialogTitle>{title}</DialogTitle>
					</div>
					<DialogDescription className="pt-2">{description}</DialogDescription>
				</DialogHeader>

				{requireReason && (
					<CustomInput
						label={reasonLabel}
						placeholder={reasonPlaceholder}
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						disabled={loading}
						required
					/>
				)}

				<DialogFooter className="flex-col gap-2 sm:flex-row">
					<Button
						variant={cancelVariant}
						onClick={handleClose}
						disabled={loading}
						className="w-full sm:w-auto"
					>
						{cancelText}
					</Button>
					<Button
						variant={confirmVariant}
						onClick={handleConfirm}
						disabled={isConfirmDisabled}
						className="w-full sm:w-auto"
					>
						{loading ? "Processing..." : confirmText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ConfirmationDialog;
