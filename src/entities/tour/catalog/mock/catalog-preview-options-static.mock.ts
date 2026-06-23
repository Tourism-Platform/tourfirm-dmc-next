/* eslint-disable */
// extracted from legacy tour-packages.generated.ts — do not edit manually
import type {
	ICatalogPreviewOptionDetailBackend,
	ICatalogPreviewOptionListItemBackend,
	TCatalogPreviewPubEvent
} from "../types/catalog-preview-backend.types";
import type { TPubEventMediaFields } from "../types/catalog-preview-option-media.types";

type ICatalogPreviewOptionDetailWithMedia = Omit<
	ICatalogPreviewOptionDetailBackend,
	"events"
> & {
	events: Array<TCatalogPreviewPubEvent & TPubEventMediaFields>;
};

export const CATALOG_PREVIEW_TOUR_OPTIONS_LIST_STATIC: ICatalogPreviewOptionListItemBackend[] =
	[
		{
			id: "051c26c6-6dae-43f7-b2e8-9fcbae0b696a-default",
			name: "Enchanting Uzbekistan: Silk Road Traditions & the Fergana Valley",
			description:
				"Discover the magic of Uzbekistan - where vibrant culture, rich history, and breathtaking architecture come together to create an unforgettable journey. From ancient Silk Road cities to lively local bazaars, every moment is filled with beauty, flavor, and adventure. Experience the heart of Central Asia like never before.",
			cover_image_path: "/assets/images/city/tashkent-2.jpg",
			total_price: {
				val: 0,
				currency: "USD"
			},
			total_price_max: {
				val: 0,
				currency: "USD"
			},
			price_per_person: {
				val: 0,
				currency: "USD"
			},
			price_per_person_max: {
				val: 0,
				currency: "USD"
			}
		}
	];

export const CATALOG_PREVIEW_OPTION_BACKEND_STATIC: ICatalogPreviewOptionDetailWithMedia =
	{
		id: "051c26c6-6dae-43f7-b2e8-9fcbae0b696a-default",
		total_price: {
			val: 0,
			currency: "USD"
		},
		total_price_max: {
			val: 0,
			currency: "USD"
		},
		events: [
			{
				name: "Arrival in Tashkent",
				description:
					"Arrival in Tashkent. The driver will warmly welcome you at the outdoor waiting area of Tashkent International Airport. After your arrival, enjoy a short rest before setting off to discover a city where ancient heritage meets modern elegance. Hotel check-in is available from 2:00 PM.\nRest and overnight",
				day: 1,
				position: 1,
				image_paths: ["/assets/images/city/tashkent.jpg"],
				primary_image_path: "/assets/images/city/tashkent.jpg",
				typ: "7",
				details: {}
			},
			{
				typ: "5",
				name: "Arrival in Tashkent",
				description:
					"Overnight stay in Tashkent. Check-in from 2:00 PM, check-out until 12:00 PM. Comfortable accommodation with breakfast included.",
				day: 1,
				position: 2,
				details: {
					location: {
						lang: "en",
						city: "Tashkent",
						address: "Tashkent",
						lat: 41.2995,
						long: 69.2401
					},
					amenities: ["wifi", "breakfast"],
					duration: 1,
					check_in: {
						time: "14:00:00",
						timezone: 5
					},
					check_out: {
						time: "12:00:00",
						timezone: 5
					}
				},
				image_paths: ["/assets/images/city/tashkent.jpg"],
				primary_image_path: "/assets/images/city/tashkent.jpg"
			},
			{
				name: "Tashkent - Andijan by train; Andijan - Fergana by car",
				description:
					"Meet the driver at the hotel entrance.\nTransfer to the railway station.",
				day: 2,
				position: 1,
				image_paths: ["/assets/images/city/tashkent.jpg"],
				primary_image_path: "/assets/images/city/tashkent.jpg",
				typ: "7",
				details: {}
			},
			{
				name: "Tashkent - Andijan by train; Andijan - Fergana by car",
				description:
					"This morning, board a comfortable train to Andijan and travel through spectacular mountain landscapes into the fertile and colorful Fergana Valley, one of Uzbekistan’s most authentic and culturally rich regions.",
				day: 2,
				position: 2,
				image_paths: ["/assets/images/city/tashkent.jpg"],
				primary_image_path: "/assets/images/city/tashkent.jpg",
				typ: "7",
				details: {}
			},
			{
				name: "Tashkent - Andijan by train; Andijan - Fergana by car",
				description:
					"Lunch at a local national restaurant (not included).",
				day: 2,
				position: 3,
				image_paths: ["/assets/images/city/fergana.jpg"],
				primary_image_path: "/assets/images/city/fergana.jpg",
				typ: "7",
				details: {}
			},
			{
				name: "Tashkent - Andijan by train; Andijan - Fergana by car",
				description:
					"Explore Andijan:\nVisit to Jami Mosque.Walk through Babur Park and visit the monument of Babur, the founder of the Mughal Empire.Visit to Andijan Bazaar to experience local life and traditions.",
				day: 2,
				position: 4,
				image_paths: ["/assets/images/city/fergana.jpg"],
				primary_image_path: "/assets/images/city/fergana.jpg",
				typ: "7",
				details: {}
			},
			{
				name: "Tashkent - Andijan by train; Andijan - Fergana by car",
				description:
					"Transfer to Fergana. Rest and overnight in the hotel.",
				day: 2,
				position: 5,
				image_paths: ["/assets/images/city/fergana.jpg"],
				primary_image_path: "/assets/images/city/fergana.jpg",
				typ: "7",
				details: {}
			},
			{
				typ: "5",
				name: "Tashkent - Andijan by train; Andijan - Fergana by car",
				description:
					"Overnight stay in Fergana. Check-in from 2:00 PM, check-out until 12:00 PM. Comfortable accommodation with breakfast included.",
				day: 2,
				position: 6,
				details: {
					location: {
						lang: "en",
						city: "Fergana",
						address: "Fergana",
						lat: 40.3864,
						long: 71.7864
					},
					amenities: ["wifi", "breakfast"],
					duration: 1,
					check_in: {
						time: "14:00:00",
						timezone: 5
					},
					check_out: {
						time: "12:00:00",
						timezone: 5
					}
				},
				image_paths: ["/assets/images/city/fergana.jpg"],
				primary_image_path: "/assets/images/city/fergana.jpg"
			},
			{
				name: "Fergana - Margilan - Rishtan - Kokand - Tashkent",
				description:
					"Meet the guide and proceed to explore Fergana Valley.",
				day: 3,
				position: 1,
				image_paths: ["/assets/images/city/fergana.jpg"],
				primary_image_path: "/assets/images/city/fergana.jpg",
				typ: "7",
				details: {}
			},
			{
				name: "Fergana - Margilan - Rishtan - Kokand - Tashkent",
				description:
					"Upon arrival in Margilan, the historical heart of Uzbekistan’s silk production, discover the fascinating world of traditional silk-making at the famous Margilan Silk Factory. Watch skilled artisans transform delicate silk threads into beautifully handwoven ikat fabrics using centuries-old techniques of spinning, dyeing, and weaving.Continue exploring the city with:A visit to the historic Said Ahmad Khoja MadrasahFree time at the lively local bazaar, filled with colors, spices, textiles, and traditional crafts. Immerse yourself in the warm atmosphere of the Fergana Valley and experience everyday local life.Visit the workshop of a famous local ceramic master in Rishtan, where you will witness the entire creative process — from shaping the clay to painting intricate traditional patterns by hand. Continue to Kokand, the former capital of the powerful Kokand Khanate and one of the great Silk Road cities.Highlights of Kokand include:-The magnificent Palace of Khudayar Khan-The historic Juma Mosque-The elegant Mausoleum of Modari Khan.",
				day: 3,
				position: 2,
				image_paths: ["/assets/images/city/tashkent.jpg"],
				primary_image_path: "/assets/images/city/tashkent.jpg",
				typ: "7",
				details: {}
			},
			{
				name: "Fergana - Margilan - Rishtan - Kokand - Tashkent",
				description:
					"In the evening, return to Tashkent via the breathtaking Kamchik Mountain Pass, offering spectacular panoramic views of the surrounding mountains and valleys\nArrival in Tashkent, accommodation and rest.",
				day: 3,
				position: 3,
				image_paths: ["/assets/images/city/tashkent.jpg"],
				primary_image_path: "/assets/images/city/tashkent.jpg",
				typ: "7",
				details: {}
			},
			{
				typ: "5",
				name: "Fergana - Margilan - Rishtan - Kokand - Tashkent",
				description:
					"Overnight stay in Tashkent. Check-in from 2:00 PM, check-out until 12:00 PM. Comfortable accommodation with breakfast included.",
				day: 3,
				position: 4,
				details: {
					location: {
						lang: "en",
						city: "Tashkent",
						address: "Tashkent",
						lat: 41.2995,
						long: 69.2401
					},
					amenities: ["wifi", "breakfast"],
					duration: 1,
					check_in: {
						time: "14:00:00",
						timezone: 5
					},
					check_out: {
						time: "12:00:00",
						timezone: 5
					}
				},
				image_paths: ["/assets/images/city/tashkent.jpg"],
				primary_image_path: "/assets/images/city/tashkent.jpg"
			},
			{
				name: "Tashkent (full day)",
				description:
					"Exploring the magnificent Khast Imam Complex, one of the city’s most important spiritual and historical landmarks\nExperiencing the lively atmosphere of Chorsu Bazaar, a colorful market filled with local flavors, spices, and traditional crafts",
				day: 4,
				position: 1,
				image_paths: ["/assets/images/city/tashkent.jpg"],
				primary_image_path: "/assets/images/city/tashkent.jpg",
				typ: "7",
				details: {}
			},
			{
				name: "Tashkent (full day)",
				description: "Lunch time (not included)",
				day: 4,
				position: 2,
				image_paths: ["/assets/images/city/tashkent.jpg"],
				primary_image_path: "/assets/images/city/tashkent.jpg",
				typ: "7",
				details: {}
			},
			{
				name: "Tashkent (full day)",
				description:
					"Riding the iconic Tashkent Metro, famous for its beautifully designed stations, including Kosmonavtlar, Alisher Navoi, Paxtakor, and Mustaqillik Maydoni\nEnjoying a relaxing walk through Sayilgoh Street, the lively heart of the city, where you will admire landmarks such as Amir Temur Square, the State Museum of the Temurids, the first hotel in Uzbekistan, and the Palace of Congresses from the outside.",
				day: 4,
				position: 3,
				image_paths: ["/assets/images/city/tashkent.jpg"],
				primary_image_path: "/assets/images/city/tashkent.jpg",
				typ: "7",
				details: {}
			},
			{
				name: "Tashkent (full day)",
				description: "Return to the hotel. Rest and overnight",
				day: 4,
				position: 4,
				image_paths: ["/assets/images/city/tashkent.jpg"],
				primary_image_path: "/assets/images/city/tashkent.jpg",
				typ: "7",
				details: {}
			},
			{
				typ: "5",
				name: "Tashkent (full day)",
				description:
					"Overnight stay in Tashkent. Check-in from 2:00 PM, check-out until 12:00 PM. Comfortable accommodation with breakfast included.",
				day: 4,
				position: 5,
				details: {
					location: {
						lang: "en",
						city: "Tashkent",
						address: "Tashkent",
						lat: 41.2995,
						long: 69.2401
					},
					amenities: ["wifi", "breakfast"],
					duration: 1,
					check_in: {
						time: "14:00:00",
						timezone: 5
					},
					check_out: {
						time: "12:00:00",
						timezone: 5
					}
				},
				image_paths: ["/assets/images/city/tashkent.jpg"],
				primary_image_path: "/assets/images/city/tashkent.jpg"
			},
			{
				name: "Tashkent - Samarkand by high-speed train",
				description:
					"Meet the driver at the hotel entrance.\nTransfer to the railway station.",
				day: 5,
				position: 1,
				image_paths: ["/assets/images/city/samarkand.jpg"],
				primary_image_path: "/assets/images/city/samarkand.jpg",
				typ: "7",
				details: {}
			},
			{
				name: "Tashkent - Samarkand by high-speed train",
				description:
					"Transfer to Samarkand by a high-speed train.\n* please note that the departure time is not guaranteed and can be changed",
				day: 5,
				position: 2,
				image_paths: ["/assets/images/city/samarkand.jpg"],
				primary_image_path: "/assets/images/city/samarkand.jpg",
				typ: "7",
				details: {}
			},
			{
				name: "Tashkent - Samarkand by high-speed train",
				description:
					"Visiting the magnificent Gur-e-Amir Mausoleum (14th–15th centuries), the final resting place of the great Amir Temur (Tamerlane). Built during the Timurid era, this architectural masterpiece continues to captivate visitors from around the world with its elegance, grandeur, and stunning blue dome.\nExploring the world-famous Registan Square (15th–17th centuries), the true heart of ancient Samarkand, surrounded by the majestic Ulugbek, Tillakori, and Sherdor madrasahs — some of the finest examples of Islamic architecture in the world.",
				day: 5,
				position: 3,
				image_paths: ["/assets/images/city/samarkand.jpg"],
				primary_image_path: "/assets/images/city/samarkand.jpg",
				typ: "7",
				details: {}
			},
			{
				name: "Tashkent - Samarkand by high-speed train",
				description: "Lunch time (not included)",
				day: 5,
				position: 4,
				image_paths: ["/assets/images/city/samarkand.jpg"],
				primary_image_path: "/assets/images/city/samarkand.jpg",
				typ: "7",
				details: {}
			},
			{
				name: "Tashkent - Samarkand by high-speed train",
				description:
					"Discovering the mystical beauty of the Shah-i-Zinda Necropolis, a sacred complex of beautifully decorated mausoleums known for its dazzling mosaics and spiritual significance.\nAdmiring the impressive Bibi-Khanym Mosque (14th–15th centuries), once one of the grandest mosques in the Islamic world and a symbol of Amir Temur’s powerful empire.\nEnjoying free time at Siyob Bazaar, the city’s most famous local market, where you can experience authentic Uzbek culture, taste traditional sweets and fresh fruits, and shop for unique souvenirs and spices.",
				day: 5,
				position: 5,
				image_paths: ["/assets/images/city/samarkand.jpg"],
				primary_image_path: "/assets/images/city/samarkand.jpg",
				typ: "7",
				details: {}
			},
			{
				name: "Tashkent - Samarkand by high-speed train",
				description: "Return to the hotel. Rest and overnight",
				day: 5,
				position: 6,
				image_paths: ["/assets/images/city/samarkand.jpg"],
				primary_image_path: "/assets/images/city/samarkand.jpg",
				typ: "7",
				details: {}
			},
			{
				typ: "5",
				name: "Tashkent - Samarkand by high-speed train",
				description:
					"Overnight stay in Samarkand. Check-in from 2:00 PM, check-out until 12:00 PM. Comfortable accommodation with breakfast included.",
				day: 5,
				position: 7,
				details: {
					location: {
						lang: "en",
						city: "Samarkand",
						address: "Samarkand",
						lat: 39.6542,
						long: 66.9597
					},
					amenities: ["wifi", "breakfast"],
					duration: 1,
					check_in: {
						time: "14:00:00",
						timezone: 5
					},
					check_out: {
						time: "12:00:00",
						timezone: 5
					}
				},
				image_paths: ["/assets/images/city/samarkand.jpg"],
				primary_image_path: "/assets/images/city/samarkand.jpg"
			},
			{
				name: "Samarkand (full day)",
				description: "Meet the guide and proceed to explore Samarkand.",
				day: 6,
				position: 1,
				image_paths: ["/assets/images/city/samarkand.jpg"],
				primary_image_path: "/assets/images/city/samarkand.jpg",
				typ: "7",
				details: {}
			},
			{
				name: "Samarkand (full day)",
				description:
					"Explore the peaceful Imam al-Bukhari Memorial Complex, dedicated to the world-famous Islamic scholar Imam al-Bukhari, one of the most respected figures in Islamic history. This spiritual and beautifully designed complex is an important pilgrimage site and a place of reflection and cultural heritage.",
				day: 6,
				position: 2,
				image_paths: ["/assets/images/city/samarkand.jpg"],
				primary_image_path: "/assets/images/city/samarkand.jpg",
				typ: "7",
				details: {}
			},
			{
				name: "Samarkand (full day)",
				description: "Lunch time (not included)",
				day: 6,
				position: 3,
				image_paths: ["/assets/images/city/samarkand.jpg"],
				primary_image_path: "/assets/images/city/samarkand.jpg",
				typ: "7",
				details: {}
			},
			{
				name: "Samarkand (full day)",
				description:
					"Experience the artistry of traditional craftsmanship at the Meros Paper Mill, where ancient paper-making techniques have been preserved for generations. Watch skilled artisans transform mulberry bark into exquisite handmade paper using methods dating back to the Silk Road period, and discover one of Samarkand’s most unique cultural traditions.\nVVVisit the remarkable Ulugh Beg Observatory (15th century), one of the greatest astronomical observatories of the medieval world. Built by the renowned Timurid ruler and astronomer Ulugh Beg, this fascinating site offers a glimpse into the advanced scientific achievements of the Silk Road era. Discover the ancient instruments and innovative techniques once used to map the stars and explore the mysteries of the universe centuries ahead of their time.",
				day: 6,
				position: 4,
				image_paths: ["/assets/images/city/samarkand.jpg"],
				primary_image_path: "/assets/images/city/samarkand.jpg",
				typ: "7",
				details: {}
			},
			{
				name: "Samarkand (full day)",
				description: "Return to the hotel. Rest and overnight",
				day: 6,
				position: 5,
				image_paths: ["/assets/images/city/samarkand.jpg"],
				primary_image_path: "/assets/images/city/samarkand.jpg",
				typ: "7",
				details: {}
			},
			{
				typ: "5",
				name: "Samarkand (full day)",
				description:
					"Overnight stay in Samarkand. Check-in from 2:00 PM, check-out until 12:00 PM. Comfortable accommodation with breakfast included.",
				day: 6,
				position: 6,
				details: {
					location: {
						lang: "en",
						city: "Samarkand",
						address: "Samarkand",
						lat: 39.6542,
						long: 66.9597
					},
					amenities: ["wifi", "breakfast"],
					duration: 1,
					check_in: {
						time: "14:00:00",
						timezone: 5
					},
					check_out: {
						time: "12:00:00",
						timezone: 5
					}
				},
				image_paths: ["/assets/images/city/samarkand.jpg"],
				primary_image_path: "/assets/images/city/samarkand.jpg"
			},
			{
				name: "Samarkand - Bukhara by car",
				description:
					"Today, enjoy a scenic journey through the beautiful landscapes of Uzbekistan as we travel from Samarkand to the historic city of Bukhara, one of the most important cultural gems of the Silk Road. The journey covers approximately 450 km and takes around 5 hours. Upon arrival, check-in at the hotel and rest.",
				day: 7,
				position: 1,
				image_paths: ["/assets/images/city/bukhara.jpg"],
				primary_image_path: "/assets/images/city/bukhara.jpg",
				typ: "7",
				details: {}
			},
			{
				name: "Samarkand - Bukhara by car",
				description: "Lunch time (not included)",
				day: 7,
				position: 2,
				image_paths: ["/assets/images/city/bukhara.jpg"],
				primary_image_path: "/assets/images/city/bukhara.jpg",
				typ: "7",
				details: {}
			},
			{
				name: "Samarkand - Bukhara by car",
				description:
					"Discover the charming Lyabi-Hauz Complex, one of the most atmospheric corners of Bukhara, surrounded by historic madrasahs, traditional teahouses, and a peaceful pond at the heart of the old city.\nExplore the ancient Covered Oriental Markets (16th–17th centuries), where the spirit of the Silk Road still lives on through colorful handicrafts, local souvenirs, spices, textiles, and traditional artisan workshops.",
				day: 7,
				position: 3,
				image_paths: ["/assets/images/city/bukhara.jpg"],
				primary_image_path: "/assets/images/city/bukhara.jpg",
				typ: "7",
				details: {}
			},
			{
				name: "Samarkand - Bukhara by car",
				description: "Return to the hotel. Rest and overnight",
				day: 7,
				position: 4,
				image_paths: ["/assets/images/city/bukhara.jpg"],
				primary_image_path: "/assets/images/city/bukhara.jpg",
				typ: "7",
				details: {}
			},
			{
				typ: "5",
				name: "Samarkand - Bukhara by car",
				description:
					"Overnight stay in Bukhara. Check-in from 2:00 PM, check-out until 12:00 PM. Comfortable accommodation with breakfast included.",
				day: 7,
				position: 5,
				details: {
					location: {
						lang: "en",
						city: "Bukhara",
						address: "Bukhara",
						lat: 39.7681,
						long: 64.4556
					},
					amenities: ["wifi", "breakfast"],
					duration: 1,
					check_in: {
						time: "14:00:00",
						timezone: 5
					},
					check_out: {
						time: "12:00:00",
						timezone: 5
					}
				},
				image_paths: ["/assets/images/city/bukhara.jpg"],
				primary_image_path: "/assets/images/city/bukhara.jpg"
			},
			{
				name: "Bukhara (full day)",
				description:
					"This morning, continue discovering the timeless beauty of Bukhara with visits to some of its most iconic historical treasures:\nIsmail Samani Mausoleum (9th–10th centuries) — one of the oldest and finest masterpieces of Islamic architecture in Central Asia.\nChashma-Ayub Mausoleum (12th–16th centuries) — a sacred site linked to fascinating legends and ancient traditions.\nBolo Haouz Mosque (18th–20th centuries) — admired for its elegant wooden columns and beautiful architecture.\nUlugh Beg Madrasa (15th century) — one of the oldest madrasahs in Central Asia, built by the famous astronomer and ruler Ulugh Beg, reflecting the region’s rich educational and cultural heritage.",
				day: 8,
				position: 1,
				image_paths: ["/assets/images/city/bukhara.jpg"],
				primary_image_path: "/assets/images/city/bukhara.jpg",
				typ: "7",
				details: {}
			},
			{
				name: "Bukhara (full day)",
				description: "Lunch time (not included)",
				day: 8,
				position: 2,
				image_paths: ["/assets/images/city/bukhara.jpg"],
				primary_image_path: "/assets/images/city/bukhara.jpg",
				typ: "7",
				details: {}
			},
			{
				name: "Bukhara (full day)",
				description:
					"Ark of Bukhara (5th–20th centuries) — the majestic ancient fortress that once served as the residence of Bukhara’s rulers for centuries.",
				day: 8,
				position: 3,
				image_paths: ["/assets/images/city/bukhara.jpg"],
				primary_image_path: "/assets/images/city/bukhara.jpg",
				typ: "7",
				details: {}
			},
			{
				name: "Bukhara (full day)",
				description: "Return to the hotel. Rest and overnight",
				day: 8,
				position: 4,
				image_paths: ["/assets/images/city/bukhara.jpg"],
				primary_image_path: "/assets/images/city/bukhara.jpg",
				typ: "7",
				details: {}
			},
			{
				typ: "5",
				name: "Bukhara (full day)",
				description:
					"Overnight stay in Bukhara. Check-in from 2:00 PM, check-out until 12:00 PM. Comfortable accommodation with breakfast included.",
				day: 8,
				position: 5,
				details: {
					location: {
						lang: "en",
						city: "Bukhara",
						address: "Bukhara",
						lat: 39.7681,
						long: 64.4556
					},
					amenities: ["wifi", "breakfast"],
					duration: 1,
					check_in: {
						time: "14:00:00",
						timezone: 5
					},
					check_out: {
						time: "12:00:00",
						timezone: 5
					}
				},
				image_paths: ["/assets/images/city/bukhara.jpg"],
				primary_image_path: "/assets/images/city/bukhara.jpg"
			},
			{
				name: "Bukhara - Khiva by car",
				description:
					"Today, we travel through the scenic landscapes of Uzbekistan to the legendary city of Khiva. Known for its perfectly preserved old town, Itchan Kala — a UNESCO World Heritage Site — Khiva feels like an open-air museum of the Silk Road.\nThe journey from Bukhara covers about 450 km (around 6 hours), with a memorable lunch stop in the desert along the way.\nUpon arrival, we check into the hotel and enjoy a well-deserved rest after the journey,",
				day: 9,
				position: 1,
				image_paths: ["/assets/images/city/khiva.jpg"],
				primary_image_path: "/assets/images/city/khiva.jpg",
				typ: "7",
				details: {}
			},
			{
				typ: "5",
				name: "Bukhara - Khiva by car",
				description:
					"Overnight stay in Khiva. Check-in from 2:00 PM, check-out until 12:00 PM. Comfortable accommodation with breakfast included.",
				day: 9,
				position: 2,
				details: {
					location: {
						lang: "en",
						city: "Khiva",
						address: "Khiva",
						lat: 41.3783,
						long: 60.3639
					},
					amenities: ["wifi", "breakfast"],
					duration: 1,
					check_in: {
						time: "14:00:00",
						timezone: 5
					},
					check_out: {
						time: "12:00:00",
						timezone: 5
					}
				},
				image_paths: ["/assets/images/city/khiva.jpg"],
				primary_image_path: "/assets/images/city/khiva.jpg"
			},
			{
				name: "Khiva (full day)",
				description:
					"Meet the guide at the hotel and proceed to explore Khiva.",
				day: 10,
				position: 1,
				image_paths: ["/assets/images/city/khiva.jpg"],
				primary_image_path: "/assets/images/city/khiva.jpg",
				typ: "7",
				details: {}
			},
			{
				name: "Khiva (full day)",
				description:
					"Sightseeing in Khiva includes:\nMuhammad Amin Khan Madrasa and the iconic Kalta Minor Minaret — one of the city’s most recognizable landmarks with its striking turquoise facade.\nKunya-Ark Fortress — the ancient citadel that once served as the residence of Khiva’s rulers, offering stunning views over the old city.\nMuhammad Rahim Khan Madrasa — a beautiful 19th-century educational center reflecting Khiva’s cultural and scholarly heritage.\nJuma Mosque (Khiva) — a unique wooden-column mosque known for its peaceful atmosphere and remarkable architectural design.\nTash Khovli Palace and the Khan’s Harem — a beautifully decorated royal residence showcasing traditional Khorezm architecture. (Approx. visit time: 40–50 minutes)\nOllaquli Khan Caravanserai — a historic trading hub that once welcomed Silk Road merchants. (Approx. visit time: 20–30 minutes)\nIslam Khodja Complex — including the elegant madrasah and the tallest minaret in Khiva, offering stunning views of the old city. (Approx. visit time: 40–60 minutes)\nPahlavon Mahmud Mausoleum — a sacred and beautifully tiled complex dedicated to the city’s patron saint. (Approx. visit time: 30–40 minutes)\nLocal Bazaar — a vibrant market where you can experience authentic Khivan life, shop for souvenirs, and enjoy local crafts. (Approx. visit time: 30–45 minutes)",
				day: 10,
				position: 2,
				image_paths: ["/assets/images/city/khiva.jpg"],
				primary_image_path: "/assets/images/city/khiva.jpg",
				typ: "7",
				details: {}
			},
			{
				name: "Khiva (full day)",
				description: "Free afternoon.",
				day: 10,
				position: 3,
				image_paths: ["/assets/images/city/khiva.jpg"],
				primary_image_path: "/assets/images/city/khiva.jpg",
				typ: "7",
				details: {}
			},
			{
				typ: "5",
				name: "Khiva (full day)",
				description:
					"Overnight stay in Khiva. Check-in from 2:00 PM, check-out until 12:00 PM. Comfortable accommodation with breakfast included.",
				day: 10,
				position: 4,
				details: {
					location: {
						lang: "en",
						city: "Khiva",
						address: "Khiva",
						lat: 41.3783,
						long: 60.3639
					},
					amenities: ["wifi", "breakfast"],
					duration: 1,
					check_in: {
						time: "14:00:00",
						timezone: 5
					},
					check_out: {
						time: "12:00:00",
						timezone: 5
					}
				},
				image_paths: ["/assets/images/city/khiva.jpg"],
				primary_image_path: "/assets/images/city/khiva.jpg"
			},
			{
				name: "Khiva - Urgench, departure",
				description:
					"Transfer to the Urgench airport 3 hours before your departure time.\nEnd of the tour services.",
				day: 11,
				position: 1,
				image_paths: ["/assets/images/city/khiva.jpg"],
				primary_image_path: "/assets/images/city/khiva.jpg",
				typ: "7",
				details: {}
			}
		]
	};
