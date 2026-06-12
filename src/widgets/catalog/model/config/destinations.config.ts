export type TTopDestination = {
	id: string;
	name: string;
	count: number;
	imageUrl: string;
};

export const TOP_DESTINATIONS_MOCK: TTopDestination[] = [
	{
		id: "1",
		name: "Samarkand",
		count: 181,
		imageUrl: "/assets/images/city/samarkand.jpg"
	},
	{
		id: "2",
		name: "Bukhara",
		count: 124,
		imageUrl: "/assets/images/city/bukhara.jpg"
	},
	{
		id: "3",
		name: "Khiva",
		count: 87,
		imageUrl: "/assets/images/city/khiva.jpg"
	},
	{
		id: "4",
		name: "Tashkent",
		count: 156,
		imageUrl: "/assets/images/city/tashkent.jpg"
	},
	{
		id: "5",
		name: "Fergana",
		count: 64,
		imageUrl: "/assets/images/city/fergana.jpg"
	},
	{
		id: "6",
		name: "Nukus",
		count: 42,
		imageUrl: "/assets/images/city/nukus.jpg"
	}
];
