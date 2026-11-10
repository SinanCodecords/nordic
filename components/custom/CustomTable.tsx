"use client";

interface CustomTableProps {
	nothing: string;
}

const CustomTable = (params: CustomTableProps) => {
	console.log(params);

	return <div>CustomTable</div>;
};
export default CustomTable;
