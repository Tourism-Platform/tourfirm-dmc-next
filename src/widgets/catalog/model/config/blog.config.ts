export type TBlogPost = {
	id: string;
	date: string;
	title: string;
	href: string;
	imageUrl: string;
	className: string;
};

export const BLOG_POSTS_MOCK: TBlogPost[] = [
	{
		id: "1",
		date: "October 26, 2023",
		title: "Top 5 hidden gems of Samarkand you must visit",
		href: "/company/news",
		imageUrl: "/assets/images/samarkand.jpg",
		className: "bg-accent"
	},
	{
		id: "2",
		date: "October 18, 2023",
		title: "How to plan a perfect Silk Road itinerary",
		href: "/company/news",
		imageUrl: "/assets/images/tours/silk-road.jpg",
		className: "bg-secondary"
	},
	{
		id: "3",
		date: "October 10, 2023",
		title: "Best time to visit Uzbekistan: seasonal guide",
		href: "/company/news",
		imageUrl: "/assets/images/people.jpg",
		className: "bg-muted"
	}
];
