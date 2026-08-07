"use client";

import { type FC } from "react";
import { type UseControllerProps, useController } from "react-hook-form";

import type { TFileMetadata } from "@/shared/hooks";

import {
	CustomUploadFiles,
	type ICustomUploadFilesProps
} from "./custom-upload-files";

interface ICustomUploadFilesFieldProps
	extends
		UseControllerProps<any>,
		Pick<
			ICustomUploadFilesProps,
			| "maxFiles"
			| "showAllRemoveButton"
			| "showTopTitle"
			| "size"
			| "isLoading"
			| "loadingId"
			| "readOnly"
		> {}

export const CustomUploadFilesField: FC<ICustomUploadFilesFieldProps> = ({
	maxFiles,
	isLoading,
	loadingId,
	readOnly,
	size,
	showAllRemoveButton,
	showTopTitle,
	...controllerProps
}) => {
	const {
		field: { onChange, value }
	} = useController(controllerProps);

	return (
		<CustomUploadFiles
			size={size}
			maxFiles={maxFiles}
			initialFiles={value}
			onFilesChange={(files) => {
				const metadata: TFileMetadata[] = files.map((f) => {
					if (f.file instanceof File) {
						return {
							id: f.id,
							name: f.file.name,
							size: f.file.size,
							type: f.file.type,
							url: f.preview || "",
							file: f.file
						};
					}
					return f.file;
				});
				onChange(metadata);
			}}
			onFileRemove={(fileId) => {
				if (Array.isArray(value)) {
					onChange(value.filter((f: any) => f.id !== fileId));
				}
			}}
			isLoading={isLoading}
			loadingId={loadingId}
			readOnly={readOnly}
			showAllRemoveButton={showAllRemoveButton}
			showTopTitle={showTopTitle}
		/>
	);
};
