import React, { forwardRef, useState } from "react";
import GorhomBottomSheet, { BottomSheetProps as GorhomBottomSheetProps, BottomSheetFlatList as GorhomBottomSheetFlatList, BottomSheetScrollView as GorhomBottomSheetScrollView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";

import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { BottomSheetFlatListMethods, BottomSheetFlatListProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/types";

interface BottomSheetProps extends GorhomBottomSheetProps {
	children: React.ReactNode;
	index: number;
	snapPoints: (number | string)[];
}

const _internal_BottomSheetFlatList = forwardRef<BottomSheetFlatListMethods, BottomSheetFlatListProps<any>>((props, ref) => {
	return <GorhomBottomSheetFlatList {...props} ref={ref} />;
});

const _internal_BottomSheet = forwardRef<BottomSheetMethods, BottomSheetProps>((props: BottomSheetProps, ref) => {
	const { index, snapPoints, onChange, style, children, ...rest } = props;

	return (
		<GorhomBottomSheet
			index={index}
			snapPoints={snapPoints}
			onChange={onChange}
			enablePanDownToClose={true}
			backdropComponent={BottomSheetBackdrop}
			// style={[{ padding: 20 }, style]}
			style={style || { padding: 20 }}
			{...rest}
			ref={ref}
		>
			{children}
		</GorhomBottomSheet>
	);
});

const BottomSheet = Object.assign(_internal_BottomSheet, {
	BottomSheetFlatList: _internal_BottomSheetFlatList,
});

export default BottomSheet;
