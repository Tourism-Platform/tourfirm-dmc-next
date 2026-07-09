/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from "@payload-config";
import "@payloadcms/next/css";
import { RootLayout, handleServerFunctions } from "@payloadcms/next/layouts";
import { Exo_2 } from "next/font/google";
import type { ServerFunctionClient } from "payload";
import React from "react";

import "./admin.css";
import { importMap } from "./admin/importMap.js";
import "./custom.scss";

const exo2 = Exo_2({
	variable: "--font-exo-2",
	subsets: ["latin", "cyrillic"]
});

type TArgs = {
	children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
	"use server";
	return handleServerFunctions({
		...args,
		config,
		importMap
	});
};

const Layout = ({ children }: TArgs) => (
	<RootLayout
		config={config}
		htmlProps={{ className: exo2.variable }}
		importMap={importMap}
		serverFunction={serverFunction}
	>
		{children}
	</RootLayout>
);

export default Layout;
