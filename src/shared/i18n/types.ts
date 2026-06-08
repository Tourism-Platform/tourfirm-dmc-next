export type TTranslateFn = (
	key?: string,
	values?: Record<string, string | number | Date>
) => string;

export type TDotPrefix<T extends string, P extends string> = P extends ""
	? T
	: `${P}.${T}`;

export type TNestedKeyOf<ObjectType extends object> = {
	[Key in keyof ObjectType & string]: ObjectType[Key] extends object
		? TDotPrefix<TNestedKeyOf<ObjectType[Key]>, Key>
		: Key;
}[keyof ObjectType & string];
