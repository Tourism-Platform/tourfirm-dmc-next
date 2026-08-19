/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** VehicleBodyType */
export enum VehicleBodyType {
	Sedan = "sedan",
	Minivan = "minivan",
	Minibus = "minibus",
	MinibusPlus = "minibus_plus",
	Bus = "bus",
	Suv = "suv",
	Coach = "coach"
}

/** UserRoles */
export enum UserRoles {
	Admin = "admin",
	OperatorAdmin = "operator_admin",
	OperatorSalesManager = "operator_sales_manager",
	OperatorAccountant = "operator_accountant",
	AgencyAdmin = "agency_admin",
	AgencySalesManager = "agency_sales_manager",
	AgencyAccountant = "agency_accountant",
	AuthenticatedUser = "authenticated_user"
}

/** TranslationState */
export enum TranslationState {
	Source = "source",
	Ready = "ready",
	Pending = "pending"
}

/** TransferTypes */
export enum TransferTypes {
	CityTour = "city_tour",
	CityTransfer = "city_transfer",
	IntercityTransfer = "intercity_transfer",
	AirportTransfer = "airport_transfer",
	StationTransfer = "station_transfer",
	Custom = "custom"
}

/** TourType */
export enum TourType {
	Regular = "regular",
	Custom = "custom"
}

/** TourStatus */
export enum TourStatus {
	Draft = "draft",
	Published = "published",
	Archived = "archived"
}

/** TourListSortField */
export enum TourListSortField {
	Title = "title",
	Status = "status",
	GroupSize = "group_size",
	CreatedAt = "created_at"
}

/** TourCategory */
export enum TourCategory {
	CulturalHistorical = "cultural_historical",
	ReligiousSpiritual = "religious_spiritual",
	Archaeological = "archaeological",
	AdventureOutdoor = "adventure_outdoor",
	EcoNature = "eco_nature",
	HikingTrekking = "hiking_trekking",
	CityTour = "city_tour",
	GastronomyCulinary = "gastronomy_culinary",
	PhotographyCreative = "photography_creative",
	Educational = "educational",
	MasterClassWorkshop = "master_class_workshop",
	WellnessSpa = "wellness_spa",
	YogaMeditation = "yoga_meditation",
	BusinessMice = "business_mice",
	FamilyKids = "family_kids",
	MultiDestination = "multi_destination"
}

/** TourCatalogSort */
export enum TourCatalogSort {
	PriceAsc = "price_asc",
	PriceDesc = "price_desc",
	DurationAsc = "duration_asc",
	DurationDesc = "duration_desc"
}

/** SupplierType */
export enum SupplierType {
	Flight = "flight",
	Transfer = "transfer",
	Hotel = "hotel",
	Museum = "museum",
	Activity = "activity"
}

/** SupplierPaymentStatus */
export enum SupplierPaymentStatus {
	Paid = "paid",
	NotPaid = "not_paid"
}

/** SuggestKind */
export enum SuggestKind {
	City = "city",
	Place = "place",
	Country = "country"
}

/** StaffStatus */
export enum StaffStatus {
	Pending = "pending",
	Active = "active",
	Inactive = "inactive"
}

/** RebuildState */
export enum RebuildState {
	Started = "started",
	AlreadyRunning = "already_running"
}

/** PickupType */
export enum PickupType {
	AirportPickup = "airport_pickup",
	HotelPickup = "hotel_pickup"
}

/** PaymentMethod */
export enum PaymentMethod {
	Bank = "bank",
	Wire = "wire",
	Check = "check",
	Cash = "cash",
	Other = "other",
	CreditCard = "credit_card"
}

/**
 * LedgerSource
 * Which rail produced the entry. Bank, card and SWIFT rails append their
 * own members here; the posting contract does not change.
 */
export enum LedgerSource {
	Invoice = "invoice",
	ClientPayment = "client_payment",
	InvoicePayment = "invoice_payment",
	SupplierPayment = "supplier_payment",
	Manual = "manual"
}

/**
 * LedgerParty
 * One end of an entry. ``OPERATOR`` is a party like any other, not an
 * implied centre — that is what lets a future entry record an agency paying a
 * supplier directly, with the operator's books merely observing it.
 */
export enum LedgerParty {
	User = "user",
	Agency = "agency",
	Supplier = "supplier",
	Operator = "operator"
}

/**
 * LedgerFlow
 * Derived read lens, never stored: which way an entry moves relative to the
 * operator's own books. ``INBOUND`` is ``payee_typ = OPERATOR``. Entries where
 * the operator is neither end have no flow.
 */
export enum LedgerFlow {
	Inbound = "inbound",
	Outbound = "outbound"
}

/**
 * LedgerEntryType
 * ``ACCRUAL`` is what was agreed and is now owed; ``SETTLEMENT`` is cash
 * that actually moved. Debt is the difference between the two.
 *
 * There is exactly one accrual per source row and it is restated in place as
 * the operator edits the agreed figure. Settlements accumulate — an invoice
 * paid in three instalments posts three of them.
 */
export enum LedgerEntryType {
	Accrual = "accrual",
	Settlement = "settlement"
}

/** LanguageCode */
export enum LanguageCode {
	En = "en",
	Ru = "ru",
	Uz = "uz",
	It = "it",
	De = "de",
	Es = "es",
	Pt = "pt",
	Kk = "kk",
	Ky = "ky",
	Tg = "tg",
	Tk = "tk",
	Zh = "zh",
	Ja = "ja",
	Ar = "ar",
	Tr = "tr",
	Hi = "hi",
	Jp = "jp",
	Ch = "ch",
	Fr = "fr",
	Ko = "ko",
	ZhHans = "zh-Hans"
}

/** InvoiceType */
export enum InvoiceType {
	OperatorToAgency = "operator_to_agency",
	SupplierToOperator = "supplier_to_operator"
}

/** InvoiceStatus */
export enum InvoiceStatus {
	Draft = "draft",
	Sent = "sent",
	Partial = "partial",
	Paid = "paid",
	Overdue = "overdue",
	Cancelled = "cancelled"
}

/** HousingRoomTypes */
export enum HousingRoomTypes {
	Single = "single",
	Double = "double",
	Twin = "twin",
	Triple = "triple",
	Quadruple = "quadruple",
	Suite = "suite",
	Family = "family"
}

/** GuideType */
export enum GuideType {
	Local = "local",
	Route = "route"
}

/** Gender */
export enum Gender {
	M = "M",
	F = "F"
}

/**
 * ExpenseType
 * Enumeration for different types of commissions.
 */
export enum ExpenseType {
	Fixed = "fixed",
	PerPerson = "per_person",
	PerGroup = "per_group",
	PerCar = "per_car",
	PerCarCategory = "per_car_category",
	PerRoom = "per_room",
	PerRoomCategory = "per_room_category"
}

/** EventTypes */
export enum EventTypes {
	Flight = "flight",
	Train = "train",
	Bus = "bus",
	Transfer = "transfer",
	Housing = "housing",
	Activity = "activity",
	Ref = "ref",
	Guide = "guide",
	Supplementary = "supplementary",
	Options = "options"
}

/** EditOp */
export enum EditOp {
	Create = "create",
	Update = "update",
	Delete = "delete"
}

/** Currency */
export enum Currency {
	UZS = "UZS",
	USD = "USD",
	EUR = "EUR",
	RUB = "RUB",
	GBP = "GBP"
}

/** ClientPaymentStatus */
export enum ClientPaymentStatus {
	NotConfirmed = "not_confirmed",
	Confirmed = "confirmed"
}

/** BookingTransition */
export enum BookingTransition {
	Submit = "submit",
	MoveToPending = "move-to-pending",
	MoveToConfirmed = "move-to-confirmed",
	MoveToInProgress = "move-to-in-progress",
	MoveToCompleted = "move-to-completed"
}

/** BookingStatusLabel */
export enum BookingStatusLabel {
	Draft = "Draft",
	New = "New",
	InProcessing = "In processing",
	Booked = "Booked",
	InProgress = "In progress",
	Complete = "Complete",
	Cancelled = "Cancelled",
	Declined = "Declined"
}

/** BookingStatus */
export enum BookingStatus {
	Draft = "draft",
	New = "new",
	Pending = "pending",
	Confirmed = "confirmed",
	InProgress = "in_progress",
	Completed = "completed",
	Cancelled = "cancelled",
	Declined = "declined"
}

/** BookingClientType */
export enum BookingClientType {
	Agency = "agency",
	Tourist = "tourist"
}

/** AvailabilityStatus */
export enum AvailabilityStatus {
	Pending = "pending",
	Available = "available",
	Unavailable = "unavailable",
	Selected = "selected",
	Deselected = "deselected"
}

/** ApplyAvailabilityInput */
export enum ApplyAvailabilityInput {
	Available = "available",
	Unavailable = "unavailable",
	Selected = "selected",
	Deselected = "deselected"
}

/** AmenitiesTypes */
export enum AmenitiesTypes {
	Wifi = "wifi",
	Pool = "pool",
	Breakfast = "breakfast",
	Parking = "parking",
	Gym = "gym",
	Spa = "spa",
	Restaurant = "restaurant",
	Bar = "bar",
	AirportShuttle = "airport_shuttle",
	AirConditioning = "air_conditioning",
	RoomService = "room_service",
	Laundry = "laundry",
	Concierge = "concierge",
	BusinessCenter = "business_center",
	KidsClub = "kids_club",
	BeachAccess = "beach_access",
	Sauna = "sauna",
	Jacuzzi = "jacuzzi",
	PetFriendly = "pet_friendly",
	WheelchairAccessible = "wheelchair_accessible"
}

/** ActivityType */
export enum ActivityType {
	Food = "food",
	MasterClass = "master_class",
	Sightseeing = "sightseeing",
	Outdoor = "outdoor",
	Riding = "riding",
	Extreme = "extreme",
	Wellness = "wellness",
	Entertainment = "entertainment",
	WaterActivities = "water_activities",
	Photography = "photography",
	Spiritual = "spiritual"
}

/** AccountType */
export enum AccountType {
	TourOperator = "tour_operator",
	TourAgency = "tour_agency"
}

/** AccountTypeRead */
export interface AccountTypeRead {
	account_type: AccountType;
}

/** ActivityDetailsPubSchema */
export interface ActivityDetailsPubSchemaInput {
	typ?: ActivityType | null;
	/** Location */
	location?: LocationOutSchema | LocationRefSchema | LocationInSchema | null;
	start_time?: TimeSchema | null;
	end_time?: TimeSchema | null;
	expenses?: ChargePubSchema | null;
}

/** ActivityDetailsPubSchema */
export interface ActivityDetailsPubSchemaOutput {
	typ?: ActivityType | null;
	/** Location */
	location?: LocationOutSchema | LocationRefSchema | LocationInSchema | null;
	start_time?: TimeSchema | null;
	end_time?: TimeSchema | null;
	expenses?: ChargePubSchema | null;
}

/** ActivityDetailsSchema */
export interface ActivityDetailsSchemaInput {
	/** Sub-type of an activity */
	typ?: ActivityType | null;
	/**
	 * Location
	 * Event location
	 */
	location?: LocationOutSchema | LocationRefSchema | LocationInSchema | null;
	/** Event start time */
	start_time?: TimeSchema | null;
	/** Event start time */
	end_time?: TimeSchema | null;
	/**
	 * Expenses
	 * The charge calculation strategy.
	 */
	expenses?:
		| (
				| ({
						typ: "fixed";
				  } & FixedChargeInput)
				| ({
						typ: "per_person";
				  } & PerPersonChargeInput)
		  )
		| null;
}

/** ActivityDetailsSchema */
export interface ActivityDetailsSchemaOutput {
	/** Sub-type of an activity */
	typ?: ActivityType | null;
	/**
	 * Location
	 * Event location
	 */
	location?: LocationOutSchema | LocationRefSchema | LocationInSchema | null;
	/** Event start time */
	start_time?: TimeSchema | null;
	/** Event start time */
	end_time?: TimeSchema | null;
	/**
	 * Expenses
	 * The charge calculation strategy.
	 */
	expenses?:
		| (
				| ({
						typ: "fixed";
				  } & FixedChargeOutput)
				| ({
						typ: "per_person";
				  } & PerPersonChargeOutput)
		  )
		| null;
}

/** ActivityEvent */
export interface ActivityEventInput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "activity"
	 */
	typ?: "activity";
	details?: ActivityDetailsSchemaInput | null;
}

/** ActivityEvent */
export interface ActivityEventOutput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "activity"
	 */
	typ?: "activity";
	details?: ActivityDetailsSchemaOutput | null;
}

/** ActivityEventPubRead */
export interface ActivityEventPubReadInput {
	/** Name */
	name?: string | null;
	/** Description */
	description?: string | null;
	/** Day */
	day?: number | null;
	/** Position */
	position?: number | null;
	/** Is Optional */
	is_optional?: boolean | null;
	/** Images */
	images?: EventImagePubSchema[];
	/**
	 * Date
	 * Calendar date this event falls on, computed as the booking's departure date plus ``day - 1``. Null in the catalogue, where a template tour has no departure date to anchor against.
	 */
	date?: string | null;
	/**
	 * Typ
	 * @default "activity"
	 */
	typ?: "activity";
	details?: ActivityDetailsPubSchemaInput | null;
}

/** ActivityEventPubRead */
export interface ActivityEventPubReadOutput {
	/** Name */
	name?: string | null;
	/** Description */
	description?: string | null;
	/** Day */
	day?: number | null;
	/** Position */
	position?: number | null;
	/** Is Optional */
	is_optional?: boolean | null;
	/** Images */
	images?: EventImagePubSchema[];
	/**
	 * Date
	 * Calendar date this event falls on, computed as the booking's departure date plus ``day - 1``. Null in the catalogue, where a template tour has no departure date to anchor against.
	 */
	date?: string | null;
	/**
	 * Typ
	 * @default "activity"
	 */
	typ?: "activity";
	details?: ActivityDetailsPubSchemaOutput | null;
}

/** ActivityEventTypeRead */
export interface ActivityEventTypeReadInput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "activity"
	 */
	typ?: "activity";
	details?: ActivityDetailsSchemaInput | null;
	/**
	 * Id
	 * Option (alternative) id; populated on read, ignored on write.
	 */
	id?: string | null;
}

/** ActivityEventTypeRead */
export interface ActivityEventTypeReadOutput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "activity"
	 */
	typ?: "activity";
	details?: ActivityDetailsSchemaOutput | null;
	/**
	 * Id
	 * Option (alternative) id; populated on read, ignored on write.
	 */
	id?: string | null;
}

/** ActivitySingleEvent */
export interface ActivitySingleEventInput {
	/**
	 * Day
	 * Event's day number in a tour
	 */
	day: number;
	/**
	 * Position
	 * Event's order number in a tour
	 * @min 0
	 */
	position: number;
	/**
	 * Is Optional
	 * @default false
	 */
	is_optional?: boolean;
	/**
	 * Images
	 * Images of the event slot, primary first; populated on read, ignored on write.
	 */
	images?: EventImageSchema[];
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "activity"
	 */
	typ?: "activity";
	details?: ActivityDetailsSchemaInput | null;
}

/** ActivitySingleEvent */
export interface ActivitySingleEventOutput {
	/**
	 * Day
	 * Event's day number in a tour
	 */
	day: number;
	/**
	 * Position
	 * Event's order number in a tour
	 * @min 0
	 */
	position: number;
	/**
	 * Is Optional
	 * @default false
	 */
	is_optional?: boolean;
	/**
	 * Images
	 * Images of the event slot, primary first; populated on read, ignored on write.
	 */
	images?: EventImageSchema[];
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "activity"
	 */
	typ?: "activity";
	details?: ActivityDetailsSchemaOutput | null;
}

/** AdminUserView */
export interface AdminUserView {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Email */
	email: string;
	/** Role */
	role: string;
	/** Picture */
	picture?: string | null;
	/** Operator Id */
	operator_id?: string | null;
	/** Agency Id */
	agency_id?: string | null;
}

/** AgencyDiscountUpdate */
export interface AgencyDiscountUpdate {
	/**
	 * Discount
	 * The markup calculation strategy.
	 */
	discount:
		| ({
				typ: "fixed";
		  } & FixedExpenseInput)
		| ({
				typ: "percentage";
		  } & PercentageMarkup);
}

/** AgencyFilesModel */
export interface AgencyFilesModel {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/**
	 * Agency Id
	 * @format uuid
	 */
	agency_id: string;
	/** Url */
	url: string;
	/** File Name */
	file_name: string;
}

/** AgencyInfoModel */
export interface AgencyInfoModel {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/**
	 * Agency Id
	 * @format uuid
	 */
	agency_id: string;
	/** Logo Path */
	logo_path: string | null;
	/** Description */
	description: string | null;
	/** Business Name */
	business_name: string | null;
	/** Website Url */
	website_url: string | null;
	/** Legal Name */
	legal_name: string | null;
	/** Director Name */
	director_name: string | null;
	/** Tax Id */
	tax_id: string | null;
	/** Contact Person */
	contact_person: string | null;
	/** Contact Position */
	contact_position: string | null;
	/** Contact Email */
	contact_email: string | null;
	/** Contact Phone */
	contact_phone: string | null;
	/** Address Line */
	address_line: string | null;
	/** City */
	city: string | null;
	/** Country */
	country: string | null;
}

/** AgencyInfoUpdate */
export interface AgencyInfoUpdate {
	/** Description */
	description?: string | null;
	/** Business Name */
	business_name?: string | null;
	/** Website Url */
	website_url?: string | null;
	/** Legal Name */
	legal_name?: string | null;
	/** Director Name */
	director_name?: string | null;
	/** Tax Id */
	tax_id?: string | null;
	/** Contact Person */
	contact_person?: string | null;
	/** Contact Position */
	contact_position?: string | null;
	/** Contact Email */
	contact_email?: string | null;
	/** Contact Phone */
	contact_phone?: string | null;
	/** Address Line */
	address_line?: string | null;
	/** City */
	city?: string | null;
	/** Country */
	country?: string | null;
}

/**
 * AgencyInvite
 * One-time creation of an agency owner on the agency's behalf. Only the
 * email is required — the account activates on first Google SSO or, when a
 * password is set, email + password sign-in.
 *
 * Check:
 * - GET /operator/agencies/partnered — where the invitee shows up
 * - PATCH /operator/agencies/{agency_id}/discount — per-partner pricing
 */
export interface AgencyInvite {
	/**
	 * Email
	 * @format email
	 * @maxLength 255
	 */
	email: string;
	/** Password */
	password?: string | null;
	/** Name */
	name?: string | null;
	info?: AgencyInfoUpdate | null;
}

/** AgencyListItem */
export interface AgencyListItem {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Name */
	name: string;
	/** Business Name */
	business_name?: string | null;
	/** Legal Name */
	legal_name?: string | null;
	/** Contact Person */
	contact_person?: string | null;
	/** Contact Email */
	contact_email?: string | null;
	/** Contact Phone */
	contact_phone?: string | null;
	/** Tax Id */
	tax_id?: string | null;
	/** City */
	city?: string | null;
	/** Country */
	country?: string | null;
	/** Website Url */
	website_url?: string | null;
	/** Logo Url */
	logo_url?: string | null;
}

/** AgencyListResponse */
export interface AgencyListResponse {
	/** Total Count */
	total_count: number;
	/** Data */
	data: AgencyListItem[];
}

/** AgencyModel */
export interface AgencyModel {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Name */
	name: string;
}

/** AuthUserIn */
export interface AuthUserIn {
	/**
	 * Email
	 * @format email
	 */
	email: string;
	/**
	 * Password
	 * @minLength 6
	 * @maxLength 128
	 */
	password: string;
}

/** AuthUserProfileModel */
export interface AuthUserProfileModel {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/**
	 * User Id
	 * @format uuid
	 */
	user_id: string;
	/** First Name */
	first_name: string | null;
	/** Last Name */
	last_name: string | null;
	/** Title */
	title: string | null;
	/** Phone Number */
	phone_number: string | null;
	/** Location */
	location: string | null;
	/** Profile Picture Path */
	profile_picture_path: string | null;
	default_currency: Currency;
}

/** AvailabilityApply */
export interface AvailabilityApply {
	status: ApplyAvailabilityInput;
}

/** BaseUser */
export interface BaseUser {
	/**
	 * Email
	 * @format email
	 */
	email: string;
}

/** Body_add_agency_documents_agency_me_documents_post */
export interface BodyAddAgencyDocumentsAgencyMeDocumentsPost {
	/** Files */
	files: File[];
}

/** Body_add_agency_logo_agency_me_logo_post */
export interface BodyAddAgencyLogoAgencyMeLogoPost {
	/**
	 * File
	 * @format binary
	 */
	file: File;
}

/** Body_add_attachment_booking_payment__payment_id__attachment_post */
export interface BodyAddAttachmentBookingPaymentPaymentIdAttachmentPost {
	/**
	 * File
	 * @format binary
	 */
	file: File;
}

/** Body_add_files_operator_me_files_post */
export interface BodyAddFilesOperatorMeFilesPost {
	/** Files */
	files: File[];
}

/** Body_add_logo_operator_me_logo_post */
export interface BodyAddLogoOperatorMeLogoPost {
	/**
	 * File
	 * @format binary
	 */
	file: File;
}

/** Body_add_logo_supplier__supplier_id__logo_post */
export interface BodyAddLogoSupplierSupplierIdLogoPost {
	/**
	 * File
	 * @format binary
	 */
	file: File;
}

/** Body_create_payment_booking_payment_post */
export interface BodyCreatePaymentBookingPaymentPost {
	/**
	 * Booking Id
	 * @format uuid
	 */
	booking_id: string;
	/**
	 * Amount Uzs
	 * @exclusiveMin 0
	 */
	amount_uzs: number;
	/**
	 * File
	 * @format binary
	 */
	file: File;
	/** @default "USD" */
	currency?: Currency;
	/** Exchange Rate */
	exchange_rate?: number | null;
	/** Note */
	note?: string | null;
}

/** Body_upload_avatar_profile_me_photo_post */
export interface BodyUploadAvatarProfileMePhotoPost {
	/**
	 * File
	 * @format binary
	 */
	file: File;
}

/** Body_upload_event_images_tour__tour_id__event__event_id__images_post */
export interface BodyUploadEventImagesTourTourIdEventEventIdImagesPost {
	/** Images */
	images: File[];
}

/** Body_upload_invoice_pdf_invoice__invoice_id__pdf_post */
export interface BodyUploadInvoicePdfInvoiceInvoiceIdPdfPost {
	/**
	 * File
	 * @format binary
	 */
	file: File;
}

/** Body_upload_landing_images_tour__tour_id__landing_images_post */
export interface BodyUploadLandingImagesTourTourIdLandingImagesPost {
	/** Images */
	images: File[];
}

/** Body_upload_library_images_tour_event_library__library_id__images_post */
export interface BodyUploadLibraryImagesTourEventLibraryLibraryIdImagesPost {
	/** Images */
	images: File[];
}

/** Body_upload_option_cover_tour__tour_id__option__option_id__cover_post */
export interface BodyUploadOptionCoverTourTourIdOptionOptionIdCoverPost {
	/**
	 * Image
	 * @format binary
	 */
	image: File;
}

/** Body_upload_passenger_passport_booking_order__booking_id__pax__pax_id__passport_post */
export interface BodyUploadPassengerPassportBookingOrderBookingIdPaxPaxIdPassportPost {
	/**
	 * File
	 * @format binary
	 */
	file: File;
}

/** Body_upload_receipt_operator_supplier_payment__payment_id__receipt_post */
export interface BodyUploadReceiptOperatorSupplierPaymentPaymentIdReceiptPost {
	/**
	 * File
	 * @format binary
	 */
	file: File;
}

/** Body_upload_tour_cover_tour__tour_id__cover_post */
export interface BodyUploadTourCoverTourTourIdCoverPost {
	/**
	 * Image
	 * @format binary
	 */
	image: File;
}

/** Body_upload_voucher_booking_voucher__booking_id__post */
export interface BodyUploadVoucherBookingVoucherBookingIdPost {
	/**
	 * File
	 * @format binary
	 */
	file: File;
}

/** BookingCancel */
export interface BookingCancel {
	/** Reason */
	reason?: string | null;
}

/** BookingCreate */
export interface BookingCreate {
	/**
	 * Tour Option Id
	 * @format uuid
	 */
	tour_option_id: string;
	/**
	 * Date
	 * @format date
	 */
	date: string;
	/**
	 * Pax
	 * @exclusiveMin 0
	 */
	pax: number;
	/** Comment */
	comment?: string | null;
	/** @default "en" */
	lang?: LanguageCode;
}

/** BookingEventAvailabilityResponse */
export interface BookingEventAvailabilityResponse {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/**
	 * Booking Id
	 * @format uuid
	 */
	booking_id: string;
	/**
	 * Event Id
	 * @format uuid
	 */
	event_id: string;
	/** Option Index */
	option_index: number;
	status: AvailabilityStatus;
	/** Event Name */
	event_name: string | null;
	event_typ: EventTypes | null;
}

/**
 * BookingFilesPresent
 * Which documents this order already has, without exposing storage keys —
 * the board only needs to show a paperclip and whether it is complete.
 */
export interface BookingFilesPresent {
	/** Voucher */
	voucher: boolean;
	/** Invoice Pdf */
	invoice_pdf: boolean;
	/** Supplier Receipts */
	supplier_receipts: number;
	/** Client Payment Proofs */
	client_payment_proofs: number;
}

/**
 * BookingFinancialsResponse
 * Full two-sided position on one order, every figure in the operator's base
 * currency so the money-in and money-out halves are directly comparable.
 *
 * Planned figures are what the frozen snapshot prices out. Accrued figures are
 * what has actually been billed and taken on — the issued invoice on the
 * revenue side, the seeded supplier payments on the cost side. Settled figures
 * are cash that moved. The three tiers answer three different questions and
 * are deliberately not collapsed:
 *
 * - ``receivable`` = revenue accrued but not yet received (this order's debtor
 *   position); ``payable`` = cost accrued but not yet paid out (creditor).
 * - ``accrual_profit`` is the margin already locked in contractually;
 *   ``settled_profit`` is cash actually in hand. They converge as an order
 *   completes, and a persistent gap is exactly what needs chasing.
 *
 * ``planned`` figures carry the min/max spread from optional events and
 * category alternatives; the realised tiers are single values.
 */
export interface BookingFinancialsResponse {
	/**
	 * Booking Id
	 * @format uuid
	 */
	booking_id: string;
	/** Order Number */
	order_number: string;
	currency: Currency;
	/**
	 * Planned Revenue
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	planned_revenue: string;
	/**
	 * Planned Cost
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	planned_cost: string;
	/**
	 * Planned Profit
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	planned_profit: string;
	/**
	 * Revenue Accrued
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	revenue_accrued: string;
	/**
	 * Revenue Settled
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	revenue_settled: string;
	/**
	 * Receivable
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	receivable: string;
	/**
	 * Cost Accrued
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	cost_accrued: string;
	/**
	 * Cost Settled
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	cost_settled: string;
	/**
	 * Payable
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	payable: string;
	/**
	 * Accrual Profit
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	accrual_profit: string;
	/**
	 * Settled Profit
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	settled_profit: string;
}

/** BookingItineraryResponse */
export interface BookingItineraryResponse {
	/**
	 * Booking Id
	 * @format uuid
	 */
	booking_id: string;
	/** Order Number */
	order_number: string;
	display_lang: LanguageCode;
	/** Events */
	events: (
		| (
				| ({
						typ: "activity";
				  } & ActivityEventPubReadOutput)
				| ({
						typ: "bus";
				  } & BusEventPubReadOutput)
				| ({
						typ: "flight";
				  } & FlightEventPubReadOutput)
				| ({
						typ: "housing";
				  } & HousingEventPubReadOutput)
				| ({
						typ: "ref";
				  } & InformationEventPubReadOutput)
				| ({
						typ: "train";
				  } & TrainEventPubReadOutput)
				| ({
						typ: "transfer";
				  } & TransferEventPubReadOutput)
		  )
		| MultiEventPubOutput
	)[];
}

/**
 * BookingOrderClientDetail
 * Agency/tourist-facing order detail: instead of echoing the caller's own
 * identity it carries the ``operator`` contact block — who to reach about
 * this booking. ``discount`` is the partner discount frozen into the booking
 * snapshot at creation.
 */
export interface BookingOrderClientDetail {
	order: BookingOrderResponse;
	tour: OrderTourInfo;
	/**
	 * Who to contact about this booking — the operator running the tour. Joined
	 * into the listing rather than fetched per row so an agency or tourist can reach
	 * the right person without a follow-up call per booking. Every field but ``id``
	 * and ``name`` lives on ``operator_info``, which an operator may not have filled
	 * in yet.
	 */
	operator: OrderOperatorInfo;
	/**
	 * Discount
	 * The markup calculation strategy.
	 */
	discount?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseOutput)
				| ({
						typ: "percentage";
				  } & PercentageMarkup)
		  )
		| null;
}

/**
 * BookingOrderDetail
 * Operator-facing order detail: who placed the booking — exactly one of
 * ``agency`` / ``user`` is set, mirroring the booking's owner column.
 */
export interface BookingOrderDetail {
	order: BookingOrderResponse;
	tour: OrderTourInfo;
	agency?: OrderAgencyInfo | null;
	user?: OrderUserInfo | null;
}

/** BookingOrderListResponse */
export interface BookingOrderListResponse {
	/** Total Count */
	total_count: number;
	/** Data */
	data: BookingOrderRow[];
}

/** BookingOrderResponse */
export interface BookingOrderResponse {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Agency Id */
	agency_id?: string | null;
	/** User Id */
	user_id?: string | null;
	/**
	 * Operator Id
	 * @format uuid
	 */
	operator_id: string;
	/**
	 * Tour Option Id
	 * @format uuid
	 */
	tour_option_id: string;
	/** Snapshot Id */
	snapshot_id?: string | null;
	/**
	 * Date
	 * @format date
	 */
	date: string;
	/**
	 * End Date
	 * @format date
	 */
	end_date: string;
	/** Pax */
	pax: number;
	status: BookingStatus;
	/**
	 * Paid Amount
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	paid_amount: string;
	paid_currency: Currency;
	/**
	 * Tour Amount
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	tour_amount: string;
	tour_currency: Currency;
	/** Fx Rate Id */
	fx_rate_id?: string | null;
	/** Fx Rate Applied */
	fx_rate_applied?: string | null;
	/** Agreed Price */
	agreed_price?: string | null;
	/** Cancelled At */
	cancelled_at?: string | null;
	/** Cancellation Reason */
	cancellation_reason?: string | null;
	/** Comment */
	comment?: string | null;
	/** Voucher Path */
	voucher_path?: string | null;
	/** Order Number */
	order_number: string;
}

/** BookingOrderRow */
export interface BookingOrderRow {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/**
	 * Order Number
	 * @default ""
	 */
	order_number?: string;
	/** Client Name */
	client_name: string;
	client_type: BookingClientType;
	/** Tour Name */
	tour_name: string | null;
	tour_type: TourType;
	status: BookingStatus;
	/**
	 * Date
	 * @format date
	 */
	date: string;
	/**
	 * End Date
	 * @format date
	 */
	end_date: string;
	/**
	 * Created At
	 * @format date-time
	 */
	created_at: string;
	/** Pax */
	pax: number;
	/**
	 * Who to contact about this booking — the operator running the tour. Joined
	 * into the listing rather than fetched per row so an agency or tourist can reach
	 * the right person without a follow-up call per booking. Every field but ``id``
	 * and ``name`` lives on ``operator_info``, which an operator may not have filled
	 * in yet.
	 */
	operator: OrderOperatorInfo;
}

/** BookingPaxFilesModel */
export interface BookingPaxFilesModel {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/**
	 * Booking Pax Id
	 * @format uuid
	 */
	booking_pax_id: string;
	/** Url */
	url: string;
	/** File Name */
	file_name: string;
}

/** BookingPaxModel */
export interface BookingPaxModel {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/**
	 * Booking Id
	 * @format uuid
	 */
	booking_id: string;
	/** Full Name */
	full_name: string;
	gender: Gender;
	/** Nationality */
	nationality: string;
	/**
	 * Date Of Birth
	 * @format date
	 */
	date_of_birth: string;
	/** Passport Number */
	passport_number: string;
	/**
	 * Expired Date
	 * @format date
	 */
	expired_date: string;
	/** Comment */
	comment: string | null;
}

/** BookingReconciliationListResponse */
export interface BookingReconciliationListResponse {
	/** Total Count */
	total_count: number;
	currency: Currency;
	/**
	 * Grand totals across the *whole filtered set*, not just the page.
	 *
	 * Only ledger-derived figures appear here. Planned totals are deliberately
	 * absent: they require re-pricing every matching snapshot, and a number that
	 * silently covered only the current page would be worse than no number.
	 */
	totals: ReconciliationTotalsOutput;
	/** Data */
	data: BookingReconciliationRowOutput[];
}

/**
 * BookingReconciliationRow
 * One order on the reconciliation board, every figure in the operator's
 * base currency.
 *
 * ``planned_*`` is re-priced from the frozen snapshot, so an order that has
 * not been invoiced yet still shows what it is worth. ``*_accrued`` is what
 * has actually been billed and committed, ``*_settled`` is cash that moved,
 * and the two debt figures are the gap between them.
 *
 * ``variance`` is ``planned_cost - cost_accrued``: positive means the order is
 * running under its planned supplier budget, negative that it has overrun.
 */
export interface BookingReconciliationRowInput {
	/**
	 * Booking Id
	 * @format uuid
	 */
	booking_id: string;
	/** Order Number */
	order_number: string;
	status: BookingStatus;
	status_label: BookingStatusLabel;
	/**
	 * Date
	 * @format date
	 */
	date: string;
	/**
	 * End Date
	 * @format date
	 */
	end_date: string;
	/**
	 * Created At
	 * @format date-time
	 */
	created_at: string;
	/** Pax */
	pax: number;
	/** Tour Name */
	tour_name: string | null;
	tour_type: TourType;
	/** Client Name */
	client_name: string;
	client_type: BookingClientType;
	currency: Currency;
	/** Planned Revenue */
	planned_revenue: number | string;
	/** Planned Cost */
	planned_cost: number | string;
	/** Planned Profit */
	planned_profit: number | string;
	/** Revenue Accrued */
	revenue_accrued: number | string;
	/** Revenue Settled */
	revenue_settled: number | string;
	/** Receivable */
	receivable: number | string;
	/** Cost Accrued */
	cost_accrued: number | string;
	/** Cost Settled */
	cost_settled: number | string;
	/** Payable */
	payable: number | string;
	/** Accrual Profit */
	accrual_profit: number | string;
	/** Settled Profit */
	settled_profit: number | string;
	/** Variance */
	variance: number | string;
	/** Invoice Id */
	invoice_id: string | null;
	/** Invoice Number */
	invoice_number: string | null;
	/**
	 * Which documents this order already has, without exposing storage keys —
	 * the board only needs to show a paperclip and whether it is complete.
	 */
	files: BookingFilesPresent;
	/**
	 * Counts behind the payable figure, so a row explains itself: how many
	 * event lines exist, how many are settled, and how many are still filed under
	 * no supplier at all.
	 */
	supplier_lines: SupplierLineTally;
	client_payments: ClientPaymentTally;
}

/**
 * BookingReconciliationRow
 * One order on the reconciliation board, every figure in the operator's
 * base currency.
 *
 * ``planned_*`` is re-priced from the frozen snapshot, so an order that has
 * not been invoiced yet still shows what it is worth. ``*_accrued`` is what
 * has actually been billed and committed, ``*_settled`` is cash that moved,
 * and the two debt figures are the gap between them.
 *
 * ``variance`` is ``planned_cost - cost_accrued``: positive means the order is
 * running under its planned supplier budget, negative that it has overrun.
 */
export interface BookingReconciliationRowOutput {
	/**
	 * Booking Id
	 * @format uuid
	 */
	booking_id: string;
	/** Order Number */
	order_number: string;
	status: BookingStatus;
	status_label: BookingStatusLabel;
	/**
	 * Date
	 * @format date
	 */
	date: string;
	/**
	 * End Date
	 * @format date
	 */
	end_date: string;
	/**
	 * Created At
	 * @format date-time
	 */
	created_at: string;
	/** Pax */
	pax: number;
	/** Tour Name */
	tour_name: string | null;
	tour_type: TourType;
	/** Client Name */
	client_name: string;
	client_type: BookingClientType;
	currency: Currency;
	/**
	 * Planned Revenue
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	planned_revenue: string;
	/**
	 * Planned Cost
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	planned_cost: string;
	/**
	 * Planned Profit
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	planned_profit: string;
	/**
	 * Revenue Accrued
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	revenue_accrued: string;
	/**
	 * Revenue Settled
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	revenue_settled: string;
	/**
	 * Receivable
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	receivable: string;
	/**
	 * Cost Accrued
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	cost_accrued: string;
	/**
	 * Cost Settled
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	cost_settled: string;
	/**
	 * Payable
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	payable: string;
	/**
	 * Accrual Profit
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	accrual_profit: string;
	/**
	 * Settled Profit
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	settled_profit: string;
	/**
	 * Variance
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	variance: string;
	/** Invoice Id */
	invoice_id: string | null;
	/** Invoice Number */
	invoice_number: string | null;
	/**
	 * Which documents this order already has, without exposing storage keys —
	 * the board only needs to show a paperclip and whether it is complete.
	 */
	files: BookingFilesPresent;
	/**
	 * Counts behind the payable figure, so a row explains itself: how many
	 * event lines exist, how many are settled, and how many are still filed under
	 * no supplier at all.
	 */
	supplier_lines: SupplierLineTally;
	client_payments: ClientPaymentTally;
}

/** BookingUpdate */
export interface BookingUpdate {
	/** Date */
	date?: string | null;
	/** Pax */
	pax?: number | null;
	/** Comment */
	comment?: string | null;
}

/** BusDetailPubSchema */
export interface BusDetailPubSchemaInput {
	/** Hop */
	hop?: BusHopPubSchemaInput[] | null;
	expenses?: ChargePubSchema | null;
}

/** BusDetailPubSchema */
export interface BusDetailPubSchemaOutput {
	/** Hop */
	hop?: BusHopPubSchemaOutput[] | null;
	expenses?: ChargePubSchema | null;
}

/** BusDetailSchema */
export interface BusDetailSchemaInput {
	/** Hop */
	hop?: BusHopSchemaInput[] | null;
	/**
	 * Expenses
	 * The charge calculation strategy.
	 */
	expenses?:
		| (
				| ({
						typ: "fixed";
				  } & FixedChargeInput)
				| ({
						typ: "per_person";
				  } & PerPersonChargeInput)
		  )
		| null;
}

/** BusDetailSchema */
export interface BusDetailSchemaOutput {
	/** Hop */
	hop?: BusHopSchemaOutput[] | null;
	/**
	 * Expenses
	 * The charge calculation strategy.
	 */
	expenses?:
		| (
				| ({
						typ: "fixed";
				  } & FixedChargeOutput)
				| ({
						typ: "per_person";
				  } & PerPersonChargeOutput)
		  )
		| null;
}

/** BusEvent */
export interface BusEventInput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "bus"
	 */
	typ?: "bus";
	details?: BusDetailSchemaInput | null;
}

/** BusEvent */
export interface BusEventOutput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "bus"
	 */
	typ?: "bus";
	details?: BusDetailSchemaOutput | null;
}

/** BusEventPubRead */
export interface BusEventPubReadInput {
	/** Name */
	name?: string | null;
	/** Description */
	description?: string | null;
	/** Day */
	day?: number | null;
	/** Position */
	position?: number | null;
	/** Is Optional */
	is_optional?: boolean | null;
	/** Images */
	images?: EventImagePubSchema[];
	/**
	 * Date
	 * Calendar date this event falls on, computed as the booking's departure date plus ``day - 1``. Null in the catalogue, where a template tour has no departure date to anchor against.
	 */
	date?: string | null;
	/**
	 * Typ
	 * @default "bus"
	 */
	typ?: "bus";
	details?: BusDetailPubSchemaInput | null;
}

/** BusEventPubRead */
export interface BusEventPubReadOutput {
	/** Name */
	name?: string | null;
	/** Description */
	description?: string | null;
	/** Day */
	day?: number | null;
	/** Position */
	position?: number | null;
	/** Is Optional */
	is_optional?: boolean | null;
	/** Images */
	images?: EventImagePubSchema[];
	/**
	 * Date
	 * Calendar date this event falls on, computed as the booking's departure date plus ``day - 1``. Null in the catalogue, where a template tour has no departure date to anchor against.
	 */
	date?: string | null;
	/**
	 * Typ
	 * @default "bus"
	 */
	typ?: "bus";
	details?: BusDetailPubSchemaOutput | null;
}

/** BusEventTypeRead */
export interface BusEventTypeReadInput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "bus"
	 */
	typ?: "bus";
	details?: BusDetailSchemaInput | null;
	/**
	 * Id
	 * Option (alternative) id; populated on read, ignored on write.
	 */
	id?: string | null;
}

/** BusEventTypeRead */
export interface BusEventTypeReadOutput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "bus"
	 */
	typ?: "bus";
	details?: BusDetailSchemaOutput | null;
	/**
	 * Id
	 * Option (alternative) id; populated on read, ignored on write.
	 */
	id?: string | null;
}

/** BusHopPubSchema */
export interface BusHopPubSchemaInput {
	departure?: BusJourneyPointPubSchemaInput | null;
	arrival?: BusJourneyPointPubSchemaInput | null;
}

/** BusHopPubSchema */
export interface BusHopPubSchemaOutput {
	departure?: BusJourneyPointPubSchemaOutput | null;
	arrival?: BusJourneyPointPubSchemaOutput | null;
}

/**
 * BusHopSchema
 * Represents a single leg of a bus journey.
 */
export interface BusHopSchemaInput {
	/** Details of the departure. */
	departure?: BusJourneyPointSchemaInput | null;
	/** Details of the arrival. */
	arrival?: BusJourneyPointSchemaInput | null;
}

/**
 * BusHopSchema
 * Represents a single leg of a bus journey.
 */
export interface BusHopSchemaOutput {
	/** Details of the departure. */
	departure?: BusJourneyPointSchemaOutput | null;
	/** Details of the arrival. */
	arrival?: BusJourneyPointSchemaOutput | null;
}

/** BusJourneyPointPubSchema */
export interface BusJourneyPointPubSchemaInput {
	/** Date */
	date?: string | null;
	time?: TimeSchema | null;
	/** Location */
	location?: LocationOutSchema | LocationRefSchema | LocationInSchema | null;
}

/** BusJourneyPointPubSchema */
export interface BusJourneyPointPubSchemaOutput {
	/** Date */
	date?: string | null;
	time?: TimeSchema | null;
	/** Location */
	location?: LocationOutSchema | LocationRefSchema | LocationInSchema | null;
}

/**
 * BusJourneyPointSchema
 * Represents either a departure or arrival point for the bus journey.
 */
export interface BusJourneyPointSchemaInput {
	/** The time of an event */
	time?: TimeSchema | null;
	/** Location */
	location?: LocationOutSchema | LocationRefSchema | LocationInSchema | null;
}

/**
 * BusJourneyPointSchema
 * Represents either a departure or arrival point for the bus journey.
 */
export interface BusJourneyPointSchemaOutput {
	/** The time of an event */
	time?: TimeSchema | null;
	/** Location */
	location?: LocationOutSchema | LocationRefSchema | LocationInSchema | null;
}

/** BusSingleEvent */
export interface BusSingleEventInput {
	/**
	 * Day
	 * Event's day number in a tour
	 */
	day: number;
	/**
	 * Position
	 * Event's order number in a tour
	 * @min 0
	 */
	position: number;
	/**
	 * Is Optional
	 * @default false
	 */
	is_optional?: boolean;
	/**
	 * Images
	 * Images of the event slot, primary first; populated on read, ignored on write.
	 */
	images?: EventImageSchema[];
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "bus"
	 */
	typ?: "bus";
	details?: BusDetailSchemaInput | null;
}

/** BusSingleEvent */
export interface BusSingleEventOutput {
	/**
	 * Day
	 * Event's day number in a tour
	 */
	day: number;
	/**
	 * Position
	 * Event's order number in a tour
	 * @min 0
	 */
	position: number;
	/**
	 * Is Optional
	 * @default false
	 */
	is_optional?: boolean;
	/**
	 * Images
	 * Images of the event slot, primary first; populated on read, ignored on write.
	 */
	images?: EventImageSchema[];
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "bus"
	 */
	typ?: "bus";
	details?: BusDetailSchemaOutput | null;
}

/** CatalogFiltersSchema */
export interface CatalogFiltersSchema {
	/** Cities */
	cities: string[];
	/** Countries */
	countries: string[];
}

/**
 * ChargePubSchema
 * Any charge with every monetary leaf removed: only the strategy and the
 * structure it carries survive.
 */
export interface ChargePubSchema {
	typ?: ExpenseType | null;
	/** Tiers */
	tiers?: GroupSizeTierPubSchema[] | null;
}

/** ClassicSwiftDetails */
export interface ClassicSwiftDetails {
	/**
	 * Typ
	 * @default "classic_swift"
	 */
	typ?: "classic_swift";
	/**
	 * Account Name Iban
	 * @maxLength 64
	 */
	account_name_iban: string;
	/**
	 * Swift Bic
	 * @minLength 8
	 * @maxLength 11
	 */
	swift_bic: string;
	/**
	 * Bank Name
	 * @maxLength 255
	 */
	bank_name: string;
	/**
	 * Bank Address
	 * @maxLength 512
	 */
	bank_address: string;
}

/**
 * ClientPaymentFile
 * One attached proof document, addressed for download and removal.
 */
export interface ClientPaymentFile {
	/**
	 * File Id
	 * @format uuid
	 */
	file_id: string;
	/** File Name */
	file_name: string;
}

/** ClientPaymentListResponse */
export interface ClientPaymentListResponse {
	/** Total Count */
	total_count: number;
	/** Data */
	data: ClientPaymentResponse[];
}

/**
 * ClientPaymentResponse
 * ``rate`` and ``base_amount`` are read back off the ledger settlement this
 * payment produced, not recomputed at read time — so the figure here is the
 * one the reconciliation actually counted, at the rate that was true when the
 * payment was confirmed. Both are ``None`` until confirmation, because an
 * unconfirmed receipt has no pinned rate yet.
 */
export interface ClientPaymentResponse {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/**
	 * Booking Id
	 * @format uuid
	 */
	booking_id: string;
	/** Order Number */
	order_number: string;
	/**
	 * Operator Id
	 * @format uuid
	 */
	operator_id: string;
	/** Client Name */
	client_name: string;
	/** Tour Name */
	tour_name: string | null;
	/** Amount */
	amount: number;
	currency: Currency;
	/** Rate */
	rate?: string | null;
	/** Base Amount */
	base_amount?: string | null;
	status: ClientPaymentStatus;
	/** Note */
	note?: string | null;
	/** Attachment Count */
	attachment_count: number;
	/** Created At */
	created_at?: string | null;
	/** Updated At */
	updated_at?: string | null;
}

/** ClientPaymentTally */
export interface ClientPaymentTally {
	/** Recorded */
	recorded: number;
	/** Confirmed */
	confirmed: number;
	/** Unconfirmed */
	unconfirmed: number;
}

/** ClientPaymentUpdate */
export interface ClientPaymentUpdate {
	/** Amount */
	amount?: number | null;
	/** Note */
	note?: string | null;
}

/** CounterpartyBalanceListResponse */
export interface CounterpartyBalanceListResponse {
	/** Total Count */
	total_count: number;
	currency: Currency;
	/**
	 * Total Outstanding
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	total_outstanding: string;
	/** Data */
	data: CounterpartyBalanceResponseOutput[];
}

/**
 * CounterpartyBalanceResponse
 * One debtor or creditor line, in the operator's base currency.
 *
 * ``billed`` / ``paid`` read from the operator's side of the relationship: for
 * a debtor they are what the operator invoiced and what came in, for a
 * creditor what the supplier charged and what went out.
 */
export interface CounterpartyBalanceResponseInput {
	/**
	 * One end of an entry. ``OPERATOR`` is a party like any other, not an
	 * implied centre — that is what lets a future entry record an agency paying a
	 * supplier directly, with the operator's books merely observing it.
	 */
	party_typ: LedgerParty;
	/** Party Id */
	party_id: string | null;
	/** Party Name */
	party_name: string | null;
	/** Billed */
	billed: number | string;
	/** Paid */
	paid: number | string;
	/** Outstanding */
	outstanding: number | string;
	currency: Currency;
}

/**
 * CounterpartyBalanceResponse
 * One debtor or creditor line, in the operator's base currency.
 *
 * ``billed`` / ``paid`` read from the operator's side of the relationship: for
 * a debtor they are what the operator invoiced and what came in, for a
 * creditor what the supplier charged and what went out.
 */
export interface CounterpartyBalanceResponseOutput {
	/**
	 * One end of an entry. ``OPERATOR`` is a party like any other, not an
	 * implied centre — that is what lets a future entry record an agency paying a
	 * supplier directly, with the operator's books merely observing it.
	 */
	party_typ: LedgerParty;
	/** Party Id */
	party_id: string | null;
	/** Party Name */
	party_name: string | null;
	/**
	 * Billed
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	billed: string;
	/**
	 * Paid
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	paid: string;
	/**
	 * Outstanding
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	outstanding: string;
	currency: Currency;
}

/** CreateAgencySchema */
export interface CreateAgencySchema {
	/** Name */
	name: string;
}

/** CreateFinancialSchema */
export interface CreateFinancialSchema {
	currency_type: Currency;
	/**
	 * Markup
	 * The markup calculation strategy.
	 */
	markup?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseInput)
				| ({
						typ: "percentage";
				  } & PercentageMarkup)
		  )
		| null;
	foc?: FocPolicy | null;
}

/** CustomDetails */
export interface CustomDetails {
	/**
	 * Typ
	 * @default "custom"
	 */
	typ?: "custom";
	/** Items */
	items: KeyValItem[];
}

/** EmptyDetails */
export interface EmptyDetails {
	/** Event start time */
	start_time?: TimeSchema | null;
	/** Event start time */
	end_time?: TimeSchema | null;
}

/** EmptyDetailsPub */
export interface EmptyDetailsPub {
	start_time?: TimeSchema | null;
	end_time?: TimeSchema | null;
}

/**
 * EventEditOp
 * Append-only revision log. CREATE and UPDATE carry the full snapshot event
 * UPDATE and DELETE name the existing snapshot event by ``target_id``. ``seq`` is the order and
 * ``at`` the server-set time — together they answer "how many / how long".
 */
export interface EventEditOpInput {
	op: EditOp;
	/** Seq */
	seq: number;
	/**
	 * At
	 * @format date-time
	 */
	at: string;
	/** Target Id */
	target_id?: string | null;
	event?: OrderTourEventSchemaInput | null;
}

/**
 * EventEditOp
 * Append-only revision log. CREATE and UPDATE carry the full snapshot event
 * UPDATE and DELETE name the existing snapshot event by ``target_id``. ``seq`` is the order and
 * ``at`` the server-set time — together they answer "how many / how long".
 */
export interface EventEditOpOutput {
	op: EditOp;
	/** Seq */
	seq: number;
	/**
	 * At
	 * @format date-time
	 */
	at: string;
	/** Target Id */
	target_id?: string | null;
	event?: OrderTourEventSchemaOutput | null;
}

/** EventImageModel */
export interface EventImageModel {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/**
	 * Event Id
	 * @format uuid
	 */
	event_id: string;
	/** Image Path */
	image_path: string;
	/** Is Primary */
	is_primary: boolean;
}

/**
 * EventImagePubSchema
 * Public mirror of ``EventImageSchema`` with the row id dropped — internal
 * identifiers never cross the boundary.
 */
export interface EventImagePubSchema {
	/** Image Path */
	image_path: string;
	/** Is Primary */
	is_primary: boolean;
}

/**
 * EventImageSchema
 * One image attached to an event slot, in the shape ``GET
 * /{tour_id}/event/{event_id}/images/all`` returns.
 *
 * Check: `src.tour.gallery.router.list_event_images`,
 * `src.tour.gallery.router.upload_event_images`.
 */
export interface EventImageSchema {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Image Path */
	image_path: string;
	/** Is Primary */
	is_primary: boolean;
}

/** EventLibraryListResponse */
export interface EventLibraryListResponse {
	/** Total Count */
	total_count: number;
	/** Data */
	data: EventLibraryResponse[];
}

/** EventLibraryResponse */
export interface EventLibraryResponse {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Event */
	event:
		| ({
				typ: "activity";
		  } & ActivityEventOutput)
		| ({
				typ: "bus";
		  } & BusEventOutput)
		| ({
				typ: "flight";
		  } & FlightEventOutput)
		| ({
				typ: "guide";
		  } & GuideEventOutput)
		| ({
				typ: "housing";
		  } & HousingEventOutput)
		| ({
				typ: "ref";
		  } & InformationEventOutput)
		| ({
				typ: "supplementary";
		  } & SupplementaryEventOutput)
		| ({
				typ: "train";
		  } & TrainEventOutput)
		| ({
				typ: "transfer";
		  } & TransferEventOutput);
	/** Image Paths */
	image_paths?: string[];
	/** Primary Image Path */
	primary_image_path?: string | null;
}

/**
 * EventLine
 * One event slot on a summary line: the slot id and its full payload.
 *
 * Check
 *
 * - ``/tour/{id}/option/{id}/summary`` for the quote these appear in
 */
export interface EventLineInput {
	/**
	 * Event Id
	 * @format uuid
	 */
	event_id: string;
	/** Event */
	event:
		| (
				| ({
						typ: "activity";
				  } & ActivitySingleEventInput)
				| ({
						typ: "bus";
				  } & BusSingleEventInput)
				| ({
						typ: "flight";
				  } & FlightSingleEventInput)
				| ({
						typ: "guide";
				  } & GuideSingleEventInput)
				| ({
						typ: "housing";
				  } & HousingSingleEventInput)
				| ({
						typ: "ref";
				  } & InformationSingleEventInput)
				| ({
						typ: "supplementary";
				  } & SupplementarySingleEventInput)
				| ({
						typ: "train";
				  } & TrainSingleEventInput)
				| ({
						typ: "transfer";
				  } & TransferSingleEventInput)
		  )
		| MultiEventReadInput;
}

/**
 * EventLine
 * One event slot on a summary line: the slot id and its full payload.
 *
 * Check
 *
 * - ``/tour/{id}/option/{id}/summary`` for the quote these appear in
 */
export interface EventLineOutput {
	/**
	 * Event Id
	 * @format uuid
	 */
	event_id: string;
	/** Event */
	event:
		| (
				| ({
						typ: "activity";
				  } & ActivitySingleEventOutput)
				| ({
						typ: "bus";
				  } & BusSingleEventOutput)
				| ({
						typ: "flight";
				  } & FlightSingleEventOutput)
				| ({
						typ: "guide";
				  } & GuideSingleEventOutput)
				| ({
						typ: "housing";
				  } & HousingSingleEventOutput)
				| ({
						typ: "ref";
				  } & InformationSingleEventOutput)
				| ({
						typ: "supplementary";
				  } & SupplementarySingleEventOutput)
				| ({
						typ: "train";
				  } & TrainSingleEventOutput)
				| ({
						typ: "transfer";
				  } & TransferSingleEventOutput)
		  )
		| MultiEventReadOutput;
}

/** EventOptionalSchema */
export interface EventOptionalSchema {
	/** Is Optional */
	is_optional: boolean;
}

/** EventReorderSchema */
export interface EventReorderSchema {
	/**
	 * Day
	 * New day number
	 * @min 1
	 */
	day: number;
	/**
	 * Position
	 * New position number
	 * @min 0
	 */
	position: number;
}

/**
 * EventVarianceLine
 * One event's planned spend against what the operator actually committed.
 *
 * ``planned_min``/``planned_max`` come off the frozen snapshot; ``accrued`` is
 * what the operator entered as the real supplier cost; ``settled`` is the part
 * of it marked paid with a receipt attached. ``variance`` is
 * ``planned_max - accrued`` — positive means the event came in under its
 * planned budget, negative means it overran.
 *
 * ``payment_id`` addresses the seeded supplier payment row backing this event —
 * one per ``(booking_id, event_id)`` — so the line opens straight into
 * ``/operator/supplier-payment/{payment_id}``. It is ``None`` only while the
 * booking is unconfirmed and no payment has been seeded yet.
 *
 * Check:
 * - ``GET /booking/order/operator/{booking_id}/financials`` for order totals
 * - ``GET /operator/supplier-payment/{payment_id}`` for the payment detail
 */
export interface EventVarianceLineInput {
	/**
	 * Event Id
	 * @format uuid
	 */
	event_id: string;
	/** Payment Id */
	payment_id: string | null;
	/** Event Name */
	event_name: string | null;
	event_typ: EventTypes | null;
	/**
	 * Date
	 * @format date
	 */
	date: string;
	/** Planned Min */
	planned_min: number | string;
	/** Planned Max */
	planned_max: number | string;
	/** Accrued */
	accrued: number | string;
	/** Settled */
	settled: number | string;
	/** Payable */
	payable: number | string;
	/** Variance */
	variance: number | string;
}

/**
 * EventVarianceLine
 * One event's planned spend against what the operator actually committed.
 *
 * ``planned_min``/``planned_max`` come off the frozen snapshot; ``accrued`` is
 * what the operator entered as the real supplier cost; ``settled`` is the part
 * of it marked paid with a receipt attached. ``variance`` is
 * ``planned_max - accrued`` — positive means the event came in under its
 * planned budget, negative means it overran.
 *
 * ``payment_id`` addresses the seeded supplier payment row backing this event —
 * one per ``(booking_id, event_id)`` — so the line opens straight into
 * ``/operator/supplier-payment/{payment_id}``. It is ``None`` only while the
 * booking is unconfirmed and no payment has been seeded yet.
 *
 * Check:
 * - ``GET /booking/order/operator/{booking_id}/financials`` for order totals
 * - ``GET /operator/supplier-payment/{payment_id}`` for the payment detail
 */
export interface EventVarianceLineOutput {
	/**
	 * Event Id
	 * @format uuid
	 */
	event_id: string;
	/** Payment Id */
	payment_id: string | null;
	/** Event Name */
	event_name: string | null;
	event_typ: EventTypes | null;
	/**
	 * Date
	 * @format date
	 */
	date: string;
	/**
	 * Planned Min
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	planned_min: string;
	/**
	 * Planned Max
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	planned_max: string;
	/**
	 * Accrued
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	accrued: string;
	/**
	 * Settled
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	settled: string;
	/**
	 * Payable
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	payable: string;
	/**
	 * Variance
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	variance: string;
}

/** EventVarianceResponse */
export interface EventVarianceResponse {
	/**
	 * Booking Id
	 * @format uuid
	 */
	booking_id: string;
	/** Order Number */
	order_number: string;
	currency: Currency;
	/**
	 * Planned Total Min
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	planned_total_min: string;
	/**
	 * Planned Total Max
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	planned_total_max: string;
	/**
	 * Accrued Total
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	accrued_total: string;
	/**
	 * Settled Total
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	settled_total: string;
	/**
	 * Variance Total
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	variance_total: string;
	/** Events */
	events: EventVarianceLineOutput[];
}

/** ExcludedDateCreate */
export interface ExcludedDateCreate {
	/**
	 * Value
	 * @format date
	 */
	value: string;
}

/** ExcludedDateModel */
export interface ExcludedDateModel {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/**
	 * Schedule Id
	 * @format uuid
	 */
	schedule_id: string;
	/**
	 * Value
	 * @format date
	 */
	value: string;
}

/** ExcludedDatesBulkCreate */
export interface ExcludedDatesBulkCreate {
	/**
	 * Dates
	 * @minItems 1
	 */
	dates: string[];
}

/** ExcludedDatesBulkDelete */
export interface ExcludedDatesBulkDelete {
	/**
	 * Date Ids
	 * @minItems 1
	 */
	date_ids: string[];
}

/**
 * FixedCharge
 * A fixed cost together with its own fee and markup.
 */
export interface FixedChargeInput {
	/**
	 * Typ
	 * @default "fixed"
	 */
	typ?: "fixed";
	/**
	 * Monetary value pair.
	 *
	 * Conversion happens inside the schema but takes an explicit ``FxContext``
	 * — no module-level rate singleton. Same-currency ``convert`` is a cheap
	 * ``return self``; cross-currency requires a matching entry in
	 * ``fx.rates`` and applies ``val * rate``.
	 *
	 * Arithmetic operators stay same-currency-only on purpose: event calc
	 * normalizes every leaf to ``fx.target`` via ``convert`` before summing,
	 * so same-currency is always satisfied and the guards catch anything that
	 * slips through.
	 */
	cost: MonetaryValueSchema;
	fees?: FixedExpenseInput | null;
	/**
	 * Markup
	 * The markup calculation strategy.
	 */
	markup?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseInput)
				| ({
						typ: "percentage";
				  } & PercentageMarkup)
		  )
		| null;
}

/**
 * FixedCharge
 * A fixed cost together with its own fee and markup.
 */
export interface FixedChargeOutput {
	/**
	 * Typ
	 * @default "fixed"
	 */
	typ?: "fixed";
	/**
	 * Monetary value pair.
	 *
	 * Conversion happens inside the schema but takes an explicit ``FxContext``
	 * — no module-level rate singleton. Same-currency ``convert`` is a cheap
	 * ``return self``; cross-currency requires a matching entry in
	 * ``fx.rates`` and applies ``val * rate``.
	 *
	 * Arithmetic operators stay same-currency-only on purpose: event calc
	 * normalizes every leaf to ``fx.target`` via ``convert`` before summing,
	 * so same-currency is always satisfied and the guards catch anything that
	 * slips through.
	 */
	cost: MonetaryValueSchema;
	fees?: FixedExpenseOutput | null;
	/**
	 * Markup
	 * The markup calculation strategy.
	 */
	markup?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseOutput)
				| ({
						typ: "percentage";
				  } & PercentageMarkup)
		  )
		| null;
}

/** FixedDateCreate */
export interface FixedDateCreate {
	/**
	 * Value
	 * @format date
	 */
	value: string;
}

/** FixedDateModel */
export interface FixedDateModel {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/**
	 * Schedule Id
	 * @format uuid
	 */
	schedule_id: string;
	/**
	 * Value
	 * @format date
	 */
	value: string;
}

/** FixedDatesBulkCreate */
export interface FixedDatesBulkCreate {
	/**
	 * Dates
	 * @minItems 1
	 */
	dates: string[];
}

/** FixedDatesBulkDelete */
export interface FixedDatesBulkDelete {
	/**
	 * Date Ids
	 * @minItems 1
	 */
	date_ids: string[];
}

/**
 * FixedExpense
 * A simple fixed cost, ignores all context.
 */
export interface FixedExpenseInput {
	/**
	 * Typ
	 * @default "fixed"
	 */
	typ?: "fixed";
	/**
	 * Monetary value pair.
	 *
	 * Conversion happens inside the schema but takes an explicit ``FxContext``
	 * — no module-level rate singleton. Same-currency ``convert`` is a cheap
	 * ``return self``; cross-currency requires a matching entry in
	 * ``fx.rates`` and applies ``val * rate``.
	 *
	 * Arithmetic operators stay same-currency-only on purpose: event calc
	 * normalizes every leaf to ``fx.target`` via ``convert`` before summing,
	 * so same-currency is always satisfied and the guards catch anything that
	 * slips through.
	 */
	cost: MonetaryValueSchema;
}

/**
 * FixedExpense
 * A simple fixed cost, ignores all context.
 */
export interface FixedExpenseOutput {
	/**
	 * Typ
	 * @default "fixed"
	 */
	typ?: "fixed";
	/**
	 * Monetary value pair.
	 *
	 * Conversion happens inside the schema but takes an explicit ``FxContext``
	 * — no module-level rate singleton. Same-currency ``convert`` is a cheap
	 * ``return self``; cross-currency requires a matching entry in
	 * ``fx.rates`` and applies ``val * rate``.
	 *
	 * Arithmetic operators stay same-currency-only on purpose: event calc
	 * normalizes every leaf to ``fx.target`` via ``convert`` before summing,
	 * so same-currency is always satisfied and the guards catch anything that
	 * slips through.
	 */
	cost: MonetaryValueSchema;
}

/** FlightDetailsPubSchema */
export interface FlightDetailsPubSchemaInput {
	/** Hop */
	hop?: FlightHopPubSchemaInput[] | null;
	expenses?: ChargePubSchema | null;
}

/** FlightDetailsPubSchema */
export interface FlightDetailsPubSchemaOutput {
	/** Hop */
	hop?: FlightHopPubSchemaOutput[] | null;
	expenses?: ChargePubSchema | null;
}

/** FlightDetailsSchema */
export interface FlightDetailsSchemaInput {
	/** Hop */
	hop?: FlightHopDetailsSchemaInput[] | null;
	/**
	 * Expenses
	 * Expenses strategy for this event
	 */
	expenses?:
		| (
				| ({
						typ: "fixed";
				  } & FixedChargeInput)
				| ({
						typ: "per_person";
				  } & PerPersonChargeInput)
		  )
		| null;
}

/** FlightDetailsSchema */
export interface FlightDetailsSchemaOutput {
	/** Hop */
	hop?: FlightHopDetailsSchemaOutput[] | null;
	/**
	 * Expenses
	 * Expenses strategy for this event
	 */
	expenses?:
		| (
				| ({
						typ: "fixed";
				  } & FixedChargeOutput)
				| ({
						typ: "per_person";
				  } & PerPersonChargeOutput)
		  )
		| null;
}

/** FlightEvent */
export interface FlightEventInput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "flight"
	 */
	typ?: "flight";
	details?: FlightDetailsSchemaInput | null;
}

/** FlightEvent */
export interface FlightEventOutput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "flight"
	 */
	typ?: "flight";
	details?: FlightDetailsSchemaOutput | null;
}

/** FlightEventPubRead */
export interface FlightEventPubReadInput {
	/** Name */
	name?: string | null;
	/** Description */
	description?: string | null;
	/** Day */
	day?: number | null;
	/** Position */
	position?: number | null;
	/** Is Optional */
	is_optional?: boolean | null;
	/** Images */
	images?: EventImagePubSchema[];
	/**
	 * Date
	 * Calendar date this event falls on, computed as the booking's departure date plus ``day - 1``. Null in the catalogue, where a template tour has no departure date to anchor against.
	 */
	date?: string | null;
	/**
	 * Typ
	 * @default "flight"
	 */
	typ?: "flight";
	details?: FlightDetailsPubSchemaInput | null;
}

/** FlightEventPubRead */
export interface FlightEventPubReadOutput {
	/** Name */
	name?: string | null;
	/** Description */
	description?: string | null;
	/** Day */
	day?: number | null;
	/** Position */
	position?: number | null;
	/** Is Optional */
	is_optional?: boolean | null;
	/** Images */
	images?: EventImagePubSchema[];
	/**
	 * Date
	 * Calendar date this event falls on, computed as the booking's departure date plus ``day - 1``. Null in the catalogue, where a template tour has no departure date to anchor against.
	 */
	date?: string | null;
	/**
	 * Typ
	 * @default "flight"
	 */
	typ?: "flight";
	details?: FlightDetailsPubSchemaOutput | null;
}

/** FlightEventTypeRead */
export interface FlightEventTypeReadInput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "flight"
	 */
	typ?: "flight";
	details?: FlightDetailsSchemaInput | null;
	/**
	 * Id
	 * Option (alternative) id; populated on read, ignored on write.
	 */
	id?: string | null;
}

/** FlightEventTypeRead */
export interface FlightEventTypeReadOutput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "flight"
	 */
	typ?: "flight";
	details?: FlightDetailsSchemaOutput | null;
	/**
	 * Id
	 * Option (alternative) id; populated on read, ignored on write.
	 */
	id?: string | null;
}

/** FlightHopDetailsSchema */
export interface FlightHopDetailsSchemaInput {
	/**
	 * Airline Code
	 * IATA or ICAO airline code (2–3 letters/numbers, uppercase)
	 */
	airline_code?: string | null;
	/**
	 * Flight Number
	 * Flight number (1–4 digits)
	 */
	flight_number?: number | null;
	/**
	 * Departure Airport Code
	 * Departure airport IATA code (3 uppercase letters)
	 */
	departure_airport_code?: string | null;
	/**
	 * Arrival Airport Code
	 * Arrival airport IATA code (3 uppercase letters)
	 */
	arrival_airport_code?: string | null;
	/** Departure Location */
	departure_location?:
		| LocationOutSchema
		| LocationRefSchema
		| LocationInSchema
		| null;
	/** Arrival Location */
	arrival_location?:
		| LocationOutSchema
		| LocationRefSchema
		| LocationInSchema
		| null;
	departure_time?: TimeSchema | null;
	arrival_time?: TimeSchema | null;
	/**
	 * Departure Terminal
	 * Departure terminal (e.g., '1', 'T2', 'A')
	 */
	departure_terminal?: string | null;
	/**
	 * Departure Gate
	 * Departure gate (e.g., 'A12', 'B3')
	 */
	departure_gate?: string | null;
	/**
	 * Amenities
	 * List of amenities available on this flight.
	 */
	amenities?: AmenitiesTypes[] | null;
}

/** FlightHopDetailsSchema */
export interface FlightHopDetailsSchemaOutput {
	/**
	 * Airline Code
	 * IATA or ICAO airline code (2–3 letters/numbers, uppercase)
	 */
	airline_code?: string | null;
	/**
	 * Flight Number
	 * Flight number (1–4 digits)
	 */
	flight_number?: number | null;
	/**
	 * Departure Airport Code
	 * Departure airport IATA code (3 uppercase letters)
	 */
	departure_airport_code?: string | null;
	/**
	 * Arrival Airport Code
	 * Arrival airport IATA code (3 uppercase letters)
	 */
	arrival_airport_code?: string | null;
	/** Departure Location */
	departure_location?:
		| LocationOutSchema
		| LocationRefSchema
		| LocationInSchema
		| null;
	/** Arrival Location */
	arrival_location?:
		| LocationOutSchema
		| LocationRefSchema
		| LocationInSchema
		| null;
	departure_time?: TimeSchema | null;
	arrival_time?: TimeSchema | null;
	/**
	 * Departure Terminal
	 * Departure terminal (e.g., '1', 'T2', 'A')
	 */
	departure_terminal?: string | null;
	/**
	 * Departure Gate
	 * Departure gate (e.g., 'A12', 'B3')
	 */
	departure_gate?: string | null;
	/**
	 * Amenities
	 * List of amenities available on this flight.
	 */
	amenities?: AmenitiesTypes[] | null;
}

/** FlightHopPubSchema */
export interface FlightHopPubSchemaInput {
	/** Airline Code */
	airline_code?: string | null;
	/** Flight Number */
	flight_number?: number | null;
	/** Departure Airport Code */
	departure_airport_code?: string | null;
	/** Arrival Airport Code */
	arrival_airport_code?: string | null;
	/** Departure Location */
	departure_location?:
		| LocationOutSchema
		| LocationRefSchema
		| LocationInSchema
		| null;
	/** Arrival Location */
	arrival_location?:
		| LocationOutSchema
		| LocationRefSchema
		| LocationInSchema
		| null;
	/** Departure Date */
	departure_date?: string | null;
	/** Arrival Date */
	arrival_date?: string | null;
	departure_time?: TimeSchema | null;
	arrival_time?: TimeSchema | null;
	/** Departure Terminal */
	departure_terminal?: string | null;
	/** Departure Gate */
	departure_gate?: string | null;
	/** Amenities */
	amenities?: AmenitiesTypes[] | null;
}

/** FlightHopPubSchema */
export interface FlightHopPubSchemaOutput {
	/** Airline Code */
	airline_code?: string | null;
	/** Flight Number */
	flight_number?: number | null;
	/** Departure Airport Code */
	departure_airport_code?: string | null;
	/** Arrival Airport Code */
	arrival_airport_code?: string | null;
	/** Departure Location */
	departure_location?:
		| LocationOutSchema
		| LocationRefSchema
		| LocationInSchema
		| null;
	/** Arrival Location */
	arrival_location?:
		| LocationOutSchema
		| LocationRefSchema
		| LocationInSchema
		| null;
	/** Departure Date */
	departure_date?: string | null;
	/** Arrival Date */
	arrival_date?: string | null;
	departure_time?: TimeSchema | null;
	arrival_time?: TimeSchema | null;
	/** Departure Terminal */
	departure_terminal?: string | null;
	/** Departure Gate */
	departure_gate?: string | null;
	/** Amenities */
	amenities?: AmenitiesTypes[] | null;
}

/** FlightSingleEvent */
export interface FlightSingleEventInput {
	/**
	 * Day
	 * Event's day number in a tour
	 */
	day: number;
	/**
	 * Position
	 * Event's order number in a tour
	 * @min 0
	 */
	position: number;
	/**
	 * Is Optional
	 * @default false
	 */
	is_optional?: boolean;
	/**
	 * Images
	 * Images of the event slot, primary first; populated on read, ignored on write.
	 */
	images?: EventImageSchema[];
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "flight"
	 */
	typ?: "flight";
	details?: FlightDetailsSchemaInput | null;
}

/** FlightSingleEvent */
export interface FlightSingleEventOutput {
	/**
	 * Day
	 * Event's day number in a tour
	 */
	day: number;
	/**
	 * Position
	 * Event's order number in a tour
	 * @min 0
	 */
	position: number;
	/**
	 * Is Optional
	 * @default false
	 */
	is_optional?: boolean;
	/**
	 * Images
	 * Images of the event slot, primary first; populated on read, ignored on write.
	 */
	images?: EventImageSchema[];
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "flight"
	 */
	typ?: "flight";
	details?: FlightDetailsSchemaOutput | null;
}

/**
 * FocPolicy
 * Tiered free-of-charge allowance — each tier frees the pax above its base,
 * capped at that tier's ``free``, and the tiers' max applies (never dips, keeps at
 * least the base paying). ``[10->1, 30->3]``: 25 pax -> 1 free, 33 -> 3, 50 -> 3.
 */
export interface FocPolicy {
	/**
	 * Tiers
	 * @minItems 1
	 */
	tiers: FocTier[];
}

/**
 * FocTier
 * One free-of-charge threshold: ``min_pax`` are the paying base, above which up
 * to ``free`` extra heads ride free (so full ``free`` needs ``min_pax + free``).
 */
export interface FocTier {
	/**
	 * Min Pax
	 * Paying base; free pax count from here up.
	 * @min 1
	 */
	min_pax: number;
	/**
	 * Free
	 * Max free pax granted above the base.
	 * @min 1
	 */
	free: number;
}

/** FrozenFxRate */
export interface FrozenFxRateInput {
	from_currency: Currency;
	to_currency: Currency;
	/** Rate */
	rate: number | string;
}

/** FrozenFxRate */
export interface FrozenFxRateOutput {
	from_currency: Currency;
	to_currency: Currency;
	/**
	 * Rate
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	rate: string;
}

/** FrozenTourFin */
export interface FrozenTourFinInput {
	currency_type: Currency;
	/**
	 * Markup
	 * The markup calculation strategy.
	 */
	markup?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseInput)
				| ({
						typ: "percentage";
				  } & PercentageMarkup)
		  )
		| null;
	foc?: FocPolicy | null;
}

/** FrozenTourFin */
export interface FrozenTourFinOutput {
	currency_type: Currency;
	/**
	 * Markup
	 * The markup calculation strategy.
	 */
	markup?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseOutput)
				| ({
						typ: "percentage";
				  } & PercentageMarkup)
		  )
		| null;
	foc?: FocPolicy | null;
}

/** FrozenTourMeta */
export interface FrozenTourMeta {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Title */
	title?: string | null;
	/** Cover Image Path */
	cover_image_path?: string | null;
	/** Group Size */
	group_size: number;
	/** Days */
	days: number;
	/** Nights */
	nights: number;
	/** Duration Hours */
	duration_hours?: number | null;
	/** Age From */
	age_from?: number | null;
	/** Age To */
	age_to?: number | null;
	typ: TourType;
	status: TourStatus;
	/** Categories */
	categories?: TourCategory[];
}

/** FrozenTourOption */
export interface FrozenTourOption {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Name */
	name?: string | null;
	/** Description */
	description?: string | null;
	/** Cover Image Path */
	cover_image_path?: string | null;
}

/** FullScheduleSchema */
export interface FullScheduleSchema {
	schedule: TourScheduleModel;
	/** Fixed Dates */
	fixed_dates: FixedDateModel[];
	/** Excluded Dates */
	excluded_dates: ExcludedDateModel[];
	/** Recurrence Rules */
	recurrence_rules: RecurrenceDateModel[];
	/**
	 * Occurrences
	 * Materialised bookable dates (fixed ∪ recurrence) − excluded, within the requested window.
	 */
	occurrences?: string[];
	/**
	 * Window From
	 * @format date
	 */
	window_from: string;
	/**
	 * Window Until
	 * @format date
	 */
	window_until: string;
}

/** FxRateCreateSchema */
export interface FxRateCreateSchema {
	from_currency: Currency;
	to_currency: Currency;
	/** Rate */
	rate: number | string;
}

/**
 * FxRateUpdateSchema
 * Correct a recorded rate in place. The currency pair is immutable — a
 * different pair is a different ledger entry, so record a new one.
 */
export interface FxRateUpdateSchema {
	/** Rate */
	rate: number | string;
}

/**
 * GeoFeature
 * Provider-neutral geocoded place.
 */
export interface GeoFeature {
	/** Lat */
	lat: number;
	/** Long */
	long: number;
	/** Name */
	name?: string | null;
	/** City */
	city?: string | null;
	/** Street */
	street?: string | null;
	/** Housenumber */
	housenumber?: string | null;
	/** Postcode */
	postcode?: string | null;
	/** State */
	state?: string | null;
	/** Country */
	country?: string | null;
	/** Country Code */
	country_code?: string | null;
}

/**
 * GroupSizeTier
 * One group-size pricing step: the flat ``cost`` applies to any headcount
 * from the previous tier's bound + 1 up to ``up_to_pax`` inclusive.
 */
export interface GroupSizeTierInput {
	/**
	 * Up To Pax
	 * Inclusive upper headcount bound.
	 * @min 1
	 */
	up_to_pax: number;
	/**
	 * Monetary value pair.
	 *
	 * Conversion happens inside the schema but takes an explicit ``FxContext``
	 * — no module-level rate singleton. Same-currency ``convert`` is a cheap
	 * ``return self``; cross-currency requires a matching entry in
	 * ``fx.rates`` and applies ``val * rate``.
	 *
	 * Arithmetic operators stay same-currency-only on purpose: event calc
	 * normalizes every leaf to ``fx.target`` via ``convert`` before summing,
	 * so same-currency is always satisfied and the guards catch anything that
	 * slips through.
	 */
	cost: MonetaryValueSchema;
}

/**
 * GroupSizeTier
 * One group-size pricing step: the flat ``cost`` applies to any headcount
 * from the previous tier's bound + 1 up to ``up_to_pax`` inclusive.
 */
export interface GroupSizeTierOutput {
	/**
	 * Up To Pax
	 * Inclusive upper headcount bound.
	 * @min 1
	 */
	up_to_pax: number;
	/**
	 * Monetary value pair.
	 *
	 * Conversion happens inside the schema but takes an explicit ``FxContext``
	 * — no module-level rate singleton. Same-currency ``convert`` is a cheap
	 * ``return self``; cross-currency requires a matching entry in
	 * ``fx.rates`` and applies ``val * rate``.
	 *
	 * Arithmetic operators stay same-currency-only on purpose: event calc
	 * normalizes every leaf to ``fx.target`` via ``convert`` before summing,
	 * so same-currency is always satisfied and the guards catch anything that
	 * slips through.
	 */
	cost: MonetaryValueSchema;
}

/**
 * GroupSizeTierPubSchema
 * A group-size band with its cost stripped — the bands themselves say how
 * the offer is structured.
 */
export interface GroupSizeTierPubSchema {
	/** Up To Pax */
	up_to_pax?: number | null;
}

/** GuideByLanguageCategory */
export interface GuideByLanguageCategoryInput {
	lang?: LanguageCode | null;
	expenses?: PerGroupChargeInput | null;
}

/** GuideByLanguageCategory */
export interface GuideByLanguageCategoryOutput {
	lang?: LanguageCode | null;
	expenses?: PerGroupChargeOutput | null;
}

/** GuideDetails */
export interface GuideDetailsInput {
	/** Name */
	name?: string | null;
	/**
	 * Duration
	 * Length of guide activity in days
	 */
	duration?: number | null;
	/**
	 * Typ Tiers
	 * Guide kind stepped by group size; the last tier is open-ended.
	 */
	typ_tiers?: GuideTypeTier[];
	/**
	 * Categories
	 * @default []
	 */
	categories?: GuideByLanguageCategoryInput[];
}

/** GuideDetails */
export interface GuideDetailsOutput {
	/** Name */
	name?: string | null;
	/**
	 * Duration
	 * Length of guide activity in days
	 */
	duration?: number | null;
	/**
	 * Typ Tiers
	 * Guide kind stepped by group size; the last tier is open-ended.
	 */
	typ_tiers?: GuideTypeTier[];
	/**
	 * Categories
	 * @default []
	 */
	categories?: GuideByLanguageCategoryOutput[];
}

/** GuideEvent */
export interface GuideEventInput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "guide"
	 */
	typ?: "guide";
	details?: GuideDetailsInput | null;
}

/** GuideEvent */
export interface GuideEventOutput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "guide"
	 */
	typ?: "guide";
	details?: GuideDetailsOutput | null;
}

/** GuideEventTypeRead */
export interface GuideEventTypeReadInput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "guide"
	 */
	typ?: "guide";
	details?: GuideDetailsInput | null;
	/**
	 * Id
	 * Option (alternative) id; populated on read, ignored on write.
	 */
	id?: string | null;
}

/** GuideEventTypeRead */
export interface GuideEventTypeReadOutput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "guide"
	 */
	typ?: "guide";
	details?: GuideDetailsOutput | null;
	/**
	 * Id
	 * Option (alternative) id; populated on read, ignored on write.
	 */
	id?: string | null;
}

/** GuideSingleEvent */
export interface GuideSingleEventInput {
	/**
	 * Day
	 * Event's day number in a tour
	 */
	day: number;
	/**
	 * Position
	 * Event's order number in a tour
	 * @min 0
	 */
	position: number;
	/**
	 * Is Optional
	 * @default false
	 */
	is_optional?: boolean;
	/**
	 * Images
	 * Images of the event slot, primary first; populated on read, ignored on write.
	 */
	images?: EventImageSchema[];
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "guide"
	 */
	typ?: "guide";
	details?: GuideDetailsInput | null;
}

/** GuideSingleEvent */
export interface GuideSingleEventOutput {
	/**
	 * Day
	 * Event's day number in a tour
	 */
	day: number;
	/**
	 * Position
	 * Event's order number in a tour
	 * @min 0
	 */
	position: number;
	/**
	 * Is Optional
	 * @default false
	 */
	is_optional?: boolean;
	/**
	 * Images
	 * Images of the event slot, primary first; populated on read, ignored on write.
	 */
	images?: EventImageSchema[];
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "guide"
	 */
	typ?: "guide";
	details?: GuideDetailsOutput | null;
}

/**
 * GuideTypeTier
 * One guide-staffing step: ``typ`` applies to any headcount from the
 * previous tier's bound + 1 up to ``up_to_pax`` inclusive.
 */
export interface GuideTypeTier {
	/**
	 * Up To Pax
	 * Inclusive upper headcount bound.
	 * @min 1
	 */
	up_to_pax: number;
	typ: GuideType;
}

/** HTTPValidationError */
export interface HTTPValidationError {
	/** Detail */
	detail?: ValidationError[];
}

/** HousingDetailsPubSchema */
export interface HousingDetailsPubSchemaInput {
	/** Location */
	location?: LocationOutSchema | LocationRefSchema | LocationInSchema | null;
	/** Amenities */
	amenities?: AmenitiesTypes[] | null;
	/** Duration */
	duration?: number | null;
	check_in?: TimeSchema | null;
	check_out?: TimeSchema | null;
	/** Stars */
	stars?: number | null;
	expenses?: HousingExpensesPubSchemaInput | null;
}

/** HousingDetailsPubSchema */
export interface HousingDetailsPubSchemaOutput {
	/** Location */
	location?: LocationOutSchema | LocationRefSchema | LocationInSchema | null;
	/** Amenities */
	amenities?: AmenitiesTypes[] | null;
	/** Duration */
	duration?: number | null;
	check_in?: TimeSchema | null;
	check_out?: TimeSchema | null;
	/** Stars */
	stars?: number | null;
	expenses?: HousingExpensesPubSchemaOutput | null;
}

/** HousingDetailsSchema */
export interface HousingDetailsSchemaInput {
	/**
	 * Location
	 * Housing location
	 */
	location?: LocationOutSchema | LocationRefSchema | LocationInSchema | null;
	/** Amenities */
	amenities?: AmenitiesTypes[] | null;
	/**
	 * Duration
	 * Length of stay
	 */
	duration?: number | null;
	check_in?: TimeSchema | null;
	check_out?: TimeSchema | null;
	/**
	 * Expenses
	 * Expenses strategy for this event
	 */
	expenses?:
		| (
				| ({
						typ: "fixed";
				  } & FixedChargeInput)
				| ({
						typ: "per_person";
				  } & PerPersonChargeInput)
				| ({
						typ: "per_room";
				  } & PerRoomExpensesInput)
				| ({
						typ: "per_room_category";
				  } & PerRoomCategoryExpensesInput)
		  )
		| null;
	/** Stars */
	stars?: number | null;
}

/** HousingDetailsSchema */
export interface HousingDetailsSchemaOutput {
	/**
	 * Location
	 * Housing location
	 */
	location?: LocationOutSchema | LocationRefSchema | LocationInSchema | null;
	/** Amenities */
	amenities?: AmenitiesTypes[] | null;
	/**
	 * Duration
	 * Length of stay
	 */
	duration?: number | null;
	check_in?: TimeSchema | null;
	check_out?: TimeSchema | null;
	/**
	 * Expenses
	 * Expenses strategy for this event
	 */
	expenses?:
		| (
				| ({
						typ: "fixed";
				  } & FixedChargeOutput)
				| ({
						typ: "per_person";
				  } & PerPersonChargeOutput)
				| ({
						typ: "per_room";
				  } & PerRoomExpensesOutput)
				| ({
						typ: "per_room_category";
				  } & PerRoomCategoryExpensesOutput)
		  )
		| null;
	/** Stars */
	stars?: number | null;
}

/** HousingEvent */
export interface HousingEventInput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "housing"
	 */
	typ?: "housing";
	details?: HousingDetailsSchemaInput | null;
}

/** HousingEvent */
export interface HousingEventOutput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "housing"
	 */
	typ?: "housing";
	details?: HousingDetailsSchemaOutput | null;
}

/** HousingEventPubRead */
export interface HousingEventPubReadInput {
	/** Name */
	name?: string | null;
	/** Description */
	description?: string | null;
	/** Day */
	day?: number | null;
	/** Position */
	position?: number | null;
	/** Is Optional */
	is_optional?: boolean | null;
	/** Images */
	images?: EventImagePubSchema[];
	/**
	 * Date
	 * Calendar date this event falls on, computed as the booking's departure date plus ``day - 1``. Null in the catalogue, where a template tour has no departure date to anchor against.
	 */
	date?: string | null;
	/**
	 * Typ
	 * @default "housing"
	 */
	typ?: "housing";
	details?: HousingDetailsPubSchemaInput | null;
}

/** HousingEventPubRead */
export interface HousingEventPubReadOutput {
	/** Name */
	name?: string | null;
	/** Description */
	description?: string | null;
	/** Day */
	day?: number | null;
	/** Position */
	position?: number | null;
	/** Is Optional */
	is_optional?: boolean | null;
	/** Images */
	images?: EventImagePubSchema[];
	/**
	 * Date
	 * Calendar date this event falls on, computed as the booking's departure date plus ``day - 1``. Null in the catalogue, where a template tour has no departure date to anchor against.
	 */
	date?: string | null;
	/**
	 * Typ
	 * @default "housing"
	 */
	typ?: "housing";
	details?: HousingDetailsPubSchemaOutput | null;
}

/** HousingEventTypeRead */
export interface HousingEventTypeReadInput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "housing"
	 */
	typ?: "housing";
	details?: HousingDetailsSchemaInput | null;
	/**
	 * Id
	 * Option (alternative) id; populated on read, ignored on write.
	 */
	id?: string | null;
}

/** HousingEventTypeRead */
export interface HousingEventTypeReadOutput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "housing"
	 */
	typ?: "housing";
	details?: HousingDetailsSchemaOutput | null;
	/**
	 * Id
	 * Option (alternative) id; populated on read, ignored on write.
	 */
	id?: string | null;
}

/** HousingExpensesPubSchema */
export interface HousingExpensesPubSchemaInput {
	typ?: ExpenseType | null;
	/** Tiers */
	tiers?: GroupSizeTierPubSchema[] | null;
	/** Rooms */
	rooms?: HousingRoomPubSchema[] | null;
	/** Categories */
	categories?: HousingRoomCategoryPubSchemaInput[] | null;
}

/** HousingExpensesPubSchema */
export interface HousingExpensesPubSchemaOutput {
	typ?: ExpenseType | null;
	/** Tiers */
	tiers?: GroupSizeTierPubSchema[] | null;
	/** Rooms */
	rooms?: HousingRoomPubSchema[] | null;
	/** Categories */
	categories?: HousingRoomCategoryPubSchemaOutput[] | null;
}

/** HousingRoomCategoryExpensesSchema */
export interface HousingRoomCategoryExpensesSchemaInput {
	/** Name */
	name?: string | null;
	/** Rooms */
	rooms?: HousingRoomSchemaInput[] | null;
}

/** HousingRoomCategoryExpensesSchema */
export interface HousingRoomCategoryExpensesSchemaOutput {
	/** Name */
	name?: string | null;
	/** Rooms */
	rooms?: HousingRoomSchemaOutput[] | null;
}

/** HousingRoomCategoryPubSchema */
export interface HousingRoomCategoryPubSchemaInput {
	/** Name */
	name?: string | null;
	/** Rooms */
	rooms?: HousingRoomPubSchema[] | null;
}

/** HousingRoomCategoryPubSchema */
export interface HousingRoomCategoryPubSchemaOutput {
	/** Name */
	name?: string | null;
	/** Rooms */
	rooms?: HousingRoomPubSchema[] | null;
}

/**
 * HousingRoomDoubleSchema
 * per room always counts as double
 */
export interface HousingRoomDoubleSchemaInput {
	/**
	 * Name
	 * Room name Standard, Suite .e.t.c.
	 */
	name?: string | null;
	/**
	 * Description
	 * Room description
	 */
	description?: string | null;
	expenses?: FixedChargeInput | null;
}

/**
 * HousingRoomDoubleSchema
 * per room always counts as double
 */
export interface HousingRoomDoubleSchemaOutput {
	/**
	 * Name
	 * Room name Standard, Suite .e.t.c.
	 */
	name?: string | null;
	/**
	 * Description
	 * Room description
	 */
	description?: string | null;
	expenses?: FixedChargeOutput | null;
}

/**
 * HousingRoomPubSchema
 * One room, charge stripped. Flat across both room shapes the operator
 * stores: categorised rooms carry ``typ``/``pax``, per-room ones carry
 * ``name``/``description``.
 */
export interface HousingRoomPubSchema {
	typ?: HousingRoomTypes | null;
	/** Pax */
	pax?: number | null;
	/** Name */
	name?: string | null;
	/** Description */
	description?: string | null;
}

/** HousingRoomSchema */
export interface HousingRoomSchemaInput {
	typ?: HousingRoomTypes | null;
	/** Pax */
	pax?: number | null;
	/** Charge for this room of this category. */
	expenses?: FixedChargeInput | null;
}

/** HousingRoomSchema */
export interface HousingRoomSchemaOutput {
	typ?: HousingRoomTypes | null;
	/** Pax */
	pax?: number | null;
	/** Charge for this room of this category. */
	expenses?: FixedChargeOutput | null;
}

/** HousingSingleEvent */
export interface HousingSingleEventInput {
	/**
	 * Day
	 * Event's day number in a tour
	 */
	day: number;
	/**
	 * Position
	 * Event's order number in a tour
	 * @min 0
	 */
	position: number;
	/**
	 * Is Optional
	 * @default false
	 */
	is_optional?: boolean;
	/**
	 * Images
	 * Images of the event slot, primary first; populated on read, ignored on write.
	 */
	images?: EventImageSchema[];
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "housing"
	 */
	typ?: "housing";
	details?: HousingDetailsSchemaInput | null;
}

/** HousingSingleEvent */
export interface HousingSingleEventOutput {
	/**
	 * Day
	 * Event's day number in a tour
	 */
	day: number;
	/**
	 * Position
	 * Event's order number in a tour
	 * @min 0
	 */
	position: number;
	/**
	 * Is Optional
	 * @default false
	 */
	is_optional?: boolean;
	/**
	 * Images
	 * Images of the event slot, primary first; populated on read, ignored on write.
	 */
	images?: EventImageSchema[];
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "housing"
	 */
	typ?: "housing";
	details?: HousingDetailsSchemaOutput | null;
}

/** InformationEvent */
export interface InformationEventInput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "ref"
	 */
	typ?: "ref";
	details?: EmptyDetails | null;
}

/** InformationEvent */
export interface InformationEventOutput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "ref"
	 */
	typ?: "ref";
	details?: EmptyDetails | null;
}

/** InformationEventPubRead */
export interface InformationEventPubReadInput {
	/** Name */
	name?: string | null;
	/** Description */
	description?: string | null;
	/** Day */
	day?: number | null;
	/** Position */
	position?: number | null;
	/** Is Optional */
	is_optional?: boolean | null;
	/** Images */
	images?: EventImagePubSchema[];
	/**
	 * Date
	 * Calendar date this event falls on, computed as the booking's departure date plus ``day - 1``. Null in the catalogue, where a template tour has no departure date to anchor against.
	 */
	date?: string | null;
	/**
	 * Typ
	 * @default "ref"
	 */
	typ?: "ref";
	details?: EmptyDetailsPub | null;
}

/** InformationEventPubRead */
export interface InformationEventPubReadOutput {
	/** Name */
	name?: string | null;
	/** Description */
	description?: string | null;
	/** Day */
	day?: number | null;
	/** Position */
	position?: number | null;
	/** Is Optional */
	is_optional?: boolean | null;
	/** Images */
	images?: EventImagePubSchema[];
	/**
	 * Date
	 * Calendar date this event falls on, computed as the booking's departure date plus ``day - 1``. Null in the catalogue, where a template tour has no departure date to anchor against.
	 */
	date?: string | null;
	/**
	 * Typ
	 * @default "ref"
	 */
	typ?: "ref";
	details?: EmptyDetailsPub | null;
}

/** InformationEventTypeRead */
export interface InformationEventTypeReadInput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "ref"
	 */
	typ?: "ref";
	details?: EmptyDetails | null;
	/**
	 * Id
	 * Option (alternative) id; populated on read, ignored on write.
	 */
	id?: string | null;
}

/** InformationEventTypeRead */
export interface InformationEventTypeReadOutput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "ref"
	 */
	typ?: "ref";
	details?: EmptyDetails | null;
	/**
	 * Id
	 * Option (alternative) id; populated on read, ignored on write.
	 */
	id?: string | null;
}

/** InformationSingleEvent */
export interface InformationSingleEventInput {
	/**
	 * Day
	 * Event's day number in a tour
	 */
	day: number;
	/**
	 * Position
	 * Event's order number in a tour
	 * @min 0
	 */
	position: number;
	/**
	 * Is Optional
	 * @default false
	 */
	is_optional?: boolean;
	/**
	 * Images
	 * Images of the event slot, primary first; populated on read, ignored on write.
	 */
	images?: EventImageSchema[];
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "ref"
	 */
	typ?: "ref";
	details?: EmptyDetails | null;
}

/** InformationSingleEvent */
export interface InformationSingleEventOutput {
	/**
	 * Day
	 * Event's day number in a tour
	 */
	day: number;
	/**
	 * Position
	 * Event's order number in a tour
	 * @min 0
	 */
	position: number;
	/**
	 * Is Optional
	 * @default false
	 */
	is_optional?: boolean;
	/**
	 * Images
	 * Images of the event slot, primary first; populated on read, ignored on write.
	 */
	images?: EventImageSchema[];
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "ref"
	 */
	typ?: "ref";
	details?: EmptyDetails | null;
}

/** InvoiceDetailResponse */
export interface InvoiceDetailResponse {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Invoice Number */
	invoice_number: string;
	/** Booking Id */
	booking_id: string | null;
	/** Order Number */
	order_number: string | null;
	typ: InvoiceType;
	status: InvoiceStatus;
	/**
	 * Amount
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	amount: string;
	/** Currency */
	currency: string;
	/**
	 * Total
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	total: string;
	/**
	 * Paid Amount
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	paid_amount: string;
	/**
	 * Balance
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	balance: string;
	/** Issued At */
	issued_at: string | null;
	/** Payment Details */
	payment_details?:
		| (
				| ({
						typ: "classic_swift";
				  } & ClassicSwiftDetails)
				| ({
						typ: "custom";
				  } & CustomDetails)
		  )
		| null;
}

/** InvoiceGenerate */
export interface InvoiceGenerate {
	/**
	 * Booking Id
	 * @format uuid
	 */
	booking_id: string;
	/**
	 * Payment Route Id
	 * @format uuid
	 */
	payment_route_id: string;
}

/** InvoiceListItem */
export interface InvoiceListItem {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Booking Id */
	booking_id: string | null;
	typ: InvoiceType;
	status: InvoiceStatus;
	/** Total Amount */
	total_amount: number;
	/** Paid Amount */
	paid_amount: number;
	/** Currency */
	currency: string;
	/** Issue Date */
	issue_date: string | null;
	/** Counterparty Name */
	counterparty_name: string | null;
	/** Invoice Number */
	invoice_number: string;
	/** Order Number */
	order_number: string | null;
}

/** InvoiceListResponse */
export interface InvoiceListResponse {
	/** Total Count */
	total_count: number;
	/** Data */
	data: InvoiceListItem[];
}

/** InvoicePaymentCreate */
export interface InvoicePaymentCreate {
	/** Amount */
	amount: number | string;
	/** @default "wire" */
	method?: PaymentMethod;
}

/** InvoicePdfResponse */
export interface InvoicePdfResponse {
	/** Url */
	url: string;
}

/** KeyValItem */
export interface KeyValItem {
	/** Key */
	key?: string | null;
	/** Val */
	val?: string | null;
}

/** LandingPageImageModel */
export interface LandingPageImageModel {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/**
	 * Landing Page Id
	 * @format uuid
	 */
	landing_page_id: string;
	/** Image Path */
	image_path: string;
	/** Is Primary */
	is_primary: boolean;
}

/** LandingPageImagePubSchema */
export interface LandingPageImagePubSchema {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Image Url */
	image_url: string;
	/** Is Primary */
	is_primary: boolean;
}

/** LandingPagePubSchema */
export interface LandingPagePubSchema {
	/** Title */
	title: string | null;
	/** Overview */
	overview: string | null;
	/** Description */
	description: string | null;
	/** Overview Description */
	overview_description: string | null;
	/** Pickup Description */
	pickup_description: string | null;
	/** Additional Information */
	additional_information: string | null;
	/** Cancellation Policy */
	cancellation_policy: string | null;
	/** Languages */
	languages: LanguageCode[];
	/** Pickup Type */
	pickup_type: PickupType[];
	/** Amenities Included */
	amenities_included: string[];
	/** Amenities Not Included */
	amenities_not_included: string[];
	/** Images */
	images: LandingPageImagePubSchema[];
}

/** LandingPageResponse */
export interface LandingPageResponse {
	/** Title */
	title?: string | null;
	/** Overview */
	overview?: string | null;
	/** Description */
	description?: string | null;
	/** Overview Description */
	overview_description?: string | null;
	/** Pickup Description */
	pickup_description?: string | null;
	/** Cancellation Policy */
	cancellation_policy?: string | null;
	/** Additional Information */
	additional_information?: string | null;
	/** Pickup Type */
	pickup_type?: PickupType[];
	/** Amenities Included */
	amenities_included?: string[];
	/** Amenities Not Included */
	amenities_not_included?: string[];
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Languages */
	languages: LanguageCode[];
	/** Created At */
	created_at?: string | null;
	/** Updated At */
	updated_at?: string | null;
}

/** LandingPageUpdate */
export interface LandingPageUpdate {
	/** Title */
	title?: string | null;
	/** Overview */
	overview?: string | null;
	/** Description */
	description?: string | null;
	/** Overview Description */
	overview_description?: string | null;
	/** Pickup Description */
	pickup_description?: string | null;
	/** Cancellation Policy */
	cancellation_policy?: string | null;
	/** Additional Information */
	additional_information?: string | null;
	/** Pickup Type */
	pickup_type?: PickupType[] | null;
	/** Amenities Included */
	amenities_included?: string[] | null;
	/** Amenities Not Included */
	amenities_not_included?: string[] | null;
}

/** LedgerEntryListResponse */
export interface LedgerEntryListResponse {
	/** Total Count */
	total_count: number;
	/** Data */
	data: LedgerEntryResponseOutput[];
}

/**
 * LedgerEntryResponse
 * ``flow`` is derived, not stored: ``INBOUND`` when the operator is the
 * payee, ``OUTBOUND`` when they are the payer, ``None`` for an entry between
 * two other participants that the operator's books merely observe.
 */
export interface LedgerEntryResponseInput {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/**
	 * Operator Id
	 * @format uuid
	 */
	operator_id: string;
	/** Booking Id */
	booking_id: string | null;
	/** Order Number */
	order_number: string | null;
	/** Snapshot Event Id */
	snapshot_event_id: string | null;
	/**
	 * ``ACCRUAL`` is what was agreed and is now owed; ``SETTLEMENT`` is cash
	 * that actually moved. Debt is the difference between the two.
	 *
	 * There is exactly one accrual per source row and it is restated in place as
	 * the operator edits the agreed figure. Settlements accumulate — an invoice
	 * paid in three instalments posts three of them.
	 */
	typ: LedgerEntryType;
	/**
	 * One end of an entry. ``OPERATOR`` is a party like any other, not an
	 * implied centre — that is what lets a future entry record an agency paying a
	 * supplier directly, with the operator's books merely observing it.
	 */
	payer_typ: LedgerParty;
	/** Payer Id */
	payer_id: string | null;
	/**
	 * One end of an entry. ``OPERATOR`` is a party like any other, not an
	 * implied centre — that is what lets a future entry record an agency paying a
	 * supplier directly, with the operator's books merely observing it.
	 */
	payee_typ: LedgerParty;
	/** Payee Id */
	payee_id: string | null;
	flow: LedgerFlow | null;
	/** Amount */
	amount: number | string;
	currency: Currency;
	/** Rate */
	rate: number | string;
	/** Base Amount */
	base_amount: number | string;
	/**
	 * Which rail produced the entry. Bank, card and SWIFT rails append their
	 * own members here; the posting contract does not change.
	 */
	source: LedgerSource;
	/** Source Id */
	source_id: string | null;
	/**
	 * Occurred At
	 * @format date-time
	 */
	occurred_at: string;
	/** Note */
	note: string | null;
}

/**
 * LedgerEntryResponse
 * ``flow`` is derived, not stored: ``INBOUND`` when the operator is the
 * payee, ``OUTBOUND`` when they are the payer, ``None`` for an entry between
 * two other participants that the operator's books merely observe.
 */
export interface LedgerEntryResponseOutput {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/**
	 * Operator Id
	 * @format uuid
	 */
	operator_id: string;
	/** Booking Id */
	booking_id: string | null;
	/** Order Number */
	order_number: string | null;
	/** Snapshot Event Id */
	snapshot_event_id: string | null;
	/**
	 * ``ACCRUAL`` is what was agreed and is now owed; ``SETTLEMENT`` is cash
	 * that actually moved. Debt is the difference between the two.
	 *
	 * There is exactly one accrual per source row and it is restated in place as
	 * the operator edits the agreed figure. Settlements accumulate — an invoice
	 * paid in three instalments posts three of them.
	 */
	typ: LedgerEntryType;
	/**
	 * One end of an entry. ``OPERATOR`` is a party like any other, not an
	 * implied centre — that is what lets a future entry record an agency paying a
	 * supplier directly, with the operator's books merely observing it.
	 */
	payer_typ: LedgerParty;
	/** Payer Id */
	payer_id: string | null;
	/**
	 * One end of an entry. ``OPERATOR`` is a party like any other, not an
	 * implied centre — that is what lets a future entry record an agency paying a
	 * supplier directly, with the operator's books merely observing it.
	 */
	payee_typ: LedgerParty;
	/** Payee Id */
	payee_id: string | null;
	flow: LedgerFlow | null;
	/**
	 * Amount
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	amount: string;
	currency: Currency;
	/**
	 * Rate
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	rate: string;
	/**
	 * Base Amount
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	base_amount: string;
	/**
	 * Which rail produced the entry. Bank, card and SWIFT rails append their
	 * own members here; the posting contract does not change.
	 */
	source: LedgerSource;
	/** Source Id */
	source_id: string | null;
	/**
	 * Occurred At
	 * @format date-time
	 */
	occurred_at: string;
	/** Note */
	note: string | null;
}

/** LocationInSchema */
export interface LocationInSchema {
	/**
	 * Lat
	 * The latitude of the location in decimal degrees (-90 to 90).
	 * @min -90
	 * @max 90
	 */
	lat: number;
	/**
	 * Long
	 * The longitude of the location in decimal degrees (-180 to 180).
	 * @min -180
	 * @max 180
	 */
	long: number;
}

/** LocationOutSchema */
export interface LocationOutSchema {
	/**
	 * Id
	 * Stored location id; send it back to reuse this location.
	 */
	id?: string | null;
	lang: LanguageCode;
	/** City */
	city?: string | null;
	/** Address */
	address?: string | null;
	/**
	 * Lat
	 * The latitude of the location in decimal degrees (-90 to 90).
	 * @min -90
	 * @max 90
	 */
	lat: number;
	/**
	 * Long
	 * The longitude of the location in decimal degrees (-180 to 180).
	 * @min -180
	 * @max 180
	 */
	long: number;
}

/** LocationRebuildResponse */
export interface LocationRebuildResponse {
	state: RebuildState;
}

/** LocationRefSchema */
export interface LocationRefSchema {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
}

/** LocationSuggestionSchema */
export interface LocationSuggestionSchema {
	/** Value */
	value: string;
	kind: SuggestKind;
	/** City */
	city?: string | null;
}

/** MeSchema */
export interface MeSchema {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Email */
	email: string;
	/** Role */
	role: string;
	/** Picture */
	picture?: string | null;
	/** Agency Id */
	agency_id?: string | null;
	/** Operator Id */
	operator_id?: string | null;
}

/**
 * MonetaryValueSchema
 * Monetary value pair.
 *
 * Conversion happens inside the schema but takes an explicit ``FxContext``
 * — no module-level rate singleton. Same-currency ``convert`` is a cheap
 * ``return self``; cross-currency requires a matching entry in
 * ``fx.rates`` and applies ``val * rate``.
 *
 * Arithmetic operators stay same-currency-only on purpose: event calc
 * normalizes every leaf to ``fx.target`` via ``convert`` before summing,
 * so same-currency is always satisfied and the guards catch anything that
 * slips through.
 */
export interface MonetaryValueSchema {
	/**
	 * Val
	 * The total monetary value.
	 * @min 0
	 */
	val: number;
	/** @default "USD" */
	currency?: Currency;
}

/** MoveToMultiResult */
export interface MoveToMultiResult {
	target_event: TourEventResponse;
	/**
	 * Removed Event Id
	 * @format uuid
	 */
	removed_event_id: string;
}

/** MoveToMultiSchema */
export interface MoveToMultiSchema {
	/**
	 * Option Position
	 * Insert index among the target's alternatives, clamped to last.
	 * @min 0
	 */
	option_position: number;
}

/** MoveToSingleResult */
export interface MoveToSingleResult {
	new_event: TourEventResponse;
	source_event: TourEventResponse;
}

/** MultiEvent */
export interface MultiEvent {
	/**
	 * Day
	 * Event's day number in a tour
	 */
	day: number;
	/**
	 * Position
	 * Event's order number in a tour
	 * @min 0
	 */
	position: number;
	/**
	 * Is Optional
	 * @default false
	 */
	is_optional?: boolean;
	/**
	 * Images
	 * Images of the event slot, primary first; populated on read, ignored on write.
	 */
	images?: EventImageSchema[];
	/** Typ */
	typ: "options";
	/** Details */
	details?:
		| (
				| ({
						typ: "activity";
				  } & ActivityEventInput)
				| ({
						typ: "bus";
				  } & BusEventInput)
				| ({
						typ: "flight";
				  } & FlightEventInput)
				| ({
						typ: "guide";
				  } & GuideEventInput)
				| ({
						typ: "housing";
				  } & HousingEventInput)
				| ({
						typ: "ref";
				  } & InformationEventInput)
				| ({
						typ: "supplementary";
				  } & SupplementaryEventInput)
				| ({
						typ: "train";
				  } & TrainEventInput)
				| ({
						typ: "transfer";
				  } & TransferEventInput)
		  )[]
		| null;
}

/** MultiEventPub */
export interface MultiEventPubInput {
	/** Name */
	name?: string | null;
	/** Description */
	description?: string | null;
	/** Day */
	day?: number | null;
	/** Position */
	position?: number | null;
	/** Is Optional */
	is_optional?: boolean | null;
	/** Images */
	images?: EventImagePubSchema[];
	/**
	 * Date
	 * Calendar date this event falls on, computed as the booking's departure date plus ``day - 1``. Null in the catalogue, where a template tour has no departure date to anchor against.
	 */
	date?: string | null;
	/** Typ */
	typ: "options";
	/** Details */
	details?:
		| (
				| ({
						typ: "activity";
				  } & ActivityEventPubReadInput)
				| ({
						typ: "bus";
				  } & BusEventPubReadInput)
				| ({
						typ: "flight";
				  } & FlightEventPubReadInput)
				| ({
						typ: "housing";
				  } & HousingEventPubReadInput)
				| ({
						typ: "ref";
				  } & InformationEventPubReadInput)
				| ({
						typ: "train";
				  } & TrainEventPubReadInput)
				| ({
						typ: "transfer";
				  } & TransferEventPubReadInput)
		  )[]
		| null;
}

/** MultiEventPub */
export interface MultiEventPubOutput {
	/** Name */
	name?: string | null;
	/** Description */
	description?: string | null;
	/** Day */
	day?: number | null;
	/** Position */
	position?: number | null;
	/** Is Optional */
	is_optional?: boolean | null;
	/** Images */
	images?: EventImagePubSchema[];
	/**
	 * Date
	 * Calendar date this event falls on, computed as the booking's departure date plus ``day - 1``. Null in the catalogue, where a template tour has no departure date to anchor against.
	 */
	date?: string | null;
	/** Typ */
	typ: "options";
	/** Details */
	details?:
		| (
				| ({
						typ: "activity";
				  } & ActivityEventPubReadOutput)
				| ({
						typ: "bus";
				  } & BusEventPubReadOutput)
				| ({
						typ: "flight";
				  } & FlightEventPubReadOutput)
				| ({
						typ: "housing";
				  } & HousingEventPubReadOutput)
				| ({
						typ: "ref";
				  } & InformationEventPubReadOutput)
				| ({
						typ: "train";
				  } & TrainEventPubReadOutput)
				| ({
						typ: "transfer";
				  } & TransferEventPubReadOutput)
		  )[]
		| null;
}

/**
 * MultiEventRead
 * Alternatives as stored: each carries its own id, none carry day/position
 * (those live on the slot).
 */
export interface MultiEventReadInput {
	/**
	 * Day
	 * Event's day number in a tour
	 */
	day: number;
	/**
	 * Position
	 * Event's order number in a tour
	 * @min 0
	 */
	position: number;
	/**
	 * Is Optional
	 * @default false
	 */
	is_optional?: boolean;
	/**
	 * Images
	 * Images of the event slot, primary first; populated on read, ignored on write.
	 */
	images?: EventImageSchema[];
	/** Typ */
	typ: "options";
	/** Details */
	details?:
		| (
				| ({
						typ: "activity";
				  } & ActivityEventTypeReadInput)
				| ({
						typ: "bus";
				  } & BusEventTypeReadInput)
				| ({
						typ: "flight";
				  } & FlightEventTypeReadInput)
				| ({
						typ: "guide";
				  } & GuideEventTypeReadInput)
				| ({
						typ: "housing";
				  } & HousingEventTypeReadInput)
				| ({
						typ: "ref";
				  } & InformationEventTypeReadInput)
				| ({
						typ: "supplementary";
				  } & SupplementaryEventTypeReadInput)
				| ({
						typ: "train";
				  } & TrainEventTypeReadInput)
				| ({
						typ: "transfer";
				  } & TransferEventTypeReadInput)
		  )[]
		| null;
}

/**
 * MultiEventRead
 * Alternatives as stored: each carries its own id, none carry day/position
 * (those live on the slot).
 */
export interface MultiEventReadOutput {
	/**
	 * Day
	 * Event's day number in a tour
	 */
	day: number;
	/**
	 * Position
	 * Event's order number in a tour
	 * @min 0
	 */
	position: number;
	/**
	 * Is Optional
	 * @default false
	 */
	is_optional?: boolean;
	/**
	 * Images
	 * Images of the event slot, primary first; populated on read, ignored on write.
	 */
	images?: EventImageSchema[];
	/** Typ */
	typ: "options";
	/** Details */
	details?:
		| (
				| ({
						typ: "activity";
				  } & ActivityEventTypeReadOutput)
				| ({
						typ: "bus";
				  } & BusEventTypeReadOutput)
				| ({
						typ: "flight";
				  } & FlightEventTypeReadOutput)
				| ({
						typ: "guide";
				  } & GuideEventTypeReadOutput)
				| ({
						typ: "housing";
				  } & HousingEventTypeReadOutput)
				| ({
						typ: "ref";
				  } & InformationEventTypeReadOutput)
				| ({
						typ: "supplementary";
				  } & SupplementaryEventTypeReadOutput)
				| ({
						typ: "train";
				  } & TrainEventTypeReadOutput)
				| ({
						typ: "transfer";
				  } & TransferEventTypeReadOutput)
		  )[]
		| null;
}

/** MyAccountRead */
export interface MyAccountRead {
	/** Email */
	email: string;
	/** First Name */
	first_name: string | null;
	/** Last Name */
	last_name: string | null;
	/** Title */
	title: string | null;
	/** Phone Number */
	phone_number: string | null;
	/** Location */
	location: string | null;
	/** Profile Picture Path */
	profile_picture_path: string | null;
	default_currency: Currency;
}

/** OperatorCreateSchema */
export interface OperatorCreateSchema {
	/** Name */
	name: string;
}

/** OperatorFilesModel */
export interface OperatorFilesModel {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/**
	 * Operator Id
	 * @format uuid
	 */
	operator_id: string;
	/** Url */
	url: string;
	/** File Name */
	file_name: string;
}

/** OperatorFinancialSettingsRead */
export interface OperatorFinancialSettingsRead {
	default_currency: Currency;
	/** Vat Enabled */
	vat_enabled: boolean;
	/**
	 * Vat Rate
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	vat_rate: string;
	/** Profit Tax Enabled */
	profit_tax_enabled: boolean;
	/**
	 * Profit Tax Rate
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	profit_tax_rate: string;
	/**
	 * Default Markup
	 * The markup calculation strategy.
	 */
	default_markup:
		| ({
				typ: "fixed";
		  } & FixedExpenseOutput)
		| ({
				typ: "percentage";
		  } & PercentageMarkup);
	/**
	 * Default Staff Commission
	 * The markup calculation strategy.
	 */
	default_staff_commission:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseOutput)
				| ({
						typ: "percentage";
				  } & PercentageMarkup)
		  )
		| null;
}

/** OperatorFinancialSettingsUpdate */
export interface OperatorFinancialSettingsUpdate {
	default_currency?: Currency | null;
	/** Vat Enabled */
	vat_enabled?: boolean | null;
	/** Vat Rate */
	vat_rate?: number | string | null;
	/** Profit Tax Enabled */
	profit_tax_enabled?: boolean | null;
	/** Profit Tax Rate */
	profit_tax_rate?: number | string | null;
	/**
	 * Default Markup
	 * The markup calculation strategy.
	 */
	default_markup?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseInput)
				| ({
						typ: "percentage";
				  } & PercentageMarkup)
		  )
		| null;
	/**
	 * Default Staff Commission
	 * The markup calculation strategy.
	 */
	default_staff_commission?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseInput)
				| ({
						typ: "percentage";
				  } & PercentageMarkup)
		  )
		| null;
}

/**
 * OperatorFxRateModel
 * Append-only FX rate ledger per operator.
 *
 * See ``src/operator/fx_rate/__init__.py`` for the append-only convention.
 * The column type for ``from_currency`` / ``to_currency`` stays ``String(3)``;
 * only the Python ``Mapped[...]`` annotation is the ``Currency`` StrEnum.
 */
export interface OperatorFxRateModel {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/**
	 * Operator Id
	 * @format uuid
	 */
	operator_id: string;
	from_currency: Currency;
	to_currency: Currency;
	/**
	 * Rate
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	rate: string;
	/**
	 * Valid From
	 * @format date-time
	 */
	valid_from: string;
	/** Created By */
	created_by: string | null;
}

/** OperatorInfoModel */
export interface OperatorInfoModel {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/**
	 * Operator Id
	 * @format uuid
	 */
	operator_id: string;
	/** Logo Path */
	logo_path: string | null;
	/** Description */
	description: string | null;
	/** Default Language */
	default_language: string;
	/** Business Name */
	business_name: string | null;
	/** Website Url */
	website_url: string | null;
	/** Legal Name */
	legal_name: string | null;
	/** Director Name */
	director_name: string | null;
	/** Tax Id */
	tax_id: string | null;
	/** Contact Person */
	contact_person: string | null;
	/** Contact Position */
	contact_position: string | null;
	/** Contact Email */
	contact_email: string | null;
	/** Contact Phone */
	contact_phone: string | null;
	/** Address Line */
	address_line: string | null;
	/** City */
	city: string | null;
	/** Country */
	country: string | null;
}

/** OperatorInfoUpdate */
export interface OperatorInfoUpdate {
	/** Description */
	description?: string | null;
	/** Business Name */
	business_name?: string | null;
	/** Website Url */
	website_url?: string | null;
	/** Legal Name */
	legal_name?: string | null;
	/** Director Name */
	director_name?: string | null;
	/** Tax Id */
	tax_id?: string | null;
	/** Contact Person */
	contact_person?: string | null;
	/** Contact Position */
	contact_position?: string | null;
	/** Contact Email */
	contact_email?: string | null;
	/** Contact Phone */
	contact_phone?: string | null;
	/** Address Line */
	address_line?: string | null;
	/** City */
	city?: string | null;
	/** Country */
	country?: string | null;
}

/**
 * OperatorItineraryEvent
 * One booking event as the operator sees it: the full ``AnyEventRead`` with
 * every monetary field intact — the opposite of ``AnyEventPub``, which the
 * agency-facing itinerary uses.
 *
 * ``date`` lives on this wrapper rather than inside ``event`` because the
 * operator event schemas are the *write* shape persisted to JSONB; giving them
 * calendar fields would let a client pin a date onto a reusable tour template.
 * It resolves to ``booking.date + (day - 1)``.
 *
 * ``cost`` / ``markup`` / ``fees`` are this event's own share of the booking
 * price, priced off the frozen snapshot at the booking's pax and currency. They
 * read ``0`` when ``billed_via_package_id`` is set — the package is billed once
 * at the booking level instead — and when the event is DESELECTED.
 */
export interface OperatorItineraryEventInput {
	/**
	 * Event Id
	 * @format uuid
	 */
	event_id: string;
	/** Tour Option Id */
	tour_option_id?: string | null;
	/**
	 * Date
	 * @format date
	 */
	date: string;
	/** Event */
	event:
		| (
				| ({
						typ: "activity";
				  } & ActivitySingleEventInput)
				| ({
						typ: "bus";
				  } & BusSingleEventInput)
				| ({
						typ: "flight";
				  } & FlightSingleEventInput)
				| ({
						typ: "guide";
				  } & GuideSingleEventInput)
				| ({
						typ: "housing";
				  } & HousingSingleEventInput)
				| ({
						typ: "ref";
				  } & InformationSingleEventInput)
				| ({
						typ: "supplementary";
				  } & SupplementarySingleEventInput)
				| ({
						typ: "train";
				  } & TrainSingleEventInput)
				| ({
						typ: "transfer";
				  } & TransferSingleEventInput)
		  )
		| MultiEventReadInput;
	availability?: AvailabilityStatus | null;
	/** Selected Option Index */
	selected_option_index?: number | null;
	guide_typ?: GuideType | null;
	/** Billed Via Package Id */
	billed_via_package_id?: string | null;
	cost: TourMinMaxCostSchemaInput;
	markup: TourMinMaxCostSchemaInput;
	fees: TourMinMaxCostSchemaInput;
}

/**
 * OperatorItineraryEvent
 * One booking event as the operator sees it: the full ``AnyEventRead`` with
 * every monetary field intact — the opposite of ``AnyEventPub``, which the
 * agency-facing itinerary uses.
 *
 * ``date`` lives on this wrapper rather than inside ``event`` because the
 * operator event schemas are the *write* shape persisted to JSONB; giving them
 * calendar fields would let a client pin a date onto a reusable tour template.
 * It resolves to ``booking.date + (day - 1)``.
 *
 * ``cost`` / ``markup`` / ``fees`` are this event's own share of the booking
 * price, priced off the frozen snapshot at the booking's pax and currency. They
 * read ``0`` when ``billed_via_package_id`` is set — the package is billed once
 * at the booking level instead — and when the event is DESELECTED.
 */
export interface OperatorItineraryEventOutput {
	/**
	 * Event Id
	 * @format uuid
	 */
	event_id: string;
	/** Tour Option Id */
	tour_option_id?: string | null;
	/**
	 * Date
	 * @format date
	 */
	date: string;
	/** Event */
	event:
		| (
				| ({
						typ: "activity";
				  } & ActivitySingleEventOutput)
				| ({
						typ: "bus";
				  } & BusSingleEventOutput)
				| ({
						typ: "flight";
				  } & FlightSingleEventOutput)
				| ({
						typ: "guide";
				  } & GuideSingleEventOutput)
				| ({
						typ: "housing";
				  } & HousingSingleEventOutput)
				| ({
						typ: "ref";
				  } & InformationSingleEventOutput)
				| ({
						typ: "supplementary";
				  } & SupplementarySingleEventOutput)
				| ({
						typ: "train";
				  } & TrainSingleEventOutput)
				| ({
						typ: "transfer";
				  } & TransferSingleEventOutput)
		  )
		| MultiEventReadOutput;
	availability?: AvailabilityStatus | null;
	/** Selected Option Index */
	selected_option_index?: number | null;
	guide_typ?: GuideType | null;
	/** Billed Via Package Id */
	billed_via_package_id?: string | null;
	cost: TourMinMaxCostSchemaOutput;
	markup: TourMinMaxCostSchemaOutput;
	fees: TourMinMaxCostSchemaOutput;
}

/**
 * OperatorItineraryPackage
 * A package billed once for the whole booking, listed separately so the sum
 * of the event lines plus the package lines reconciles to the totals.
 */
export interface OperatorItineraryPackageInput {
	/**
	 * Package Id
	 * @format uuid
	 */
	package_id: string;
	/** Name */
	name: string;
	cost: TourMinMaxCostSchemaInput;
	markup: TourMinMaxCostSchemaInput;
	fees: TourMinMaxCostSchemaInput;
}

/**
 * OperatorItineraryPackage
 * A package billed once for the whole booking, listed separately so the sum
 * of the event lines plus the package lines reconciles to the totals.
 */
export interface OperatorItineraryPackageOutput {
	/**
	 * Package Id
	 * @format uuid
	 */
	package_id: string;
	/** Name */
	name: string;
	cost: TourMinMaxCostSchemaOutput;
	markup: TourMinMaxCostSchemaOutput;
	fees: TourMinMaxCostSchemaOutput;
}

/**
 * OperatorItineraryResponse
 * Cost-bearing itinerary for the operator's order reconciliation board.
 *
 * Events are the canonical (operator-language) snapshot copy — the same one
 * revision edits and the invoice price against — so figures here match what the
 * booking will be billed. ``display_lang`` is what the agency sees, for
 * reference only.
 *
 * Totals are pre-FOC, matching ``TourSummaryResponse`` semantics; FOC discounts
 * agency revenue only and never supplier cost, so ``cost`` is unaffected.
 */
export interface OperatorItineraryResponse {
	/**
	 * Booking Id
	 * @format uuid
	 */
	booking_id: string;
	/** Order Number */
	order_number: string;
	/**
	 * Date
	 * @format date
	 */
	date: string;
	/** Pax */
	pax: number;
	currency: Currency;
	display_lang: LanguageCode;
	/** Events */
	events: OperatorItineraryEventOutput[];
	/** Packages */
	packages: OperatorItineraryPackageOutput[];
	cost: TourMinMaxCostSchemaOutput;
	markup: TourMinMaxCostSchemaOutput;
	fees: TourMinMaxCostSchemaOutput;
	total: TourMinMaxCostSchemaOutput;
}

/** OperatorModel */
export interface OperatorModel {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Name */
	name: string;
}

/** OperatorPaymentRouteModel */
export interface OperatorPaymentRouteModel {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/**
	 * Operator Id
	 * @format uuid
	 */
	operator_id: string;
	/** Internal Label */
	internal_label: string;
	currency: Currency;
	/** Note */
	note: string | null;
	/** Details */
	details:
		| ({
				typ: "classic_swift";
		  } & ClassicSwiftDetails)
		| ({
				typ: "custom";
		  } & CustomDetails);
}

/** OperatorPreviewPubSchema */
export interface OperatorPreviewPubSchema {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Business Name */
	business_name: string | null;
	/** Description */
	description: string | null;
	/** Website Url */
	website_url: string | null;
	/** Contact Email */
	contact_email: string | null;
	/** Contact Phone */
	contact_phone: string | null;
	/** Address Line */
	address_line: string | null;
	/** City */
	city: string | null;
	/** Country */
	country: string | null;
	/** Logo Url */
	logo_url: string | null;
}

/** OptionReorderSchema */
export interface OptionReorderSchema {
	/**
	 * Order
	 * New sequence of the event's current 0-based option positions.
	 * @minItems 2
	 */
	order: number[];
}

/** OrderAgencyInfo */
export interface OrderAgencyInfo {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Name */
	name: string;
	/** Business Name */
	business_name?: string | null;
	/** Legal Name */
	legal_name?: string | null;
	/** Director Name */
	director_name?: string | null;
	/** Contact Person */
	contact_person?: string | null;
	/** Contact Position */
	contact_position?: string | null;
	/** Contact Email */
	contact_email?: string | null;
	/** Contact Phone */
	contact_phone?: string | null;
	/** Tax Id */
	tax_id?: string | null;
	/** Address Line */
	address_line?: string | null;
	/** City */
	city?: string | null;
	/** Country */
	country?: string | null;
	/** Website Url */
	website_url?: string | null;
	/** Description */
	description?: string | null;
	/** Logo Url */
	logo_url?: string | null;
}

/**
 * OrderOperatorInfo
 * Who to contact about this booking — the operator running the tour. Joined
 * into the listing rather than fetched per row so an agency or tourist can reach
 * the right person without a follow-up call per booking. Every field but ``id``
 * and ``name`` lives on ``operator_info``, which an operator may not have filled
 * in yet.
 */
export interface OrderOperatorInfo {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Name */
	name: string;
	/** Business Name */
	business_name?: string | null;
	/** Contact Person */
	contact_person?: string | null;
	/** Contact Position */
	contact_position?: string | null;
	/** Contact Email */
	contact_email?: string | null;
	/** Contact Phone */
	contact_phone?: string | null;
	/** Website Url */
	website_url?: string | null;
	/** Logo Url */
	logo_url?: string | null;
}

/**
 * OrderTourEventSchema
 * A snapshot event: the operator ``TourEventResponse`` plus the booking-only
 * ``origin_event_id`` that pairs a canonical event with its localized twin
 * (``events`` ↔ ``events_localized``). Kept out of the operator response so that
 * surface stays free of this booking concern.
 */
export interface OrderTourEventSchemaInput {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Tour Option Id */
	tour_option_id: string | null;
	/** Event */
	event:
		| (
				| ({
						typ: "activity";
				  } & ActivitySingleEventInput)
				| ({
						typ: "bus";
				  } & BusSingleEventInput)
				| ({
						typ: "flight";
				  } & FlightSingleEventInput)
				| ({
						typ: "guide";
				  } & GuideSingleEventInput)
				| ({
						typ: "housing";
				  } & HousingSingleEventInput)
				| ({
						typ: "ref";
				  } & InformationSingleEventInput)
				| ({
						typ: "supplementary";
				  } & SupplementarySingleEventInput)
				| ({
						typ: "train";
				  } & TrainSingleEventInput)
				| ({
						typ: "transfer";
				  } & TransferSingleEventInput)
		  )
		| MultiEventReadInput;
	/** Image Paths */
	image_paths?: string[];
	/** Primary Image Path */
	primary_image_path?: string | null;
	/** @default "source" */
	translation?: TranslationState;
	/** Origin Event Id */
	origin_event_id?: string | null;
}

/**
 * OrderTourEventSchema
 * A snapshot event: the operator ``TourEventResponse`` plus the booking-only
 * ``origin_event_id`` that pairs a canonical event with its localized twin
 * (``events`` ↔ ``events_localized``). Kept out of the operator response so that
 * surface stays free of this booking concern.
 */
export interface OrderTourEventSchemaOutput {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Tour Option Id */
	tour_option_id: string | null;
	/** Event */
	event:
		| (
				| ({
						typ: "activity";
				  } & ActivitySingleEventOutput)
				| ({
						typ: "bus";
				  } & BusSingleEventOutput)
				| ({
						typ: "flight";
				  } & FlightSingleEventOutput)
				| ({
						typ: "guide";
				  } & GuideSingleEventOutput)
				| ({
						typ: "housing";
				  } & HousingSingleEventOutput)
				| ({
						typ: "ref";
				  } & InformationSingleEventOutput)
				| ({
						typ: "supplementary";
				  } & SupplementarySingleEventOutput)
				| ({
						typ: "train";
				  } & TrainSingleEventOutput)
				| ({
						typ: "transfer";
				  } & TransferSingleEventOutput)
		  )
		| MultiEventReadOutput;
	/** Image Paths */
	image_paths?: string[];
	/** Primary Image Path */
	primary_image_path?: string | null;
	/** @default "source" */
	translation?: TranslationState;
	/** Origin Event Id */
	origin_event_id?: string | null;
}

/** OrderTourInfo */
export interface OrderTourInfo {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Title */
	title: string | null;
	typ: TourType;
	/** Days */
	days: number;
	/** Nights */
	nights: number;
	/** Duration Hours */
	duration_hours?: number | null;
	/** Route */
	route?: string[];
}

/** OrderUserInfo */
export interface OrderUserInfo {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Email */
	email: string;
	/** First Name */
	first_name?: string | null;
	/** Last Name */
	last_name?: string | null;
	/** Phone Number */
	phone_number?: string | null;
}

/**
 * PackageBillable
 * Every event of one package, priced once for the bundle. ``min`` is zero
 * when only optional events reach the package, so the option's minimum leaves
 * it out exactly as the totals do. ``events`` is empty when the package is
 * reached only through choice alternatives — the money still sits on this line
 * so the itemization reconciles with the totals.
 *
 * Check
 *
 * - ``/tour/{id}/option/{id}/summary`` for the quote this belongs to
 * - ``/tour/{tour_id}/{option_id}/package/{package_id}`` for the package itself
 */
export interface PackageBillableInput {
	/**
	 * Typ
	 * @default "package_bill"
	 */
	typ?: "package_bill";
	/**
	 * Identity of the package a summary line bills through.
	 *
	 * Check
	 *
	 * - ``/tour/{tour_id}/{option_id}/package/{package_id}`` for the package itself
	 */
	package: PackageRef;
	/** Events */
	events: EventLineInput[];
	cost: TourMinMaxCostSchemaInput;
	markup: TourMinMaxCostSchemaInput;
	fees: TourMinMaxCostSchemaInput;
}

/**
 * PackageBillable
 * Every event of one package, priced once for the bundle. ``min`` is zero
 * when only optional events reach the package, so the option's minimum leaves
 * it out exactly as the totals do. ``events`` is empty when the package is
 * reached only through choice alternatives — the money still sits on this line
 * so the itemization reconciles with the totals.
 *
 * Check
 *
 * - ``/tour/{id}/option/{id}/summary`` for the quote this belongs to
 * - ``/tour/{tour_id}/{option_id}/package/{package_id}`` for the package itself
 */
export interface PackageBillableOutput {
	/**
	 * Typ
	 * @default "package_bill"
	 */
	typ?: "package_bill";
	/**
	 * Identity of the package a summary line bills through.
	 *
	 * Check
	 *
	 * - ``/tour/{tour_id}/{option_id}/package/{package_id}`` for the package itself
	 */
	package: PackageRef;
	/** Events */
	events: EventLineOutput[];
	cost: TourMinMaxCostSchemaOutput;
	markup: TourMinMaxCostSchemaOutput;
	fees: TourMinMaxCostSchemaOutput;
}

/**
 * PackageCreate
 * A package starts as a name and nothing else — the operator groups the
 * events first and prices the bundle once the supplier quotes it. An unpriced
 * package bills zero, which the publish gate refuses.
 */
export interface PackageCreate {
	/** Name */
	name: string;
	/**
	 * Expenses
	 * The expense calculation strategy.
	 */
	expenses?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseInput)
				| ({
						typ: "per_person";
				  } & PerPersonExpenseInput)
		  )
		| null;
	fees?: FixedExpenseInput | null;
	/**
	 * Markup
	 * The markup calculation strategy.
	 */
	markup?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseInput)
				| ({
						typ: "percentage";
				  } & PercentageMarkup)
		  )
		| null;
	/** Supplier Id */
	supplier_id?: string | null;
}

/**
 * PackageRef
 * Identity of the package a summary line bills through.
 *
 * Check
 *
 * - ``/tour/{tour_id}/{option_id}/package/{package_id}`` for the package itself
 */
export interface PackageRef {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Name */
	name: string;
}

/**
 * PackageUpdate
 * Partial update: an omitted field is left alone, an explicit ``null``
 * clears it. ``name`` is the one column that cannot be cleared.
 */
export interface PackageUpdate {
	/** Name */
	name?: string | null;
	/**
	 * Expenses
	 * The expense calculation strategy.
	 */
	expenses?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseInput)
				| ({
						typ: "per_person";
				  } & PerPersonExpenseInput)
		  )
		| null;
	fees?: FixedExpenseInput | null;
	/**
	 * Markup
	 * The markup calculation strategy.
	 */
	markup?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseInput)
				| ({
						typ: "percentage";
				  } & PercentageMarkup)
		  )
		| null;
	/** Supplier Id */
	supplier_id?: string | null;
}

/** PartneredAgencyItem */
export interface PartneredAgencyItem {
	/**
	 * Agency Id
	 * @format uuid
	 */
	agency_id: string;
	/** Name */
	name: string;
	/** Invited Email */
	invited_email: string;
	/** Invited User Id */
	invited_user_id?: string | null;
	/**
	 * Partnered At
	 * @format date-time
	 */
	partnered_at: string;
	/**
	 * Discount
	 * The markup calculation strategy.
	 */
	discount?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseOutput)
				| ({
						typ: "percentage";
				  } & PercentageMarkup)
		  )
		| null;
	/** Business Name */
	business_name?: string | null;
	/** Contact Person */
	contact_person?: string | null;
	/** Contact Email */
	contact_email?: string | null;
	/** Contact Phone */
	contact_phone?: string | null;
	/** City */
	city?: string | null;
	/** Country */
	country?: string | null;
	/** Website Url */
	website_url?: string | null;
	/** Logo Url */
	logo_url?: string | null;
}

/** PartneredAgencyListResponse */
export interface PartneredAgencyListResponse {
	/** Total Count */
	total_count: number;
	/** Data */
	data: PartneredAgencyItem[];
}

/** PasswordChangeIn */
export interface PasswordChangeIn {
	/**
	 * Current Password
	 * @minLength 1
	 * @maxLength 128
	 */
	current_password: string;
	/**
	 * New Password
	 * @minLength 6
	 * @maxLength 128
	 */
	new_password: string;
}

/** PaxCreate */
export interface PaxCreate {
	/**
	 * Full Name
	 * @maxLength 255
	 */
	full_name: string;
	gender: Gender;
	/** Nationality */
	nationality: string;
	/**
	 * Date Of Birth
	 * @format date
	 */
	date_of_birth: string;
	/**
	 * Passport Number
	 * @maxLength 50
	 */
	passport_number: string;
	/**
	 * Expired Date
	 * @format date
	 */
	expired_date: string;
	/** Comment */
	comment?: string | null;
}

/** PaxFileRef */
export interface PaxFileRef {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** File Name */
	file_name: string;
}

/** PaxListResponse */
export interface PaxListResponse {
	/** Count */
	count: number;
	/** Data */
	data: PaxWithFiles[];
}

/** PaxUpdate */
export interface PaxUpdate {
	/** Full Name */
	full_name?: string | null;
	gender?: Gender | null;
	/** Nationality */
	nationality?: string | null;
	/** Date Of Birth */
	date_of_birth?: string | null;
	/** Passport Number */
	passport_number?: string | null;
	/** Expired Date */
	expired_date?: string | null;
	/** Comment */
	comment?: string | null;
}

/** PaxWithFiles */
export interface PaxWithFiles {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/**
	 * Booking Id
	 * @format uuid
	 */
	booking_id: string;
	/** Full Name */
	full_name: string;
	gender: Gender;
	/** Nationality */
	nationality: string;
	/**
	 * Date Of Birth
	 * @format date
	 */
	date_of_birth: string;
	/** Passport Number */
	passport_number: string;
	/**
	 * Expired Date
	 * @format date
	 */
	expired_date: string;
	/** Comment */
	comment: string | null;
	/**
	 * Created At
	 * @format date-time
	 */
	created_at: string;
	/**
	 * Updated At
	 * @format date-time
	 */
	updated_at: string;
	/** Files */
	files: PaxFileRef[];
}

/** PaymentRouteCreate */
export interface PaymentRouteCreate {
	/**
	 * Internal Label
	 * @maxLength 255
	 */
	internal_label: string;
	currency: Currency;
	/** Note */
	note?: string | null;
	/** Details */
	details:
		| ({
				typ: "classic_swift";
		  } & ClassicSwiftDetails)
		| ({
				typ: "custom";
		  } & CustomDetails);
}

/** PaymentRouteUpdate */
export interface PaymentRouteUpdate {
	/** Internal Label */
	internal_label?: string | null;
	currency?: Currency | null;
	/** Note */
	note?: string | null;
	/** Details */
	details?:
		| (
				| ({
						typ: "classic_swift";
				  } & ClassicSwiftDetails)
				| ({
						typ: "custom";
				  } & CustomDetails)
		  )
		| null;
}

/** PerCarCategoryExpense */
export interface PerCarCategoryExpenseInput {
	/** Typ */
	typ: "per_car_category";
	/**
	 * Cars
	 * All types of cars and their categories
	 */
	cars?: TransferCarCategoriesVariantInput[] | null;
}

/** PerCarCategoryExpense */
export interface PerCarCategoryExpenseOutput {
	/** Typ */
	typ: "per_car_category";
	/**
	 * Cars
	 * All types of cars and their categories
	 */
	cars?: TransferCarCategoriesVariantOutput[] | null;
}

/** PerCarExpense */
export interface PerCarExpenseInput {
	/** Typ */
	typ: "per_car";
	/**
	 * Cars
	 * All types of cars and their categories
	 */
	cars?: TransferCarVariantInput[] | null;
}

/** PerCarExpense */
export interface PerCarExpenseOutput {
	/** Typ */
	typ: "per_car";
	/**
	 * Cars
	 * All types of cars and their categories
	 */
	cars?: TransferCarVariantOutput[] | null;
}

/**
 * PerGroupCharge
 * A group-size-tiered cost together with its own fee and markup.
 */
export interface PerGroupChargeInput {
	/**
	 * Typ
	 * @default "per_group"
	 */
	typ?: "per_group";
	/**
	 * Tiers
	 * @minItems 1
	 */
	tiers: GroupSizeTierInput[];
	fees?: FixedExpenseInput | null;
	/**
	 * Markup
	 * The markup calculation strategy.
	 */
	markup?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseInput)
				| ({
						typ: "percentage";
				  } & PercentageMarkup)
		  )
		| null;
}

/**
 * PerGroupCharge
 * A group-size-tiered cost together with its own fee and markup.
 */
export interface PerGroupChargeOutput {
	/**
	 * Typ
	 * @default "per_group"
	 */
	typ?: "per_group";
	/**
	 * Tiers
	 * @minItems 1
	 */
	tiers: GroupSizeTierOutput[];
	fees?: FixedExpenseOutput | null;
	/**
	 * Markup
	 * The markup calculation strategy.
	 */
	markup?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseOutput)
				| ({
						typ: "percentage";
				  } & PercentageMarkup)
		  )
		| null;
}

/**
 * PerPersonCharge
 * A per-person cost together with its own fee and markup.
 */
export interface PerPersonChargeInput {
	/**
	 * Typ
	 * @default "per_person"
	 */
	typ?: "per_person";
	/**
	 * Monetary value pair.
	 *
	 * Conversion happens inside the schema but takes an explicit ``FxContext``
	 * — no module-level rate singleton. Same-currency ``convert`` is a cheap
	 * ``return self``; cross-currency requires a matching entry in
	 * ``fx.rates`` and applies ``val * rate``.
	 *
	 * Arithmetic operators stay same-currency-only on purpose: event calc
	 * normalizes every leaf to ``fx.target`` via ``convert`` before summing,
	 * so same-currency is always satisfied and the guards catch anything that
	 * slips through.
	 */
	cost_per_person: MonetaryValueSchema;
	fees?: FixedExpenseInput | null;
	/**
	 * Markup
	 * The markup calculation strategy.
	 */
	markup?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseInput)
				| ({
						typ: "percentage";
				  } & PercentageMarkup)
		  )
		| null;
}

/**
 * PerPersonCharge
 * A per-person cost together with its own fee and markup.
 */
export interface PerPersonChargeOutput {
	/**
	 * Typ
	 * @default "per_person"
	 */
	typ?: "per_person";
	/**
	 * Monetary value pair.
	 *
	 * Conversion happens inside the schema but takes an explicit ``FxContext``
	 * — no module-level rate singleton. Same-currency ``convert`` is a cheap
	 * ``return self``; cross-currency requires a matching entry in
	 * ``fx.rates`` and applies ``val * rate``.
	 *
	 * Arithmetic operators stay same-currency-only on purpose: event calc
	 * normalizes every leaf to ``fx.target`` via ``convert`` before summing,
	 * so same-currency is always satisfied and the guards catch anything that
	 * slips through.
	 */
	cost_per_person: MonetaryValueSchema;
	fees?: FixedExpenseOutput | null;
	/**
	 * Markup
	 * The markup calculation strategy.
	 */
	markup?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseOutput)
				| ({
						typ: "percentage";
				  } & PercentageMarkup)
		  )
		| null;
}

/**
 * PerPersonExpense
 * A cost calculated per person.
 */
export interface PerPersonExpenseInput {
	/**
	 * Typ
	 * @default "per_person"
	 */
	typ?: "per_person";
	/**
	 * Monetary value pair.
	 *
	 * Conversion happens inside the schema but takes an explicit ``FxContext``
	 * — no module-level rate singleton. Same-currency ``convert`` is a cheap
	 * ``return self``; cross-currency requires a matching entry in
	 * ``fx.rates`` and applies ``val * rate``.
	 *
	 * Arithmetic operators stay same-currency-only on purpose: event calc
	 * normalizes every leaf to ``fx.target`` via ``convert`` before summing,
	 * so same-currency is always satisfied and the guards catch anything that
	 * slips through.
	 */
	cost_per_person: MonetaryValueSchema;
}

/**
 * PerPersonExpense
 * A cost calculated per person.
 */
export interface PerPersonExpenseOutput {
	/**
	 * Typ
	 * @default "per_person"
	 */
	typ?: "per_person";
	/**
	 * Monetary value pair.
	 *
	 * Conversion happens inside the schema but takes an explicit ``FxContext``
	 * — no module-level rate singleton. Same-currency ``convert`` is a cheap
	 * ``return self``; cross-currency requires a matching entry in
	 * ``fx.rates`` and applies ``val * rate``.
	 *
	 * Arithmetic operators stay same-currency-only on purpose: event calc
	 * normalizes every leaf to ``fx.target`` via ``convert`` before summing,
	 * so same-currency is always satisfied and the guards catch anything that
	 * slips through.
	 */
	cost_per_person: MonetaryValueSchema;
}

/**
 * PerRoomCategoryExpenses
 * Represents a expenses associated with a room within a category
 */
export interface PerRoomCategoryExpensesInput {
	/** Typ */
	typ: "per_room_category";
	/**
	 * Categories
	 * All room categories with their rooms
	 */
	categories?: HousingRoomCategoryExpensesSchemaInput[] | null;
}

/**
 * PerRoomCategoryExpenses
 * Represents a expenses associated with a room within a category
 */
export interface PerRoomCategoryExpensesOutput {
	/** Typ */
	typ: "per_room_category";
	/**
	 * Categories
	 * All room categories with their rooms
	 */
	categories?: HousingRoomCategoryExpensesSchemaOutput[] | null;
}

/**
 * PerRoomExpenses
 * Represents a expenses associated with a room
 */
export interface PerRoomExpensesInput {
	/** Typ */
	typ: "per_room";
	/**
	 * Rooms
	 * All rooms
	 */
	rooms?: HousingRoomDoubleSchemaInput[] | null;
}

/**
 * PerRoomExpenses
 * Represents a expenses associated with a room
 */
export interface PerRoomExpensesOutput {
	/** Typ */
	typ: "per_room";
	/**
	 * Rooms
	 * All rooms
	 */
	rooms?: HousingRoomDoubleSchemaOutput[] | null;
}

/**
 * PercentageMarkup
 * Adds a percentage on top of a base cost.
 */
export interface PercentageMarkup {
	/** Typ */
	typ: "percentage";
	/**
	 * Percentage
	 * e.g., 0.15 for 15%
	 * @exclusiveMin 0
	 * @exclusiveMax 1
	 */
	percentage: number;
}

/** PriceRangeSchema */
export interface PriceRangeSchema {
	/** Min */
	min: number | null;
	/** Max */
	max: number | null;
	currency: Currency | null;
}

/**
 * PricingFinancials
 * Pure markup inputs — built from live operator settings or frozen.
 */
export interface PricingFinancialsInput {
	/**
	 * Default Markup
	 * The markup calculation strategy.
	 */
	default_markup?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseInput)
				| ({
						typ: "percentage";
				  } & PercentageMarkup)
		  )
		| null;
}

/**
 * PricingFinancials
 * Pure markup inputs — built from live operator settings or frozen.
 */
export interface PricingFinancialsOutput {
	/**
	 * Default Markup
	 * The markup calculation strategy.
	 */
	default_markup?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseOutput)
				| ({
						typ: "percentage";
				  } & PercentageMarkup)
		  )
		| null;
}

/**
 * PricingPackage
 * Pure pricing input for one package — built from the live ``TourPackageModel``
 * (``model_validate`` with ``from_attributes``) or read straight from a frozen
 * booking snapshot. Owned by pricing so the snapshot can reuse it.
 */
export interface PricingPackageInput {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/**
	 * Name
	 * @default ""
	 */
	name?: string;
	/** Supplier Id */
	supplier_id?: string | null;
	/**
	 * Expenses
	 * The expense calculation strategy.
	 */
	expenses?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseInput)
				| ({
						typ: "per_person";
				  } & PerPersonExpenseInput)
		  )
		| null;
	fees?: FixedExpenseInput | null;
	/**
	 * Markup
	 * The markup calculation strategy.
	 */
	markup?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseInput)
				| ({
						typ: "percentage";
				  } & PercentageMarkup)
		  )
		| null;
}

/**
 * PricingPackage
 * Pure pricing input for one package — built from the live ``TourPackageModel``
 * (``model_validate`` with ``from_attributes``) or read straight from a frozen
 * booking snapshot. Owned by pricing so the snapshot can reuse it.
 */
export interface PricingPackageOutput {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/**
	 * Name
	 * @default ""
	 */
	name?: string;
	/** Supplier Id */
	supplier_id?: string | null;
	/**
	 * Expenses
	 * The expense calculation strategy.
	 */
	expenses?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseOutput)
				| ({
						typ: "per_person";
				  } & PerPersonExpenseOutput)
		  )
		| null;
	fees?: FixedExpenseOutput | null;
	/**
	 * Markup
	 * The markup calculation strategy.
	 */
	markup?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseOutput)
				| ({
						typ: "percentage";
				  } & PercentageMarkup)
		  )
		| null;
}

/** PublicTourCatalogListResponse */
export interface PublicTourCatalogListResponse {
	/** Total Count */
	total_count: number;
	/** Data */
	data: PublicTourCatalogSchemaOutput[];
}

/** PublicTourCatalogSchema */
export interface PublicTourCatalogSchemaInput {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tour_id: string;
	/** Title */
	title: string | null;
	/** Cover Image Url */
	cover_image_url: string | null;
	/** Description */
	description: string | null;
	/** Days */
	days: number;
	/** Nights */
	nights: number;
	/** Duration Hours */
	duration_hours: number | null;
	/** Age From */
	age_from: number | null;
	/** Age To */
	age_to: number | null;
	/** Group Size */
	group_size: number;
	/** Group Size Min */
	group_size_min: number | null;
	/** Categories */
	categories: TourCategory[];
	tour_type: TourType;
	/** Landing Photos */
	landing_photos: string[];
	/** Cities */
	cities: string[];
	/** Languages */
	languages: LanguageCode[];
	price_range: PriceRangeSchema | null;
	price_per_person: PriceRangeSchema | null;
	/** Option Count */
	option_count?: number | null;
	public_price_range?: PriceRangeSchema | null;
	public_price_per_person?: PriceRangeSchema | null;
	/**
	 * Discount
	 * The markup calculation strategy.
	 */
	discount?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseInput)
				| ({
						typ: "percentage";
				  } & PercentageMarkup)
		  )
		| null;
}

/** PublicTourCatalogSchema */
export interface PublicTourCatalogSchemaOutput {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tour_id: string;
	/** Title */
	title: string | null;
	/** Cover Image Url */
	cover_image_url: string | null;
	/** Description */
	description: string | null;
	/** Days */
	days: number;
	/** Nights */
	nights: number;
	/** Duration Hours */
	duration_hours: number | null;
	/** Age From */
	age_from: number | null;
	/** Age To */
	age_to: number | null;
	/** Group Size */
	group_size: number;
	/** Group Size Min */
	group_size_min: number | null;
	/** Categories */
	categories: TourCategory[];
	tour_type: TourType;
	/** Landing Photos */
	landing_photos: string[];
	/** Cities */
	cities: string[];
	/** Languages */
	languages: LanguageCode[];
	price_range: PriceRangeSchema | null;
	price_per_person: PriceRangeSchema | null;
	/** Option Count */
	option_count?: number | null;
	public_price_range?: PriceRangeSchema | null;
	public_price_per_person?: PriceRangeSchema | null;
	/**
	 * Discount
	 * The markup calculation strategy.
	 */
	discount?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseOutput)
				| ({
						typ: "percentage";
				  } & PercentageMarkup)
		  )
		| null;
}

/**
 * PublishBlockSchema
 * One reason a tour cannot be published, addressed to the exact input that
 * has to change.
 *
 * ``event_id`` is the slot (the card in the day plan) and ``tour_option_id``
 * the variant it belongs to — the gate scans every live option, so the block
 * can point outside the one currently open. Everything else about the event
 * (type, day, position) is read off the itinerary the client already holds.
 * ``option_id`` is set only when the offender is an alternative inside a choice
 * event; single events carry no separate option handle.
 *
 * ``path`` walks the event payload down to the offending input, list positions
 * included — ``["details", "hop", 1, "arrival_time"]``. It is relative to the
 * event, or to the alternative when ``option_id`` is set, so it addresses the
 * same form the client already renders. The last segment names what is missing,
 * so it need not resolve: an unpriced guide language reads
 * ``["details", "categories", "en"]``, keyed by language rather than position
 * because the row does not exist yet.
 *
 * Check: POST /tour/{tour_id}/publish
 */
export interface PublishBlockSchema {
	/**
	 * Tour Option Id
	 * @format uuid
	 */
	tour_option_id: string;
	/**
	 * Event Id
	 * @format uuid
	 */
	event_id: string;
	/** Option Id */
	option_id?: string | null;
	/** Path */
	path?: (string | number)[];
	/** Detail */
	detail: string;
}

/**
 * ReconciliationTotals
 * Grand totals across the *whole filtered set*, not just the page.
 *
 * Only ledger-derived figures appear here. Planned totals are deliberately
 * absent: they require re-pricing every matching snapshot, and a number that
 * silently covered only the current page would be worse than no number.
 */
export interface ReconciliationTotalsInput {
	/** Revenue Accrued */
	revenue_accrued: number | string;
	/** Revenue Settled */
	revenue_settled: number | string;
	/** Receivable */
	receivable: number | string;
	/** Cost Accrued */
	cost_accrued: number | string;
	/** Cost Settled */
	cost_settled: number | string;
	/** Payable */
	payable: number | string;
	/** Settled Profit */
	settled_profit: number | string;
	/** Accrual Profit */
	accrual_profit: number | string;
}

/**
 * ReconciliationTotals
 * Grand totals across the *whole filtered set*, not just the page.
 *
 * Only ledger-derived figures appear here. Planned totals are deliberately
 * absent: they require re-pricing every matching snapshot, and a number that
 * silently covered only the current page would be worse than no number.
 */
export interface ReconciliationTotalsOutput {
	/**
	 * Revenue Accrued
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	revenue_accrued: string;
	/**
	 * Revenue Settled
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	revenue_settled: string;
	/**
	 * Receivable
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	receivable: string;
	/**
	 * Cost Accrued
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	cost_accrued: string;
	/**
	 * Cost Settled
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	cost_settled: string;
	/**
	 * Payable
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	payable: string;
	/**
	 * Settled Profit
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	settled_profit: string;
	/**
	 * Accrual Profit
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	accrual_profit: string;
}

/** RecurrenceDateModel */
export interface RecurrenceDateModel {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/**
	 * Schedule Id
	 * @format uuid
	 */
	schedule_id: string;
	/** Day */
	day: number | null;
	/** Valid From */
	valid_from: string | null;
	/** Valid Until */
	valid_until: string | null;
}

/** RecurrenceRuleCreate */
export interface RecurrenceRuleCreate {
	/**
	 * Day
	 * Day of the week (0=Monday, 6=Sunday)
	 */
	day?: number | null;
	/** Valid From */
	valid_from?: string | null;
	/** Valid Until */
	valid_until?: string | null;
}

/** RecurrenceRulesBulkCreate */
export interface RecurrenceRulesBulkCreate {
	/**
	 * Rules
	 * @minItems 1
	 */
	rules: RecurrenceRuleCreate[];
}

/**
 * RevisionPreview
 * Effective itinerary for a booking (original snapshot folded with its edit log
 */
export interface RevisionPreview {
	/** Pure-Pydantic snapshot of everything a booking's price depends on, frozen at creation. */
	snapshot: TourSnapshotSchemaOutput;
	/** Cost */
	cost?: string | null;
	/** Revenue */
	revenue?: string | null;
}

/** SeasonalityCommissionCreate */
export interface SeasonalityCommissionCreate {
	/**
	 * Commission
	 * Commission percentage/value
	 */
	commission: number;
	/**
	 * Valid From
	 * @format date
	 */
	valid_from: string;
	/**
	 * Valid Until
	 * @format date
	 */
	valid_until: string;
}

/** SeasonalityCommissionModel */
export interface SeasonalityCommissionModel {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/**
	 * Schedule Id
	 * @format uuid
	 */
	schedule_id: string;
	/** Commission */
	commission: number;
	/**
	 * Valid From
	 * @format date
	 */
	valid_from: string;
	/**
	 * Valid Until
	 * @format date
	 */
	valid_until: string;
}

/** SignInIn */
export interface SignInIn {
	/**
	 * Email
	 * @format email
	 */
	email: string;
	/**
	 * Password
	 * @minLength 1
	 * @maxLength 128
	 */
	password: string;
}

/** StaffInvite */
export interface StaffInvite {
	/**
	 * Email
	 * @format email
	 * @maxLength 255
	 */
	email: string;
	/**
	 * First Name
	 * @maxLength 255
	 */
	first_name: string;
	/**
	 * Last Name
	 * @maxLength 255
	 */
	last_name: string;
	/** Role */
	role: StaffInviteRoleEnum;
}

/** StaffInviteResult */
export interface StaffInviteResult {
	/**
	 * User Id
	 * @format uuid
	 */
	user_id: string;
	/** First Name */
	first_name: string | null;
	/** Last Name */
	last_name: string | null;
	/** Email */
	email: string;
	/** Role */
	role: StaffInviteResultRoleEnum;
	status: StaffStatus;
	/** Commission Percent */
	commission_percent: number | null;
	/** Generated Password */
	generated_password: string;
}

/** StaffListResponse */
export interface StaffListResponse {
	/** Total Count */
	total_count: number;
	/** Data */
	data: StaffRead[];
}

/** StaffRead */
export interface StaffRead {
	/**
	 * User Id
	 * @format uuid
	 */
	user_id: string;
	/** First Name */
	first_name: string | null;
	/** Last Name */
	last_name: string | null;
	/** Email */
	email: string;
	/** Role */
	role: StaffReadRoleEnum;
	status: StaffStatus;
	/** Commission Percent */
	commission_percent: number | null;
}

/** StaffUpdate */
export interface StaffUpdate {
	/** First Name */
	first_name?: string | null;
	/** Last Name */
	last_name?: string | null;
	/** Role */
	role?: StaffUpdateRoleEnum | null;
	/** Status */
	status?: StaffUpdateStatusEnum | null;
	/** Commission Percent */
	commission_percent?: number | null;
}

/**
 * StandaloneBillable
 * One event that prices itself: its own cost and markup across the option's
 * cheapest and dearest resolutions over the tour's allowed group-size range.
 *
 * Check
 *
 * - ``/tour/{id}/option/{id}/summary`` for the quote this belongs to
 * - ``/tour/{tour_id}/{option_id}/package`` for the packages events can join
 */
export interface StandaloneBillableInput {
	/**
	 * Event Id
	 * @format uuid
	 */
	event_id: string;
	/** Event */
	event:
		| (
				| ({
						typ: "activity";
				  } & ActivitySingleEventInput)
				| ({
						typ: "bus";
				  } & BusSingleEventInput)
				| ({
						typ: "flight";
				  } & FlightSingleEventInput)
				| ({
						typ: "guide";
				  } & GuideSingleEventInput)
				| ({
						typ: "housing";
				  } & HousingSingleEventInput)
				| ({
						typ: "ref";
				  } & InformationSingleEventInput)
				| ({
						typ: "supplementary";
				  } & SupplementarySingleEventInput)
				| ({
						typ: "train";
				  } & TrainSingleEventInput)
				| ({
						typ: "transfer";
				  } & TransferSingleEventInput)
		  )
		| MultiEventReadInput;
	/**
	 * Typ
	 * @default "individual_bill"
	 */
	typ?: "individual_bill";
	cost: TourMinMaxCostSchemaInput;
	markup: TourMinMaxCostSchemaInput;
	fees: TourMinMaxCostSchemaInput;
}

/**
 * StandaloneBillable
 * One event that prices itself: its own cost and markup across the option's
 * cheapest and dearest resolutions over the tour's allowed group-size range.
 *
 * Check
 *
 * - ``/tour/{id}/option/{id}/summary`` for the quote this belongs to
 * - ``/tour/{tour_id}/{option_id}/package`` for the packages events can join
 */
export interface StandaloneBillableOutput {
	/**
	 * Event Id
	 * @format uuid
	 */
	event_id: string;
	/** Event */
	event:
		| (
				| ({
						typ: "activity";
				  } & ActivitySingleEventOutput)
				| ({
						typ: "bus";
				  } & BusSingleEventOutput)
				| ({
						typ: "flight";
				  } & FlightSingleEventOutput)
				| ({
						typ: "guide";
				  } & GuideSingleEventOutput)
				| ({
						typ: "housing";
				  } & HousingSingleEventOutput)
				| ({
						typ: "ref";
				  } & InformationSingleEventOutput)
				| ({
						typ: "supplementary";
				  } & SupplementarySingleEventOutput)
				| ({
						typ: "train";
				  } & TrainSingleEventOutput)
				| ({
						typ: "transfer";
				  } & TransferSingleEventOutput)
		  )
		| MultiEventReadOutput;
	/**
	 * Typ
	 * @default "individual_bill"
	 */
	typ?: "individual_bill";
	cost: TourMinMaxCostSchemaOutput;
	markup: TourMinMaxCostSchemaOutput;
	fees: TourMinMaxCostSchemaOutput;
}

/** SupplementaryDetails */
export interface SupplementaryDetailsInput {
	/**
	 * Item
	 * @default []
	 */
	item?: SupplementaryItemInput[];
}

/** SupplementaryDetails */
export interface SupplementaryDetailsOutput {
	/**
	 * Item
	 * @default []
	 */
	item?: SupplementaryItemOutput[];
}

/** SupplementaryEvent */
export interface SupplementaryEventInput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "supplementary"
	 */
	typ?: "supplementary";
	details?: SupplementaryDetailsInput | null;
}

/** SupplementaryEvent */
export interface SupplementaryEventOutput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "supplementary"
	 */
	typ?: "supplementary";
	details?: SupplementaryDetailsOutput | null;
}

/** SupplementaryEventTypeRead */
export interface SupplementaryEventTypeReadInput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "supplementary"
	 */
	typ?: "supplementary";
	details?: SupplementaryDetailsInput | null;
	/**
	 * Id
	 * Option (alternative) id; populated on read, ignored on write.
	 */
	id?: string | null;
}

/** SupplementaryEventTypeRead */
export interface SupplementaryEventTypeReadOutput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "supplementary"
	 */
	typ?: "supplementary";
	details?: SupplementaryDetailsOutput | null;
	/**
	 * Id
	 * Option (alternative) id; populated on read, ignored on write.
	 */
	id?: string | null;
}

/** SupplementaryItem */
export interface SupplementaryItemInput {
	/** Name */
	name?: string | null;
	/**
	 * Expenses
	 * The charge calculation strategy.
	 */
	expenses?:
		| (
				| ({
						typ: "fixed";
				  } & FixedChargeInput)
				| ({
						typ: "per_person";
				  } & PerPersonChargeInput)
		  )
		| null;
}

/** SupplementaryItem */
export interface SupplementaryItemOutput {
	/** Name */
	name?: string | null;
	/**
	 * Expenses
	 * The charge calculation strategy.
	 */
	expenses?:
		| (
				| ({
						typ: "fixed";
				  } & FixedChargeOutput)
				| ({
						typ: "per_person";
				  } & PerPersonChargeOutput)
		  )
		| null;
}

/** SupplementarySingleEvent */
export interface SupplementarySingleEventInput {
	/**
	 * Day
	 * Event's day number in a tour
	 */
	day: number;
	/**
	 * Position
	 * Event's order number in a tour
	 * @min 0
	 */
	position: number;
	/**
	 * Is Optional
	 * @default false
	 */
	is_optional?: boolean;
	/**
	 * Images
	 * Images of the event slot, primary first; populated on read, ignored on write.
	 */
	images?: EventImageSchema[];
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "supplementary"
	 */
	typ?: "supplementary";
	details?: SupplementaryDetailsInput | null;
}

/** SupplementarySingleEvent */
export interface SupplementarySingleEventOutput {
	/**
	 * Day
	 * Event's day number in a tour
	 */
	day: number;
	/**
	 * Position
	 * Event's order number in a tour
	 * @min 0
	 */
	position: number;
	/**
	 * Is Optional
	 * @default false
	 */
	is_optional?: boolean;
	/**
	 * Images
	 * Images of the event slot, primary first; populated on read, ignored on write.
	 */
	images?: EventImageSchema[];
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "supplementary"
	 */
	typ?: "supplementary";
	details?: SupplementaryDetailsOutput | null;
}

/** SupplierCreateSchema */
export interface SupplierCreateSchema {
	/**
	 * Brand Name
	 * @maxLength 255
	 */
	brand_name: string;
	/** Legal Name */
	legal_name?: string | null;
	/** Phone */
	phone?: string | null;
	/** Website */
	website?: string | null;
	supplier_type: SupplierType;
}

/**
 * SupplierLineTally
 * Counts behind the payable figure, so a row explains itself: how many
 * event lines exist, how many are settled, and how many are still filed under
 * no supplier at all.
 */
export interface SupplierLineTally {
	/** Total */
	total: number;
	/** Paid */
	paid: number;
	/** Unpaid */
	unpaid: number;
	/** Unassigned Supplier */
	unassigned_supplier: number;
	/** Unpriced */
	unpriced: number;
}

/** SupplierListResponse */
export interface SupplierListResponse {
	/** Total Count */
	total_count: number;
	/** Data */
	data: SupplierModel[];
}

/** SupplierModel */
export interface SupplierModel {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/**
	 * Operator Id
	 * @format uuid
	 */
	operator_id: string;
	/** Brand Name */
	brand_name: string;
	/** Legal Name */
	legal_name: string | null;
	/** Phone */
	phone: string | null;
	/** Website */
	website: string | null;
	/** Logo Path */
	logo_path: string | null;
	supplier_type: SupplierType;
	/** Deleted At */
	deleted_at: string | null;
}

/**
 * SupplierPaymentFile
 * One attached confirmation document. ``url`` is a presigned link that
 * expires, so it is regenerated on every read rather than stored.
 */
export interface SupplierPaymentFile {
	/**
	 * File Id
	 * @format uuid
	 */
	file_id: string;
	/** Url */
	url: string;
	/** File Name */
	file_name: string;
}

/** SupplierPaymentListResponse */
export interface SupplierPaymentListResponse {
	/** Total Count */
	total_count: number;
	/** Data */
	data: SupplierPaymentListRowOutput[];
}

/**
 * SupplierPaymentListRow
 * One row of the browse table — enough to render, filter and sort, nothing
 * more.
 *
 * Receipts are reduced to a ``receipt_count`` because their signed URLs expire
 * in 900s and a list can stay open far longer than that; ``rate``, ``note`` and
 * the documents themselves are read from the detail call when a row is
 * opened.
 *
 * Check:
 * - ``GET /operator/supplier-payment/{payment_id}`` for the full row
 */
export interface SupplierPaymentListRowInput {
	/**
	 * Payment Id
	 * @format uuid
	 */
	payment_id: string;
	/**
	 * Booking Id
	 * @format uuid
	 */
	booking_id: string;
	/** Order Number */
	order_number: string;
	/**
	 * Event Id
	 * @format uuid
	 */
	event_id: string;
	/** Event Name */
	event_name: string | null;
	event_typ: EventTypes | null;
	/** Supplier Id */
	supplier_id: string | null;
	/** Supplier Name */
	supplier_name: string | null;
	/** Amount */
	amount: number | string;
	currency: Currency;
	/** Base Amount */
	base_amount: number | string;
	/** Receipt Count */
	receipt_count: number;
	status: SupplierPaymentStatus;
	/** Paid At */
	paid_at: string | null;
}

/**
 * SupplierPaymentListRow
 * One row of the browse table — enough to render, filter and sort, nothing
 * more.
 *
 * Receipts are reduced to a ``receipt_count`` because their signed URLs expire
 * in 900s and a list can stay open far longer than that; ``rate``, ``note`` and
 * the documents themselves are read from the detail call when a row is
 * opened.
 *
 * Check:
 * - ``GET /operator/supplier-payment/{payment_id}`` for the full row
 */
export interface SupplierPaymentListRowOutput {
	/**
	 * Payment Id
	 * @format uuid
	 */
	payment_id: string;
	/**
	 * Booking Id
	 * @format uuid
	 */
	booking_id: string;
	/** Order Number */
	order_number: string;
	/**
	 * Event Id
	 * @format uuid
	 */
	event_id: string;
	/** Event Name */
	event_name: string | null;
	event_typ: EventTypes | null;
	/** Supplier Id */
	supplier_id: string | null;
	/** Supplier Name */
	supplier_name: string | null;
	/**
	 * Amount
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	amount: string;
	currency: Currency;
	/**
	 * Base Amount
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	base_amount: string;
	/** Receipt Count */
	receipt_count: number;
	status: SupplierPaymentStatus;
	/** Paid At */
	paid_at: string | null;
}

/**
 * SupplierPaymentResponse
 * Adds ``base_amount`` — the real cost converted into the operator's base
 * currency at the pinned rate (``amount * rate``). This is what feeds the
 * tour's real-cost / profit-loss accounting.
 */
export interface SupplierPaymentResponse {
	/**
	 * Payment Id
	 * @format uuid
	 */
	payment_id: string;
	/**
	 * Operator Id
	 * @format uuid
	 */
	operator_id: string;
	/**
	 * Booking Id
	 * @format uuid
	 */
	booking_id: string;
	/** Order Number */
	order_number: string;
	/**
	 * Event Id
	 * @format uuid
	 */
	event_id: string;
	/** Event Name */
	event_name: string | null;
	event_typ: EventTypes | null;
	/** Supplier Id */
	supplier_id: string | null;
	/** Supplier Name */
	supplier_name: string | null;
	/**
	 * Amount
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	amount: string;
	currency: Currency;
	/**
	 * Rate
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	rate: string;
	/**
	 * Base Amount
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	base_amount: string;
	/** Files */
	files: SupplierPaymentFile[];
	/** Note */
	note: string | null;
	status: SupplierPaymentStatus;
	/** Paid At */
	paid_at: string | null;
}

/**
 * SupplierPaymentUpdate
 * Operator edits a seeded payment row: real cost, supplier, status, note.
 *
 * ``rate`` is never set by hand — when ``currency`` differs from the operator's
 * base currency the service pins the operator's annual FX rate. Status may only
 * become PAID once a confirmation ``file`` is attached (enforced in service).
 */
export interface SupplierPaymentUpdate {
	/** Supplier Id */
	supplier_id?: string | null;
	/** Amount */
	amount?: number | string | null;
	currency?: Currency | null;
	/** Note */
	note?: string | null;
	status?: SupplierPaymentStatus | null;
}

/** SupplierUpdateSchema */
export interface SupplierUpdateSchema {
	/** Brand Name */
	brand_name?: string | null;
	/** Legal Name */
	legal_name?: string | null;
	/** Phone */
	phone?: string | null;
	/** Website */
	website?: string | null;
}

/** TimeSchema */
export interface TimeSchema {
	/**
	 * Time
	 * The local date and time of the event in ISO 8601 format.
	 * @format time
	 */
	time: string;
	/**
	 * Timezone
	 * The UTC timezone offset (e.g., 5 for UTC+5). Unset means the offset was never supplied — never assume a fallback zone.
	 */
	timezone?: number | null;
}

/** TourEventLibraryImageModel */
export interface TourEventLibraryImageModel {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/**
	 * Library Id
	 * @format uuid
	 */
	library_id: string;
	/** Image Path */
	image_path: string;
	/** Is Primary */
	is_primary: boolean;
}

/** TourEventResponse */
export interface TourEventResponse {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Tour Option Id */
	tour_option_id: string | null;
	/** Event */
	event:
		| (
				| ({
						typ: "activity";
				  } & ActivitySingleEventOutput)
				| ({
						typ: "bus";
				  } & BusSingleEventOutput)
				| ({
						typ: "flight";
				  } & FlightSingleEventOutput)
				| ({
						typ: "guide";
				  } & GuideSingleEventOutput)
				| ({
						typ: "housing";
				  } & HousingSingleEventOutput)
				| ({
						typ: "ref";
				  } & InformationSingleEventOutput)
				| ({
						typ: "supplementary";
				  } & SupplementarySingleEventOutput)
				| ({
						typ: "train";
				  } & TrainSingleEventOutput)
				| ({
						typ: "transfer";
				  } & TransferSingleEventOutput)
		  )
		| MultiEventReadOutput;
	/** Image Paths */
	image_paths?: string[];
	/** Primary Image Path */
	primary_image_path?: string | null;
	/** @default "source" */
	translation?: TranslationState;
}

/** TourFinSettingsModel */
export interface TourFinSettingsModel {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Tour Meta Id */
	tour_meta_id: string | null;
	currency_type: Currency;
	/**
	 * Markup
	 * The markup calculation strategy.
	 */
	markup:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseOutput)
				| ({
						typ: "percentage";
				  } & PercentageMarkup)
		  )
		| null;
	foc: FocPolicy | null;
}

/** TourListResponse */
export interface TourListResponse {
	/** Total Count */
	total_count: number;
	/** Data */
	data: TourMetaResponse[];
}

/** TourMetaCreateSchema */
export interface TourMetaCreateSchema {
	/**
	 * Title
	 * @minLength 1
	 * @maxLength 255
	 */
	title: string;
	/**
	 * Days
	 * @min 1
	 * @default 1
	 */
	days?: number;
	/**
	 * Nights
	 * @min 0
	 * @default 0
	 */
	nights?: number;
	/** Duration Hours */
	duration_hours?: number | null;
	/** Age From */
	age_from?: number | null;
	/** Age To */
	age_to?: number | null;
	/**
	 * Group Size
	 * @min 1
	 * @default 1
	 */
	group_size?: number;
	/** Group Size Min */
	group_size_min?: number | null;
	/** @default "regular" */
	typ?: TourType;
	/** Agency Id */
	agency_id?: string | null;
	/** Categories */
	categories?: TourCategory[];
	/**
	 * Languages
	 * @minItems 1
	 */
	languages?: LanguageCode[];
}

/**
 * TourMetaResponse
 * ``tour_meta`` joined to its landing page, which owns the tour title. The
 * tour row itself carries no text — every reader that used to select
 * ``tour_meta.name`` now reads ``landing_page.title`` through this shape.
 */
export interface TourMetaResponse {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/**
	 * Created At
	 * @format date-time
	 */
	created_at: string;
	/**
	 * Updated At
	 * @format date-time
	 */
	updated_at: string;
	/**
	 * Operator Id
	 * @format uuid
	 */
	operator_id: string;
	/** Schedule Id */
	schedule_id: string | null;
	/** Agency Id */
	agency_id: string | null;
	/** Landing Id */
	landing_id: string | null;
	/** Title */
	title: string | null;
	/** Cover Image Path */
	cover_image_path: string | null;
	/** Group Size */
	group_size: number;
	/** Group Size Min */
	group_size_min: number | null;
	/** Days */
	days: number;
	/** Nights */
	nights: number;
	/** Duration Hours */
	duration_hours: number | null;
	/** Age From */
	age_from: number | null;
	/** Age To */
	age_to: number | null;
	typ: TourType;
	status: TourStatus;
	/** Categories */
	categories: TourCategory[];
	/** Languages */
	languages: LanguageCode[];
}

/**
 * TourMetaUpdateSchema
 * The tour title is not here on purpose: it lives on ``landing_page.title``
 * and is renamed through ``PATCH /tour/{tour_id}/landing``, which is also where
 * the per-operator uniqueness check and the translation re-run hang off.
 */
export interface TourMetaUpdateSchema {
	typ?: TourType | null;
	/** Agency Id */
	agency_id?: string | null;
	/** Days */
	days?: number | null;
	/** Nights */
	nights?: number | null;
	/** Duration Hours */
	duration_hours?: number | null;
	/** Age From */
	age_from?: number | null;
	/** Age To */
	age_to?: number | null;
	/** Group Size */
	group_size?: number | null;
	/** Group Size Min */
	group_size_min?: number | null;
	/** Categories */
	categories?: TourCategory[] | null;
	/** Languages */
	languages?: LanguageCode[] | null;
}

/** TourMinMaxCostSchema */
export interface TourMinMaxCostSchemaInput {
	/**
	 * Monetary value pair.
	 *
	 * Conversion happens inside the schema but takes an explicit ``FxContext``
	 * — no module-level rate singleton. Same-currency ``convert`` is a cheap
	 * ``return self``; cross-currency requires a matching entry in
	 * ``fx.rates`` and applies ``val * rate``.
	 *
	 * Arithmetic operators stay same-currency-only on purpose: event calc
	 * normalizes every leaf to ``fx.target`` via ``convert`` before summing,
	 * so same-currency is always satisfied and the guards catch anything that
	 * slips through.
	 */
	min: MonetaryValueSchema;
	/**
	 * Monetary value pair.
	 *
	 * Conversion happens inside the schema but takes an explicit ``FxContext``
	 * — no module-level rate singleton. Same-currency ``convert`` is a cheap
	 * ``return self``; cross-currency requires a matching entry in
	 * ``fx.rates`` and applies ``val * rate``.
	 *
	 * Arithmetic operators stay same-currency-only on purpose: event calc
	 * normalizes every leaf to ``fx.target`` via ``convert`` before summing,
	 * so same-currency is always satisfied and the guards catch anything that
	 * slips through.
	 */
	max: MonetaryValueSchema;
}

/** TourMinMaxCostSchema */
export interface TourMinMaxCostSchemaOutput {
	/**
	 * Monetary value pair.
	 *
	 * Conversion happens inside the schema but takes an explicit ``FxContext``
	 * — no module-level rate singleton. Same-currency ``convert`` is a cheap
	 * ``return self``; cross-currency requires a matching entry in
	 * ``fx.rates`` and applies ``val * rate``.
	 *
	 * Arithmetic operators stay same-currency-only on purpose: event calc
	 * normalizes every leaf to ``fx.target`` via ``convert`` before summing,
	 * so same-currency is always satisfied and the guards catch anything that
	 * slips through.
	 */
	min: MonetaryValueSchema;
	/**
	 * Monetary value pair.
	 *
	 * Conversion happens inside the schema but takes an explicit ``FxContext``
	 * — no module-level rate singleton. Same-currency ``convert`` is a cheap
	 * ``return self``; cross-currency requires a matching entry in
	 * ``fx.rates`` and applies ``val * rate``.
	 *
	 * Arithmetic operators stay same-currency-only on purpose: event calc
	 * normalizes every leaf to ``fx.target`` via ``convert`` before summing,
	 * so same-currency is always satisfied and the guards catch anything that
	 * slips through.
	 */
	max: MonetaryValueSchema;
}

/** TourOptionCreateSchema */
export interface TourOptionCreateSchema {
	/** Name */
	name?: string | null;
	/** Description */
	description?: string | null;
}

/** TourOptionModel */
export interface TourOptionModel {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Tour Meta Id */
	tour_meta_id: string | null;
	/** Name */
	name: string | null;
	/** Description */
	description: string | null;
	/** Cover Image Path */
	cover_image_path: string | null;
	/** Deleted At */
	deleted_at: string | null;
}

/** TourOptionPreviewSchema */
export interface TourOptionPreviewSchemaInput {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Name */
	name: string | null;
	/** Description */
	description?: string | null;
	/** Cover Image Path */
	cover_image_path?: string | null;
	/**
	 * Monetary value pair.
	 *
	 * Conversion happens inside the schema but takes an explicit ``FxContext``
	 * — no module-level rate singleton. Same-currency ``convert`` is a cheap
	 * ``return self``; cross-currency requires a matching entry in
	 * ``fx.rates`` and applies ``val * rate``.
	 *
	 * Arithmetic operators stay same-currency-only on purpose: event calc
	 * normalizes every leaf to ``fx.target`` via ``convert`` before summing,
	 * so same-currency is always satisfied and the guards catch anything that
	 * slips through.
	 */
	total_price: MonetaryValueSchema;
	/**
	 * Monetary value pair.
	 *
	 * Conversion happens inside the schema but takes an explicit ``FxContext``
	 * — no module-level rate singleton. Same-currency ``convert`` is a cheap
	 * ``return self``; cross-currency requires a matching entry in
	 * ``fx.rates`` and applies ``val * rate``.
	 *
	 * Arithmetic operators stay same-currency-only on purpose: event calc
	 * normalizes every leaf to ``fx.target`` via ``convert`` before summing,
	 * so same-currency is always satisfied and the guards catch anything that
	 * slips through.
	 */
	total_price_max: MonetaryValueSchema;
	/**
	 * Monetary value pair.
	 *
	 * Conversion happens inside the schema but takes an explicit ``FxContext``
	 * — no module-level rate singleton. Same-currency ``convert`` is a cheap
	 * ``return self``; cross-currency requires a matching entry in
	 * ``fx.rates`` and applies ``val * rate``.
	 *
	 * Arithmetic operators stay same-currency-only on purpose: event calc
	 * normalizes every leaf to ``fx.target`` via ``convert`` before summing,
	 * so same-currency is always satisfied and the guards catch anything that
	 * slips through.
	 */
	price_per_person: MonetaryValueSchema;
	/**
	 * Monetary value pair.
	 *
	 * Conversion happens inside the schema but takes an explicit ``FxContext``
	 * — no module-level rate singleton. Same-currency ``convert`` is a cheap
	 * ``return self``; cross-currency requires a matching entry in
	 * ``fx.rates`` and applies ``val * rate``.
	 *
	 * Arithmetic operators stay same-currency-only on purpose: event calc
	 * normalizes every leaf to ``fx.target`` via ``convert`` before summing,
	 * so same-currency is always satisfied and the guards catch anything that
	 * slips through.
	 */
	price_per_person_max: MonetaryValueSchema;
}

/** TourOptionPreviewSchema */
export interface TourOptionPreviewSchemaOutput {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Name */
	name: string | null;
	/** Description */
	description?: string | null;
	/** Cover Image Path */
	cover_image_path?: string | null;
	/**
	 * Monetary value pair.
	 *
	 * Conversion happens inside the schema but takes an explicit ``FxContext``
	 * — no module-level rate singleton. Same-currency ``convert`` is a cheap
	 * ``return self``; cross-currency requires a matching entry in
	 * ``fx.rates`` and applies ``val * rate``.
	 *
	 * Arithmetic operators stay same-currency-only on purpose: event calc
	 * normalizes every leaf to ``fx.target`` via ``convert`` before summing,
	 * so same-currency is always satisfied and the guards catch anything that
	 * slips through.
	 */
	total_price: MonetaryValueSchema;
	/**
	 * Monetary value pair.
	 *
	 * Conversion happens inside the schema but takes an explicit ``FxContext``
	 * — no module-level rate singleton. Same-currency ``convert`` is a cheap
	 * ``return self``; cross-currency requires a matching entry in
	 * ``fx.rates`` and applies ``val * rate``.
	 *
	 * Arithmetic operators stay same-currency-only on purpose: event calc
	 * normalizes every leaf to ``fx.target`` via ``convert`` before summing,
	 * so same-currency is always satisfied and the guards catch anything that
	 * slips through.
	 */
	total_price_max: MonetaryValueSchema;
	/**
	 * Monetary value pair.
	 *
	 * Conversion happens inside the schema but takes an explicit ``FxContext``
	 * — no module-level rate singleton. Same-currency ``convert`` is a cheap
	 * ``return self``; cross-currency requires a matching entry in
	 * ``fx.rates`` and applies ``val * rate``.
	 *
	 * Arithmetic operators stay same-currency-only on purpose: event calc
	 * normalizes every leaf to ``fx.target`` via ``convert`` before summing,
	 * so same-currency is always satisfied and the guards catch anything that
	 * slips through.
	 */
	price_per_person: MonetaryValueSchema;
	/**
	 * Monetary value pair.
	 *
	 * Conversion happens inside the schema but takes an explicit ``FxContext``
	 * — no module-level rate singleton. Same-currency ``convert`` is a cheap
	 * ``return self``; cross-currency requires a matching entry in
	 * ``fx.rates`` and applies ``val * rate``.
	 *
	 * Arithmetic operators stay same-currency-only on purpose: event calc
	 * normalizes every leaf to ``fx.target`` via ``convert`` before summing,
	 * so same-currency is always satisfied and the guards catch anything that
	 * slips through.
	 */
	price_per_person_max: MonetaryValueSchema;
}

/** TourOptionPublicResponse */
export interface TourOptionPublicResponse {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Events */
	events: (
		| (
				| ({
						typ: "activity";
				  } & ActivityEventPubReadOutput)
				| ({
						typ: "bus";
				  } & BusEventPubReadOutput)
				| ({
						typ: "flight";
				  } & FlightEventPubReadOutput)
				| ({
						typ: "housing";
				  } & HousingEventPubReadOutput)
				| ({
						typ: "ref";
				  } & InformationEventPubReadOutput)
				| ({
						typ: "train";
				  } & TrainEventPubReadOutput)
				| ({
						typ: "transfer";
				  } & TransferEventPubReadOutput)
		  )
		| MultiEventPubOutput
	)[];
	/**
	 * Monetary value pair.
	 *
	 * Conversion happens inside the schema but takes an explicit ``FxContext``
	 * — no module-level rate singleton. Same-currency ``convert`` is a cheap
	 * ``return self``; cross-currency requires a matching entry in
	 * ``fx.rates`` and applies ``val * rate``.
	 *
	 * Arithmetic operators stay same-currency-only on purpose: event calc
	 * normalizes every leaf to ``fx.target`` via ``convert`` before summing,
	 * so same-currency is always satisfied and the guards catch anything that
	 * slips through.
	 */
	total_price: MonetaryValueSchema;
	/**
	 * Monetary value pair.
	 *
	 * Conversion happens inside the schema but takes an explicit ``FxContext``
	 * — no module-level rate singleton. Same-currency ``convert`` is a cheap
	 * ``return self``; cross-currency requires a matching entry in
	 * ``fx.rates`` and applies ``val * rate``.
	 *
	 * Arithmetic operators stay same-currency-only on purpose: event calc
	 * normalizes every leaf to ``fx.target`` via ``convert`` before summing,
	 * so same-currency is always satisfied and the guards catch anything that
	 * slips through.
	 */
	total_price_max: MonetaryValueSchema;
}

/** TourOptionUpdateSchema */
export interface TourOptionUpdateSchema {
	/** Name */
	name?: string | null;
	/** Description */
	description?: string | null;
}

/** TourPackageModel */
export interface TourPackageModel {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/**
	 * Tour Option Id
	 * @format uuid
	 */
	tour_option_id: string;
	/** Supplier Id */
	supplier_id: string | null;
	/** Name */
	name: string;
	/**
	 * Expenses
	 * The expense calculation strategy.
	 */
	expenses:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseOutput)
				| ({
						typ: "per_person";
				  } & PerPersonExpenseOutput)
		  )
		| null;
	fees: FixedExpenseOutput | null;
	/**
	 * Markup
	 * The markup calculation strategy.
	 */
	markup:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseOutput)
				| ({
						typ: "percentage";
				  } & PercentageMarkup)
		  )
		| null;
}

/** TourRegenerateResponse */
export interface TourRegenerateResponse {
	/** Scheduled */
	scheduled: boolean;
	/** Landing */
	landing: boolean;
	/** Events Scheduled */
	events_scheduled: number;
	/** Events Skipped */
	events_skipped: number;
	/** Target Languages */
	target_languages: number;
}

/** TourScheduleModel */
export interface TourScheduleModel {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Is Seasonal */
	is_seasonal: boolean;
}

/**
 * TourSchedulePubSchema
 * Bookable dates for a published tour.
 *
 * Only the materialised ``occurrences`` cross the public boundary — the raw
 * fixed/excluded/recurrence rows and the seasonal commissions stay operator-only.
 */
export interface TourSchedulePubSchema {
	/** Occurrences */
	occurrences: string[];
	/**
	 * Window From
	 * @format date
	 */
	window_from: string;
	/**
	 * Window Until
	 * @format date
	 */
	window_until: string;
}

/** TourScheduleUpdate */
export interface TourScheduleUpdate {
	/** Is Seasonal */
	is_seasonal?: boolean | null;
}

/**
 * TourSnapshotSchema
 * Pure-Pydantic snapshot of everything a booking's price depends on, frozen at creation.
 */
export interface TourSnapshotSchemaInput {
	tour_meta: FrozenTourMeta;
	tour_option: FrozenTourOption;
	tour_financial_settings?: FrozenTourFinInput | null;
	/** Events */
	events: OrderTourEventSchemaInput[];
	/** @default "en" */
	display_lang?: LanguageCode;
	/** Events Localized */
	events_localized?: OrderTourEventSchemaInput[] | null;
	/** Packages */
	packages?: PricingPackageInput[];
	operator_financials?: PricingFinancialsInput | null;
	/** Fx Rates */
	fx_rates?: FrozenFxRateInput[];
	/**
	 * Agency Discount
	 * The markup calculation strategy.
	 */
	agency_discount?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseInput)
				| ({
						typ: "percentage";
				  } & PercentageMarkup)
		  )
		| null;
}

/**
 * TourSnapshotSchema
 * Pure-Pydantic snapshot of everything a booking's price depends on, frozen at creation.
 */
export interface TourSnapshotSchemaOutput {
	tour_meta: FrozenTourMeta;
	tour_option: FrozenTourOption;
	tour_financial_settings?: FrozenTourFinOutput | null;
	/** Events */
	events: OrderTourEventSchemaOutput[];
	/** @default "en" */
	display_lang?: LanguageCode;
	/** Events Localized */
	events_localized?: OrderTourEventSchemaOutput[] | null;
	/** Packages */
	packages?: PricingPackageOutput[];
	operator_financials?: PricingFinancialsOutput | null;
	/** Fx Rates */
	fx_rates?: FrozenFxRateOutput[];
	/**
	 * Agency Discount
	 * The markup calculation strategy.
	 */
	agency_discount?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseOutput)
				| ({
						typ: "percentage";
				  } & PercentageMarkup)
		  )
		| null;
}

/**
 * TourStatisticsResponse
 * Tour-level order, revenue & profit statistics, all in the operator's base
 * currency. Every field defaults to 0 so the endpoint never returns null/empty.
 *
 * Planned figures are summed over the confirmed booking set, each order priced
 * from its own frozen snapshot — the pax, the categories the client actually
 * chose and the FX table pinned at booking time — through the same
 * ``planned_of`` the reconciliation board and the order detail use. A tour
 * with no orders therefore reports 0, not a catalog projection; live option
 * pricing is what ``/tour/{id}/option/{id}/summary`` and the catalog are for.
 * An order whose snapshot cannot be priced (operator financials wiped, an
 * unregistered FX pair) contributes 0 rather than failing the response.
 *
 * - ``planned_revenue`` — planned gross agency price (cost+markup+fees+taxes).
 * - ``planned_cost`` — planned supplier cost.
 * - ``planned_profit`` = planned_revenue − planned_cost.
 *
 * Realized figures are over the same confirmed booking set ({CONFIRMED,
 * IN_PROGRESS, COMPLETED}):
 *
 * - ``confirmed_revenue`` — actually billed: sum of issued invoice totals.
 * - ``real_cost`` — actually recorded supplier-payment ledger, FX-converted to
 *   base (amount × pinned rate). Captures real cost + exchange differences.
 * - ``real_profit`` = confirmed_revenue − real_cost (real-time performance).
 *
 * Cash-basis figures come off the money ledger and answer a different question
 * — not what was agreed, but what has actually moved. They span every booking
 * on the tour regardless of status, because a cancelled order can still leave
 * a retained deposit or an already-paid supplier on the books, and dropping
 * those would overstate the tour's position:
 *
 * - ``revenue_accrued`` / ``cost_accrued`` — billed and committed. These are
 *   the ledger's own restatement of the two accrual figures above and should
 *   track them; a gap means an invoice or supplier payment bypassed a seam.
 * - ``revenue_settled`` / ``cost_settled`` — cash received and cash paid out.
 * - ``receivable`` — still owed to the operator by agencies and tourists.
 * - ``payable`` — still owed by the operator to suppliers.
 * - ``settled_profit`` = revenue_settled − cost_settled: margin in hand, as
 *   opposed to ``real_profit``, which is margin on paper.
 */
export interface TourStatisticsResponse {
	/**
	 * Total Orders
	 * @default 0
	 */
	total_orders?: number;
	/**
	 * Completed
	 * @default 0
	 */
	completed?: number;
	/**
	 * In Progress
	 * @default 0
	 */
	in_progress?: number;
	/**
	 * Tourists
	 * @default 0
	 */
	tourists?: number;
	/**
	 * Planned Revenue
	 * @default "0"
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	planned_revenue?: string;
	/**
	 * Planned Cost
	 * @default "0"
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	planned_cost?: string;
	/**
	 * Planned Profit
	 * @default "0"
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	planned_profit?: string;
	/**
	 * Confirmed Revenue
	 * @default "0"
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	confirmed_revenue?: string;
	/**
	 * Real Cost
	 * @default "0"
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	real_cost?: string;
	/**
	 * Real Profit
	 * @default "0"
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	real_profit?: string;
	/**
	 * Revenue Accrued
	 * @default "0"
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	revenue_accrued?: string;
	/**
	 * Revenue Settled
	 * @default "0"
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	revenue_settled?: string;
	/**
	 * Receivable
	 * @default "0"
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	receivable?: string;
	/**
	 * Cost Accrued
	 * @default "0"
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	cost_accrued?: string;
	/**
	 * Cost Settled
	 * @default "0"
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	cost_settled?: string;
	/**
	 * Payable
	 * @default "0"
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	payable?: string;
	/**
	 * Settled Profit
	 * @default "0"
	 * @pattern ^(?!^[-+.]*$)[+-]?0*\d*\.?\d*$
	 */
	settled_profit?: string;
	/** @default "USD" */
	currency?: Currency;
}

/** TourSummaryResponse */
export interface TourSummaryResponse {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
	/** Events */
	events: (
		| ({
				typ: "individual_bill";
		  } & StandaloneBillableOutput)
		| ({
				typ: "package_bill";
		  } & PackageBillableOutput)
	)[];
	cost: TourMinMaxCostSchemaOutput;
	markup: TourMinMaxCostSchemaOutput;
	fees: TourMinMaxCostSchemaOutput;
	total: TourMinMaxCostSchemaOutput;
}

/** TrainDetailPubSchema */
export interface TrainDetailPubSchemaInput {
	/** Hop */
	hop?: TrainHopPubSchemaInput[] | null;
	expenses?: ChargePubSchema | null;
}

/** TrainDetailPubSchema */
export interface TrainDetailPubSchemaOutput {
	/** Hop */
	hop?: TrainHopPubSchemaOutput[] | null;
	expenses?: ChargePubSchema | null;
}

/** TrainDetailSchema */
export interface TrainDetailSchemaInput {
	/** Hop */
	hop?: TrainHopSchemaInput[] | null;
	/**
	 * Expenses
	 * The charge calculation strategy.
	 */
	expenses?:
		| (
				| ({
						typ: "fixed";
				  } & FixedChargeInput)
				| ({
						typ: "per_person";
				  } & PerPersonChargeInput)
		  )
		| null;
}

/** TrainDetailSchema */
export interface TrainDetailSchemaOutput {
	/** Hop */
	hop?: TrainHopSchemaOutput[] | null;
	/**
	 * Expenses
	 * The charge calculation strategy.
	 */
	expenses?:
		| (
				| ({
						typ: "fixed";
				  } & FixedChargeOutput)
				| ({
						typ: "per_person";
				  } & PerPersonChargeOutput)
		  )
		| null;
}

/** TrainEvent */
export interface TrainEventInput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "train"
	 */
	typ?: "train";
	details?: TrainDetailSchemaInput | null;
}

/** TrainEvent */
export interface TrainEventOutput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "train"
	 */
	typ?: "train";
	details?: TrainDetailSchemaOutput | null;
}

/** TrainEventPubRead */
export interface TrainEventPubReadInput {
	/** Name */
	name?: string | null;
	/** Description */
	description?: string | null;
	/** Day */
	day?: number | null;
	/** Position */
	position?: number | null;
	/** Is Optional */
	is_optional?: boolean | null;
	/** Images */
	images?: EventImagePubSchema[];
	/**
	 * Date
	 * Calendar date this event falls on, computed as the booking's departure date plus ``day - 1``. Null in the catalogue, where a template tour has no departure date to anchor against.
	 */
	date?: string | null;
	/**
	 * Typ
	 * @default "train"
	 */
	typ?: "train";
	details?: TrainDetailPubSchemaInput | null;
}

/** TrainEventPubRead */
export interface TrainEventPubReadOutput {
	/** Name */
	name?: string | null;
	/** Description */
	description?: string | null;
	/** Day */
	day?: number | null;
	/** Position */
	position?: number | null;
	/** Is Optional */
	is_optional?: boolean | null;
	/** Images */
	images?: EventImagePubSchema[];
	/**
	 * Date
	 * Calendar date this event falls on, computed as the booking's departure date plus ``day - 1``. Null in the catalogue, where a template tour has no departure date to anchor against.
	 */
	date?: string | null;
	/**
	 * Typ
	 * @default "train"
	 */
	typ?: "train";
	details?: TrainDetailPubSchemaOutput | null;
}

/** TrainEventTypeRead */
export interface TrainEventTypeReadInput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "train"
	 */
	typ?: "train";
	details?: TrainDetailSchemaInput | null;
	/**
	 * Id
	 * Option (alternative) id; populated on read, ignored on write.
	 */
	id?: string | null;
}

/** TrainEventTypeRead */
export interface TrainEventTypeReadOutput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "train"
	 */
	typ?: "train";
	details?: TrainDetailSchemaOutput | null;
	/**
	 * Id
	 * Option (alternative) id; populated on read, ignored on write.
	 */
	id?: string | null;
}

/** TrainHopPubSchema */
export interface TrainHopPubSchemaInput {
	departure?: TrainJourneyPointPubSchemaInput | null;
	arrival?: TrainJourneyPointPubSchemaInput | null;
}

/** TrainHopPubSchema */
export interface TrainHopPubSchemaOutput {
	departure?: TrainJourneyPointPubSchemaOutput | null;
	arrival?: TrainJourneyPointPubSchemaOutput | null;
}

/**
 * TrainHopSchema
 * Represents a single leg of a train journey.
 */
export interface TrainHopSchemaInput {
	/** Details of the departure. */
	departure?: TrainJourneyPointSchemaInput | null;
	/** Details of the arrival. */
	arrival?: TrainJourneyPointSchemaInput | null;
}

/**
 * TrainHopSchema
 * Represents a single leg of a train journey.
 */
export interface TrainHopSchemaOutput {
	/** Details of the departure. */
	departure?: TrainJourneyPointSchemaOutput | null;
	/** Details of the arrival. */
	arrival?: TrainJourneyPointSchemaOutput | null;
}

/** TrainJourneyPointPubSchema */
export interface TrainJourneyPointPubSchemaInput {
	/** Date */
	date?: string | null;
	time?: TimeSchema | null;
	/** Location */
	location?: LocationOutSchema | LocationRefSchema | LocationInSchema | null;
}

/** TrainJourneyPointPubSchema */
export interface TrainJourneyPointPubSchemaOutput {
	/** Date */
	date?: string | null;
	time?: TimeSchema | null;
	/** Location */
	location?: LocationOutSchema | LocationRefSchema | LocationInSchema | null;
}

/**
 * TrainJourneyPointSchema
 * Represents either a departure or arrival point for the train journey.
 */
export interface TrainJourneyPointSchemaInput {
	/** The time of an event */
	time?: TimeSchema | null;
	/** Location */
	location?: LocationOutSchema | LocationRefSchema | LocationInSchema | null;
}

/**
 * TrainJourneyPointSchema
 * Represents either a departure or arrival point for the train journey.
 */
export interface TrainJourneyPointSchemaOutput {
	/** The time of an event */
	time?: TimeSchema | null;
	/** Location */
	location?: LocationOutSchema | LocationRefSchema | LocationInSchema | null;
}

/** TrainSingleEvent */
export interface TrainSingleEventInput {
	/**
	 * Day
	 * Event's day number in a tour
	 */
	day: number;
	/**
	 * Position
	 * Event's order number in a tour
	 * @min 0
	 */
	position: number;
	/**
	 * Is Optional
	 * @default false
	 */
	is_optional?: boolean;
	/**
	 * Images
	 * Images of the event slot, primary first; populated on read, ignored on write.
	 */
	images?: EventImageSchema[];
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "train"
	 */
	typ?: "train";
	details?: TrainDetailSchemaInput | null;
}

/** TrainSingleEvent */
export interface TrainSingleEventOutput {
	/**
	 * Day
	 * Event's day number in a tour
	 */
	day: number;
	/**
	 * Position
	 * Event's order number in a tour
	 * @min 0
	 */
	position: number;
	/**
	 * Is Optional
	 * @default false
	 */
	is_optional?: boolean;
	/**
	 * Images
	 * Images of the event slot, primary first; populated on read, ignored on write.
	 */
	images?: EventImageSchema[];
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "train"
	 */
	typ?: "train";
	details?: TrainDetailSchemaOutput | null;
}

/** TransferCarCategoriesVariant */
export interface TransferCarCategoriesVariantInput {
	typ?: VehicleBodyType | null;
	/** Pax */
	pax?: number | null;
	/**
	 * Description
	 * Car description
	 */
	description?: string | null;
	/** Categories */
	categories?: TransferCarPackageCategorySchemaInput[] | null;
}

/** TransferCarCategoriesVariant */
export interface TransferCarCategoriesVariantOutput {
	typ?: VehicleBodyType | null;
	/** Pax */
	pax?: number | null;
	/**
	 * Description
	 * Car description
	 */
	description?: string | null;
	/** Categories */
	categories?: TransferCarPackageCategorySchemaOutput[] | null;
}

/** TransferCarCategoryPubSchema */
export interface TransferCarCategoryPubSchema {
	/** Name */
	name?: string | null;
}

/**
 * TransferCarPackageCategorySchema
 * Represents a car variant.
 */
export interface TransferCarPackageCategorySchemaInput {
	/**
	 * Name
	 * Car category, i.e. standard, premium e.t.c.
	 */
	name?: string | null;
	/** Charge for this car of this category. */
	expenses?: FixedChargeInput | null;
}

/**
 * TransferCarPackageCategorySchema
 * Represents a car variant.
 */
export interface TransferCarPackageCategorySchemaOutput {
	/**
	 * Name
	 * Car category, i.e. standard, premium e.t.c.
	 */
	name?: string | null;
	/** Charge for this car of this category. */
	expenses?: FixedChargeOutput | null;
}

/**
 * TransferCarPubSchema
 * One car variant — body type, capacity and description survive; only its
 * charge is stripped. Covers both ``PerCarExpense`` and
 * ``PerCarCategoryExpense`` cars, hence ``categories``.
 */
export interface TransferCarPubSchema {
	typ?: VehicleBodyType | null;
	/** Pax */
	pax?: number | null;
	/** Description */
	description?: string | null;
	/** Categories */
	categories?: TransferCarCategoryPubSchema[] | null;
}

/** TransferCarVariant */
export interface TransferCarVariantInput {
	typ?: VehicleBodyType | null;
	/** Pax */
	pax?: number | null;
	/**
	 * Description
	 * Car description
	 */
	description?: string | null;
	expenses?: FixedChargeInput | null;
}

/** TransferCarVariant */
export interface TransferCarVariantOutput {
	typ?: VehicleBodyType | null;
	/** Pax */
	pax?: number | null;
	/**
	 * Description
	 * Car description
	 */
	description?: string | null;
	expenses?: FixedChargeOutput | null;
}

/** TransferDetailsPubSchema */
export interface TransferDetailsPubSchemaInput {
	typ?: TransferTypes | null;
	departure?: TransferJourneyPointPubSchemaInput | null;
	arrival?: TransferJourneyPointPubSchemaInput | null;
	expenses?: TransferExpensesPubSchemaInput | null;
}

/** TransferDetailsPubSchema */
export interface TransferDetailsPubSchemaOutput {
	typ?: TransferTypes | null;
	departure?: TransferJourneyPointPubSchemaOutput | null;
	arrival?: TransferJourneyPointPubSchemaOutput | null;
	expenses?: TransferExpensesPubSchemaOutput | null;
}

/**
 * TransferDetailsSchema
 * Represents a transfer journey with departure and arrival details.
 */
export interface TransferDetailsSchemaInput {
	typ?: TransferTypes | null;
	/** Details of the departure. */
	departure?: TransferJourneyPointSchemaInput | null;
	/** Details of the arrival. */
	arrival?: TransferJourneyPointSchemaInput | null;
	/** Expenses */
	expenses?:
		| (
				| ({
						typ: "fixed";
				  } & FixedChargeInput)
				| ({
						typ: "per_car";
				  } & PerCarExpenseInput)
				| ({
						typ: "per_car_category";
				  } & PerCarCategoryExpenseInput)
				| ({
						typ: "per_person";
				  } & PerPersonChargeInput)
		  )
		| null;
}

/**
 * TransferDetailsSchema
 * Represents a transfer journey with departure and arrival details.
 */
export interface TransferDetailsSchemaOutput {
	typ?: TransferTypes | null;
	/** Details of the departure. */
	departure?: TransferJourneyPointSchemaOutput | null;
	/** Details of the arrival. */
	arrival?: TransferJourneyPointSchemaOutput | null;
	/** Expenses */
	expenses?:
		| (
				| ({
						typ: "fixed";
				  } & FixedChargeOutput)
				| ({
						typ: "per_car";
				  } & PerCarExpenseOutput)
				| ({
						typ: "per_car_category";
				  } & PerCarCategoryExpenseOutput)
				| ({
						typ: "per_person";
				  } & PerPersonChargeOutput)
		  )
		| null;
}

/** TransferEvent */
export interface TransferEventInput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "transfer"
	 */
	typ?: "transfer";
	details?: TransferDetailsSchemaInput | null;
}

/** TransferEvent */
export interface TransferEventOutput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "transfer"
	 */
	typ?: "transfer";
	details?: TransferDetailsSchemaOutput | null;
}

/** TransferEventPubRead */
export interface TransferEventPubReadInput {
	/** Name */
	name?: string | null;
	/** Description */
	description?: string | null;
	/** Day */
	day?: number | null;
	/** Position */
	position?: number | null;
	/** Is Optional */
	is_optional?: boolean | null;
	/** Images */
	images?: EventImagePubSchema[];
	/**
	 * Date
	 * Calendar date this event falls on, computed as the booking's departure date plus ``day - 1``. Null in the catalogue, where a template tour has no departure date to anchor against.
	 */
	date?: string | null;
	/**
	 * Typ
	 * @default "transfer"
	 */
	typ?: "transfer";
	details?: TransferDetailsPubSchemaInput | null;
}

/** TransferEventPubRead */
export interface TransferEventPubReadOutput {
	/** Name */
	name?: string | null;
	/** Description */
	description?: string | null;
	/** Day */
	day?: number | null;
	/** Position */
	position?: number | null;
	/** Is Optional */
	is_optional?: boolean | null;
	/** Images */
	images?: EventImagePubSchema[];
	/**
	 * Date
	 * Calendar date this event falls on, computed as the booking's departure date plus ``day - 1``. Null in the catalogue, where a template tour has no departure date to anchor against.
	 */
	date?: string | null;
	/**
	 * Typ
	 * @default "transfer"
	 */
	typ?: "transfer";
	details?: TransferDetailsPubSchemaOutput | null;
}

/** TransferEventTypeRead */
export interface TransferEventTypeReadInput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "transfer"
	 */
	typ?: "transfer";
	details?: TransferDetailsSchemaInput | null;
	/**
	 * Id
	 * Option (alternative) id; populated on read, ignored on write.
	 */
	id?: string | null;
}

/** TransferEventTypeRead */
export interface TransferEventTypeReadOutput {
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "transfer"
	 */
	typ?: "transfer";
	details?: TransferDetailsSchemaOutput | null;
	/**
	 * Id
	 * Option (alternative) id; populated on read, ignored on write.
	 */
	id?: string | null;
}

/** TransferExpensesPubSchema */
export interface TransferExpensesPubSchemaInput {
	typ?: ExpenseType | null;
	/** Tiers */
	tiers?: GroupSizeTierPubSchema[] | null;
	/** Cars */
	cars?: TransferCarPubSchema[] | null;
}

/** TransferExpensesPubSchema */
export interface TransferExpensesPubSchemaOutput {
	typ?: ExpenseType | null;
	/** Tiers */
	tiers?: GroupSizeTierPubSchema[] | null;
	/** Cars */
	cars?: TransferCarPubSchema[] | null;
}

/** TransferJourneyPointPubSchema */
export interface TransferJourneyPointPubSchemaInput {
	/** Date */
	date?: string | null;
	time?: TimeSchema | null;
	/** Location */
	location?: LocationOutSchema | LocationRefSchema | LocationInSchema | null;
}

/** TransferJourneyPointPubSchema */
export interface TransferJourneyPointPubSchemaOutput {
	/** Date */
	date?: string | null;
	time?: TimeSchema | null;
	/** Location */
	location?: LocationOutSchema | LocationRefSchema | LocationInSchema | null;
}

/**
 * TransferJourneyPointSchema
 * Represents either a departure or arrival point for the journey.
 */
export interface TransferJourneyPointSchemaInput {
	/** The time of an event */
	time?: TimeSchema | null;
	/** Location */
	location?: LocationOutSchema | LocationRefSchema | LocationInSchema | null;
}

/**
 * TransferJourneyPointSchema
 * Represents either a departure or arrival point for the journey.
 */
export interface TransferJourneyPointSchemaOutput {
	/** The time of an event */
	time?: TimeSchema | null;
	/** Location */
	location?: LocationOutSchema | LocationRefSchema | LocationInSchema | null;
}

/** TransferSingleEvent */
export interface TransferSingleEventInput {
	/**
	 * Day
	 * Event's day number in a tour
	 */
	day: number;
	/**
	 * Position
	 * Event's order number in a tour
	 * @min 0
	 */
	position: number;
	/**
	 * Is Optional
	 * @default false
	 */
	is_optional?: boolean;
	/**
	 * Images
	 * Images of the event slot, primary first; populated on read, ignored on write.
	 */
	images?: EventImageSchema[];
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "transfer"
	 */
	typ?: "transfer";
	details?: TransferDetailsSchemaInput | null;
}

/** TransferSingleEvent */
export interface TransferSingleEventOutput {
	/**
	 * Day
	 * Event's day number in a tour
	 */
	day: number;
	/**
	 * Position
	 * Event's order number in a tour
	 * @min 0
	 */
	position: number;
	/**
	 * Is Optional
	 * @default false
	 */
	is_optional?: boolean;
	/**
	 * Images
	 * Images of the event slot, primary first; populated on read, ignored on write.
	 */
	images?: EventImageSchema[];
	/**
	 * Name
	 * Event's name
	 */
	name?: string | null;
	/**
	 * Description
	 * Event's description
	 */
	description?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Package Id */
	package_id?: string | null;
	/**
	 * Typ
	 * @default "transfer"
	 */
	typ?: "transfer";
	details?: TransferDetailsSchemaOutput | null;
}

/** UpdateFinancialSchema */
export interface UpdateFinancialSchema {
	currency_type?: Currency | null;
	/**
	 * Markup
	 * The markup calculation strategy.
	 */
	markup?:
		| (
				| ({
						typ: "fixed";
				  } & FixedExpenseInput)
				| ({
						typ: "percentage";
				  } & PercentageMarkup)
		  )
		| null;
	foc?: FocPolicy | null;
}

/** UpdateUserSchema */
export interface UpdateUserSchema {
	role?: UserRoles | null;
}

/** UserProfileUpdate */
export interface UserProfileUpdate {
	/** First Name */
	first_name?: string | null;
	/** Last Name */
	last_name?: string | null;
	/** Title */
	title?: string | null;
	/** Phone Number */
	phone_number?: string | null;
	/** Location */
	location?: string | null;
	default_currency?: Currency | null;
}

/** ValidationError */
export interface ValidationError {
	/** Location */
	loc: (string | number)[];
	/** Message */
	msg: string;
	/** Error Type */
	type: string;
}

/** VoucherResponse */
export interface VoucherResponse {
	/**
	 * Booking Id
	 * @format uuid
	 */
	booking_id: string;
	/** Order Number */
	order_number: string;
	/** Url */
	url: string;
	/** File Name */
	file_name: string | null;
}

/** Role */
export enum StaffInviteRoleEnum {
	OperatorSalesManager = "operator_sales_manager",
	OperatorAccountant = "operator_accountant"
}

/** Role */
export enum StaffInviteResultRoleEnum {
	OperatorSalesManager = "operator_sales_manager",
	OperatorAccountant = "operator_accountant"
}

/** Role */
export enum StaffReadRoleEnum {
	OperatorSalesManager = "operator_sales_manager",
	OperatorAccountant = "operator_accountant"
}

export enum StaffUpdateRoleEnum {
	OperatorSalesManager = "operator_sales_manager",
	OperatorAccountant = "operator_accountant"
}

export enum StaffUpdateStatusEnum {
	Active = "active",
	Inactive = "inactive"
}

export interface GetAllUsersAdminUserAllGetParams {
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @min 1
	 * @max 100
	 * @default 10
	 */
	limit?: number;
}

export interface GetUserAdminUserIdGetParams {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
}

export interface UpdateUserAdminUserIdPatchParams {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
}

export interface DeleteUserAdminUserIdDeleteParams {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
}

export interface CreateUserAdminUserPostParams {
	/** @default "authenticated_user" */
	role?: UserRoles;
}

export interface SuggestLocationsTourCatalogSuggestGetParams {
	/**
	 * Q
	 * @minLength 1
	 * @maxLength 128
	 */
	q: string;
	/** @default "en" */
	lang?: LanguageCode;
	/**
	 * Limit
	 * @min 1
	 * @max 20
	 * @default 10
	 */
	limit?: number;
}

export interface ListFiltersTourCatalogFiltersGetParams {
	/** @default "en" */
	lang?: LanguageCode;
}

export interface ListPublicCatalogTourCatalogPublicGetParams {
	/** Sort */
	sort?: TourCatalogSort | null;
	/** Q */
	q?: string | null;
	/** Categories */
	categories?: TourCategory[] | null;
	/** Duration Days Min */
	duration_days_min?: number | null;
	/** Duration Days Max */
	duration_days_max?: number | null;
	/** City */
	city?: string[] | null;
	/** Country */
	country?: string[] | null;
	/** Tour Lang */
	tour_lang?: LanguageCode[] | null;
	/** @default "en" */
	read_lang?: LanguageCode;
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @min 1
	 * @max 100
	 * @default 10
	 */
	limit?: number;
}

export interface ListAgencyCatalogTourCatalogAgencyGetParams {
	/** Sort */
	sort?: TourCatalogSort | null;
	/** Q */
	q?: string | null;
	/** Categories */
	categories?: TourCategory[] | null;
	/** Duration Days Min */
	duration_days_min?: number | null;
	/** Duration Days Max */
	duration_days_max?: number | null;
	/** City */
	city?: string[] | null;
	/** Country */
	country?: string[] | null;
	/** Tour Lang */
	tour_lang?: LanguageCode[] | null;
	/** @default "en" */
	read_lang?: LanguageCode;
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @min 1
	 * @max 100
	 * @default 10
	 */
	limit?: number;
}

export interface GetTourSummaryTourTourIdOptionOptionIdSummaryGetParams {
	/** @default "USD" */
	currency?: Currency;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
	/**
	 * Option Id
	 * @format uuid
	 */
	optionId: string;
}

export interface ListAllTourOptionsTourTourIdOptionAllGetParams {
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @min 1
	 * @max 100
	 * @default 10
	 */
	limit?: number;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

/** Payload */
export type CreateTourOptionTourTourIdOptionCreatePostPayload =
	TourOptionCreateSchema | null;

export interface CreateTourOptionTourTourIdOptionCreatePostParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface UpdateTourOptionTourTourIdOptionOptionIdPatchParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
	/**
	 * Option Id
	 * @format uuid
	 */
	optionId: string;
}

export interface DeleteOptionTourTourIdOptionOptionIdDeleteParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
	/**
	 * Option Id
	 * @format uuid
	 */
	optionId: string;
}

export interface UploadOptionCoverTourTourIdOptionOptionIdCoverPostParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
	/**
	 * Option Id
	 * @format uuid
	 */
	optionId: string;
}

export interface DeleteOptionCoverTourTourIdOptionOptionIdCoverDeleteParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
	/**
	 * Option Id
	 * @format uuid
	 */
	optionId: string;
}

export interface GetTourFinancialsTourTourIdFinanceGetParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface CreateTourFinancialsTourTourIdFinancePostParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface UpdateTourFinancialsTourTourIdFinancePatchParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

/** Event */
export type CreateLibraryEventTourEventLibraryPostPayload =
	| ({
			typ: "ref";
	  } & InformationEventInput)
	| ({
			typ: "bus";
	  } & BusEventInput)
	| ({
			typ: "train";
	  } & TrainEventInput)
	| ({
			typ: "transfer";
	  } & TransferEventInput)
	| ({
			typ: "activity";
	  } & ActivityEventInput)
	| ({
			typ: "housing";
	  } & HousingEventInput)
	| ({
			typ: "flight";
	  } & FlightEventInput)
	| ({
			typ: "guide";
	  } & GuideEventInput)
	| ({
			typ: "supplementary";
	  } & SupplementaryEventInput);

export interface ListLibraryEventsTourEventLibraryGetParams {
	/** Typ */
	typ?: EventTypes | null;
	/** Q */
	q?: string | null;
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @min 1
	 * @max 100
	 * @default 10
	 */
	limit?: number;
}

export interface GetLibraryEventTourEventLibraryLibraryIdGetParams {
	/**
	 * Library Id
	 * @format uuid
	 */
	libraryId: string;
}

/** Event */
export type UpdateLibraryEventTourEventLibraryLibraryIdPatchPayload =
	| ({
			typ: "ref";
	  } & InformationEventInput)
	| ({
			typ: "bus";
	  } & BusEventInput)
	| ({
			typ: "train";
	  } & TrainEventInput)
	| ({
			typ: "transfer";
	  } & TransferEventInput)
	| ({
			typ: "activity";
	  } & ActivityEventInput)
	| ({
			typ: "housing";
	  } & HousingEventInput)
	| ({
			typ: "flight";
	  } & FlightEventInput)
	| ({
			typ: "guide";
	  } & GuideEventInput)
	| ({
			typ: "supplementary";
	  } & SupplementaryEventInput);

export interface UpdateLibraryEventTourEventLibraryLibraryIdPatchParams {
	/**
	 * Library Id
	 * @format uuid
	 */
	libraryId: string;
}

export interface DeleteLibraryEventTourEventLibraryLibraryIdDeleteParams {
	/**
	 * Library Id
	 * @format uuid
	 */
	libraryId: string;
}

export interface UploadLibraryImagesTourEventLibraryLibraryIdImagesPostParams {
	/**
	 * Library Id
	 * @format uuid
	 */
	libraryId: string;
}

export interface ListLibraryImagesTourEventLibraryLibraryIdImagesAllGetParams {
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @min 1
	 * @max 100
	 * @default 10
	 */
	limit?: number;
	/**
	 * Library Id
	 * @format uuid
	 */
	libraryId: string;
}

export interface DeleteLibraryImageTourEventLibraryLibraryIdImagesImageIdDeleteParams {
	/**
	 * Library Id
	 * @format uuid
	 */
	libraryId: string;
	/**
	 * Image Id
	 * @format uuid
	 */
	imageId: string;
}

export interface SetPrimaryLibraryImageTourEventLibraryLibraryIdImagesImageIdSetPrimaryPatchParams {
	/**
	 * Library Id
	 * @format uuid
	 */
	libraryId: string;
	/**
	 * Image Id
	 * @format uuid
	 */
	imageId: string;
}

/** Event */
export type CreateEventTourTourIdOptionIdEventCreatePostPayload =
	| (
			| ({
					typ: "ref";
			  } & InformationSingleEventInput)
			| ({
					typ: "bus";
			  } & BusSingleEventInput)
			| ({
					typ: "train";
			  } & TrainSingleEventInput)
			| ({
					typ: "transfer";
			  } & TransferSingleEventInput)
			| ({
					typ: "activity";
			  } & ActivitySingleEventInput)
			| ({
					typ: "housing";
			  } & HousingSingleEventInput)
			| ({
					typ: "flight";
			  } & FlightSingleEventInput)
			| ({
					typ: "guide";
			  } & GuideSingleEventInput)
			| ({
					typ: "supplementary";
			  } & SupplementarySingleEventInput)
	  )
	| MultiEvent;

export interface CreateEventTourTourIdOptionIdEventCreatePostParams {
	/** @default "en" */
	lang?: LanguageCode;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
	/**
	 * Option Id
	 * @format uuid
	 */
	optionId: string;
}

export interface ListTourEventsTourTourIdOptionIdEventGetParams {
	/** Day */
	day?: number | null;
	/** @default "en" */
	lang?: LanguageCode;
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/** Limit */
	limit?: number | null;
	/**
	 * Option Id
	 * @format uuid
	 */
	optionId: string;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface GetTourEventTourTourIdOptionIdEventEventIdGetParams {
	/** @default "en" */
	lang?: LanguageCode;
	/**
	 * Option Id
	 * @format uuid
	 */
	optionId: string;
	/**
	 * Event Id
	 * @format uuid
	 */
	eventId: string;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface DeleteTourEventTourTourIdOptionIdEventEventIdDeleteParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
	/**
	 * Option Id
	 * @format uuid
	 */
	optionId: string;
	/**
	 * Event Id
	 * @format uuid
	 */
	eventId: string;
}

export interface ValidateEventTourTourIdOptionIdEventEventIdValidateGetParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
	/**
	 * Option Id
	 * @format uuid
	 */
	optionId: string;
	/**
	 * Event Id
	 * @format uuid
	 */
	eventId: string;
}

export interface ReorderEventTourTourIdOptionIdEventEventIdReorderPostParams {
	/** @default "en" */
	lang?: LanguageCode;
	/**
	 * Option Id
	 * @format uuid
	 */
	optionId: string;
	/**
	 * Event Id
	 * @format uuid
	 */
	eventId: string;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface SetEventOptionalTourTourIdOptionIdEventEventIdOptionalPatchParams {
	/** @default "en" */
	lang?: LanguageCode;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
	/**
	 * Option Id
	 * @format uuid
	 */
	optionId: string;
	/**
	 * Event Id
	 * @format uuid
	 */
	eventId: string;
}

/** Event */
export type UpdateSingleEventTourTourIdOptionIdEventSingleEventIdUpdatePatchPayload =

		| ({
				typ: "ref";
		  } & InformationEventInput)
		| ({
				typ: "bus";
		  } & BusEventInput)
		| ({
				typ: "train";
		  } & TrainEventInput)
		| ({
				typ: "transfer";
		  } & TransferEventInput)
		| ({
				typ: "activity";
		  } & ActivityEventInput)
		| ({
				typ: "housing";
		  } & HousingEventInput)
		| ({
				typ: "flight";
		  } & FlightEventInput)
		| ({
				typ: "guide";
		  } & GuideEventInput)
		| ({
				typ: "supplementary";
		  } & SupplementaryEventInput);

export interface UpdateSingleEventTourTourIdOptionIdEventSingleEventIdUpdatePatchParams {
	/** @default "en" */
	lang?: LanguageCode;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
	/**
	 * Option Id
	 * @format uuid
	 */
	optionId: string;
	/**
	 * Event Id
	 * @format uuid
	 */
	eventId: string;
}

/** Move */
export type MoveEventToMultiTourTourIdOptionIdEventSingleEventIdMoveToMultiTargetEventIdPostPayload =
	MoveToMultiSchema | null;

export interface MoveEventToMultiTourTourIdOptionIdEventSingleEventIdMoveToMultiTargetEventIdPostParams {
	/** @default "en" */
	lang?: LanguageCode;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
	/**
	 * Option Id
	 * @format uuid
	 */
	optionId: string;
	/**
	 * Event Id
	 * @format uuid
	 */
	eventId: string;
	/**
	 * Target Event Id
	 * @format uuid
	 */
	targetEventId: string;
}

export interface ReorderEventOptionsTourTourIdOptionIdEventMultiEventIdReorderOptionsPostParams {
	/** @default "en" */
	lang?: LanguageCode;
	/**
	 * Option Id
	 * @format uuid
	 */
	optionId: string;
	/**
	 * Event Id
	 * @format uuid
	 */
	eventId: string;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

/** Option */
export type AddEventOptionTourTourIdOptionIdEventMultiEventIdAddOptionPostPayload =

		| ({
				typ: "ref";
		  } & InformationEventInput)
		| ({
				typ: "bus";
		  } & BusEventInput)
		| ({
				typ: "train";
		  } & TrainEventInput)
		| ({
				typ: "transfer";
		  } & TransferEventInput)
		| ({
				typ: "activity";
		  } & ActivityEventInput)
		| ({
				typ: "housing";
		  } & HousingEventInput)
		| ({
				typ: "flight";
		  } & FlightEventInput)
		| ({
				typ: "guide";
		  } & GuideEventInput)
		| ({
				typ: "supplementary";
		  } & SupplementaryEventInput);

export interface AddEventOptionTourTourIdOptionIdEventMultiEventIdAddOptionPostParams {
	/** @default "en" */
	lang?: LanguageCode;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
	/**
	 * Option Id
	 * @format uuid
	 */
	optionId: string;
	/**
	 * Event Id
	 * @format uuid
	 */
	eventId: string;
}

/** Option */
export type UpdateEventOptionTourTourIdOptionIdEventMultiEventIdUpdateOptionEventOptionIdPatchPayload =

		| ({
				typ: "ref";
		  } & InformationEventInput)
		| ({
				typ: "bus";
		  } & BusEventInput)
		| ({
				typ: "train";
		  } & TrainEventInput)
		| ({
				typ: "transfer";
		  } & TransferEventInput)
		| ({
				typ: "activity";
		  } & ActivityEventInput)
		| ({
				typ: "housing";
		  } & HousingEventInput)
		| ({
				typ: "flight";
		  } & FlightEventInput)
		| ({
				typ: "guide";
		  } & GuideEventInput)
		| ({
				typ: "supplementary";
		  } & SupplementaryEventInput);

export interface UpdateEventOptionTourTourIdOptionIdEventMultiEventIdUpdateOptionEventOptionIdPatchParams {
	/** @default "en" */
	lang?: LanguageCode;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
	/**
	 * Option Id
	 * @format uuid
	 */
	optionId: string;
	/**
	 * Event Id
	 * @format uuid
	 */
	eventId: string;
	/**
	 * Event Option Id
	 * @format uuid
	 */
	eventOptionId: string;
}

export interface DeleteEventOptionTourTourIdOptionIdEventMultiEventIdRemoveOptionEventOptionIdDeleteParams {
	/** @default "en" */
	lang?: LanguageCode;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
	/**
	 * Option Id
	 * @format uuid
	 */
	optionId: string;
	/**
	 * Event Id
	 * @format uuid
	 */
	eventId: string;
	/**
	 * Event Option Id
	 * @format uuid
	 */
	eventOptionId: string;
}

/** Move */
export type MoveEventOptionToSingleTourTourIdOptionIdEventMultiEventIdMoveToSingleEventOptionIdPostPayload =
	EventReorderSchema | null;

export interface MoveEventOptionToSingleTourTourIdOptionIdEventMultiEventIdMoveToSingleEventOptionIdPostParams {
	/** @default "en" */
	lang?: LanguageCode;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
	/**
	 * Option Id
	 * @format uuid
	 */
	optionId: string;
	/**
	 * Event Id
	 * @format uuid
	 */
	eventId: string;
	/**
	 * Event Option Id
	 * @format uuid
	 */
	eventOptionId: string;
}

export interface UploadEventImagesTourTourIdEventEventIdImagesPostParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
	/**
	 * Event Id
	 * @format uuid
	 */
	eventId: string;
}

export interface ListEventImagesTourTourIdEventEventIdImagesAllGetParams {
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @min 1
	 * @max 100
	 * @default 10
	 */
	limit?: number;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
	/**
	 * Event Id
	 * @format uuid
	 */
	eventId: string;
}

export interface DeleteEventImageTourTourIdEventEventIdImagesImageIdDeleteParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
	/**
	 * Event Id
	 * @format uuid
	 */
	eventId: string;
	/**
	 * Image Id
	 * @format uuid
	 */
	imageId: string;
}

export interface UpdateEventImageTourTourIdEventEventIdImagesImageIdSetPrimaryPatchParams {
	/**
	 * Event Id
	 * @format uuid
	 */
	eventId: string;
	/**
	 * Image Id
	 * @format uuid
	 */
	imageId: string;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface GetTourCommissionsTourTourIdSeasonalityGetParams {
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @min 1
	 * @max 100
	 * @default 10
	 */
	limit?: number;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface CreateTourSeasonCommissionTourTourIdSeasonalityCreatePostParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface UpdateTourCommissionsTourTourIdSeasonalityUpdateCommissionIdPatchParams {
	/**
	 * Commission Id
	 * @format uuid
	 */
	commissionId: string;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface RemoveCommissionTourTourIdSeasonalityRemoveCommissionIdDeleteParams {
	/**
	 * Commission Id
	 * @format uuid
	 */
	commissionId: string;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface GetTourScheduleTourTourIdScheduleGetParams {
	/** From */
	from?: string | null;
	/** To */
	to?: string | null;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface UpdateTourScheduleTourTourIdSchedulePatchParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface AddFixedDateTourTourIdScheduleDatePostParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface BulkAddFixedDatesTourTourIdScheduleDateBulkPostParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface BulkRemoveFixedDatesTourTourIdScheduleDateBulkDeleteParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface RemoveFixedDateTourTourIdScheduleDateDateIdDeleteParams {
	/**
	 * Date Id
	 * @format uuid
	 */
	dateId: string;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface AddExcludedDateTourTourIdScheduleExcludePostParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface BulkAddExcludedDatesTourTourIdScheduleExcludeBulkPostParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface BulkRemoveExcludedDatesTourTourIdScheduleExcludeBulkDeleteParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface RemoveExcludedDateTourTourIdScheduleExcludeDateIdDeleteParams {
	/**
	 * Date Id
	 * @format uuid
	 */
	dateId: string;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface AddRecurrenceRuleTourTourIdScheduleRulePostParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface BulkAddRecurrenceRulesTourTourIdScheduleRuleBulkPostParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface RemoveRecurrenceRuleTourTourIdScheduleRuleRuleIdDeleteParams {
	/**
	 * Rule Id
	 * @format uuid
	 */
	ruleId: string;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface GetLandingPageTourTourIdLandingGetParams {
	/** @default "en" */
	lang?: LanguageCode;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface UpdateLandingPageTourTourIdLandingPatchParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface UploadLandingImagesTourTourIdLandingImagesPostParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface ListLandingImagesTourTourIdLandingImagesGetParams {
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @min 1
	 * @max 100
	 * @default 10
	 */
	limit?: number;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface DeleteLandingImageTourTourIdLandingImagesImageIdDeleteParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
	/**
	 * Image Id
	 * @format uuid
	 */
	imageId: string;
}

export interface SetPrimaryLandingImageTourTourIdLandingImagesImageIdSetPrimaryPatchParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
	/**
	 * Image Id
	 * @format uuid
	 */
	imageId: string;
}

export interface GetTourTourTourIdPublicGetParams {
	/** @default "en" */
	read_lang?: LanguageCode;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface ListPublicTourOptionsTourTourIdPublicOptionAllGetParams {
	/** @default "USD" */
	currency?: Currency;
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @min 1
	 * @max 100
	 * @default 10
	 */
	limit?: number;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface GetPublicTourOptionTourTourIdPublicOptionOptionIdGetParams {
	/** @default "USD" */
	currency?: Currency;
	/** @default "en" */
	lang?: LanguageCode;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
	/**
	 * Option Id
	 * @format uuid
	 */
	optionId: string;
}

export interface GetPublicLandingPageTourTourIdPublicLandingGetParams {
	/** @default "en" */
	lang?: LanguageCode;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface GetPublicOperatorPreviewTourTourIdPublicOperatorGetParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface GetPublicTourScheduleTourTourIdPublicScheduleGetParams {
	/** From */
	from?: string | null;
	/** To */
	to?: string | null;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface CreatePackageTourTourIdOptionIdPackagePostParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
	/**
	 * Option Id
	 * @format uuid
	 */
	optionId: string;
}

export interface ListPackagesTourTourIdOptionIdPackageGetParams {
	/**
	 * Q
	 * Filter by package name
	 */
	q?: string | null;
	/**
	 * Option Id
	 * @format uuid
	 */
	optionId: string;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface GetPackageTourTourIdOptionIdPackagePackageIdGetParams {
	/**
	 * Option Id
	 * @format uuid
	 */
	optionId: string;
	/**
	 * Package Id
	 * @format uuid
	 */
	packageId: string;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface UpdatePackageTourTourIdOptionIdPackagePackageIdPatchParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
	/**
	 * Option Id
	 * @format uuid
	 */
	optionId: string;
	/**
	 * Package Id
	 * @format uuid
	 */
	packageId: string;
}

export interface DeletePackageTourTourIdOptionIdPackagePackageIdDeleteParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
	/**
	 * Option Id
	 * @format uuid
	 */
	optionId: string;
	/**
	 * Package Id
	 * @format uuid
	 */
	packageId: string;
}

export interface ListToursTourGetParams {
	/**
	 * Desc
	 * @default true
	 */
	desc?: boolean;
	/** Status */
	status?: TourStatus | null;
	/** Typ */
	typ?: TourType | null;
	/** Q */
	q?: string | null;
	/** @default "created_at" */
	sort_by?: TourListSortField;
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @min 1
	 * @max 100
	 * @default 10
	 */
	limit?: number;
}

export interface ListOneDayToursTourOneDayGetParams {
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @min 1
	 * @max 100
	 * @default 10
	 */
	limit?: number;
}

export interface GetTourTourTourIdGetParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface UpdateTourTourTourIdPatchParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface DeleteTourTourTourIdDeleteParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface ValidateTourTourTourIdValidateGetParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface PublishTourTourTourIdPublishPostParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface ArchiveTourTourTourIdArchivePostParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface UnarchiveTourTourTourIdUnarchivePostParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface RefreshTourProjectionTourTourIdRefreshPostParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface UploadTourCoverTourTourIdCoverPostParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface DeleteTourCoverTourTourIdCoverDeleteParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface GetTourStatisticsTourTourIdStatisticsGetParams {
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface RegenerateTourTranslationsTourComputedI18NTourTourIdRegeneratePostParams {
	/**
	 * Force
	 * @default false
	 */
	force?: boolean;
	/**
	 * Tour Id
	 * @format uuid
	 */
	tourId: string;
}

export interface ListFilesOperatorMeFilesGetParams {
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @min 1
	 * @max 100
	 * @default 10
	 */
	limit?: number;
}

export interface GetFileUrlOperatorMeFilesFileIdGetParams {
	/**
	 * File Id
	 * @format uuid
	 */
	fileId: string;
}

export interface RemoveFileOperatorMeFilesFileIdDeleteParams {
	/**
	 * File Id
	 * @format uuid
	 */
	fileId: string;
}

export interface ListPartneredAgenciesOperatorAgenciesPartneredGetParams {
	/** Q */
	q?: string | null;
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @min 1
	 * @max 100
	 * @default 10
	 */
	limit?: number;
}

export interface ListAgenciesOperatorAgenciesAllGetParams {
	/** Q */
	q?: string | null;
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @min 1
	 * @max 100
	 * @default 10
	 */
	limit?: number;
}

export interface GetAgencyInfoByIdOperatorAgenciesAgencyIdInfoGetParams {
	/**
	 * Agency Id
	 * @format uuid
	 */
	agencyId: string;
}

export interface SetAgencyDiscountOperatorAgenciesAgencyIdDiscountPatchParams {
	/**
	 * Agency Id
	 * @format uuid
	 */
	agencyId: string;
}

export interface DeleteAgencyDiscountOperatorAgenciesAgencyIdDiscountDeleteParams {
	/**
	 * Agency Id
	 * @format uuid
	 */
	agencyId: string;
}

export interface ListStaffOperatorStaffAllGetParams {
	/** Q */
	q?: string | null;
	/** Statuses */
	statuses?: StaffStatus[] | null;
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @min 1
	 * @max 100
	 * @default 10
	 */
	limit?: number;
}

export interface UpdateStaffMemberOperatorStaffUserIdPatchParams {
	/**
	 * User Id
	 * @format uuid
	 */
	userId: string;
}

export interface DeleteStaffMemberOperatorStaffUserIdDeleteParams {
	/**
	 * User Id
	 * @format uuid
	 */
	userId: string;
}

export interface ListFxRatesOperatorFxRateGetParams {
	/** From Currency */
	from_currency?: Currency | null;
	/** To Currency */
	to_currency?: Currency | null;
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @min 1
	 * @max 100
	 * @default 10
	 */
	limit?: number;
}

export interface GetFxRateOperatorFxRateFxRateIdGetParams {
	/**
	 * Fx Rate Id
	 * @format uuid
	 */
	fxRateId: string;
}

export interface UpdateFxRateOperatorFxRateFxRateIdPatchParams {
	/**
	 * Fx Rate Id
	 * @format uuid
	 */
	fxRateId: string;
}

export interface DeleteFxRateOperatorFxRateFxRateIdDeleteParams {
	/**
	 * Fx Rate Id
	 * @format uuid
	 */
	fxRateId: string;
}

export interface ListSupplierPaymentsOperatorSupplierPaymentGetParams {
	/** Booking Id */
	booking_id?: string | null;
	/** Supplier Id */
	supplier_id?: string | null;
	/** Event Id */
	event_id?: string | null;
	/** Status */
	status?: SupplierPaymentStatus | null;
	/** Q */
	q?: string | null;
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @min 1
	 * @max 100
	 * @default 10
	 */
	limit?: number;
}

export interface GetSupplierPaymentOperatorSupplierPaymentPaymentIdGetParams {
	/**
	 * Payment Id
	 * @format uuid
	 */
	paymentId: string;
}

export interface UpdateSupplierPaymentOperatorSupplierPaymentPaymentIdPatchParams {
	/**
	 * Payment Id
	 * @format uuid
	 */
	paymentId: string;
}

export interface UploadReceiptOperatorSupplierPaymentPaymentIdReceiptPostParams {
	/**
	 * Payment Id
	 * @format uuid
	 */
	paymentId: string;
}

export interface RemoveReceiptOperatorSupplierPaymentPaymentIdReceiptFileIdDeleteParams {
	/**
	 * Payment Id
	 * @format uuid
	 */
	paymentId: string;
	/**
	 * File Id
	 * @format uuid
	 */
	fileId: string;
}

export interface ListPaymentRoutesOperatorPaymentRoutesGetParams {
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @min 1
	 * @max 100
	 * @default 10
	 */
	limit?: number;
}

export interface GetPaymentRouteOperatorPaymentRoutesRouteIdGetParams {
	/**
	 * Route Id
	 * @format uuid
	 */
	routeId: string;
}

export interface UpdatePaymentRouteOperatorPaymentRoutesRouteIdPatchParams {
	/**
	 * Route Id
	 * @format uuid
	 */
	routeId: string;
}

export interface DeletePaymentRouteOperatorPaymentRoutesRouteIdDeleteParams {
	/**
	 * Route Id
	 * @format uuid
	 */
	routeId: string;
}

export interface UdpateOperatorOperatorIdPatchParams {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
}

export interface GetOperatorOperatorIdGetParams {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
}

export interface DeleteOperatorOperatorIdDeleteParams {
	/**
	 * Id
	 * @format uuid
	 */
	id: string;
}

export interface ListSuppliersSupplierGetParams {
	/**
	 * Skip
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @default 100
	 */
	limit?: number;
	/** Supplier Type */
	supplier_type?: SupplierType | null;
	/** Q */
	q?: string | null;
}

export interface GetSupplierSupplierSupplierIdGetParams {
	/**
	 * Supplier Id
	 * @format uuid
	 */
	supplierId: string;
}

export interface UpdateSupplierSupplierSupplierIdPatchParams {
	/**
	 * Supplier Id
	 * @format uuid
	 */
	supplierId: string;
}

export interface DeleteSupplierSupplierSupplierIdDeleteParams {
	/**
	 * Supplier Id
	 * @format uuid
	 */
	supplierId: string;
}

export interface GetLogoSupplierSupplierIdLogoGetParams {
	/**
	 * Supplier Id
	 * @format uuid
	 */
	supplierId: string;
}

export interface AddLogoSupplierSupplierIdLogoPostParams {
	/**
	 * Supplier Id
	 * @format uuid
	 */
	supplierId: string;
}

export interface DeleteLogoSupplierSupplierIdLogoDeleteParams {
	/**
	 * Supplier Id
	 * @format uuid
	 */
	supplierId: string;
}

export interface ListAgencyDocumentsAgencyMeDocumentsGetParams {
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @min 1
	 * @max 100
	 * @default 10
	 */
	limit?: number;
}

export interface GetAgencyDocumentUrlAgencyMeDocumentsFileIdGetParams {
	/**
	 * File Id
	 * @format uuid
	 */
	fileId: string;
}

export interface RemoveAgencyDocumentAgencyMeDocumentsFileIdDeleteParams {
	/**
	 * File Id
	 * @format uuid
	 */
	fileId: string;
}

export interface ListBookingAvailabilityBookingOrderOperatorBookingIdAvailabilityGetParams {
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
}

export interface ApplyEventAvailabilityBookingOrderOperatorBookingIdEventsEventIdOptionsOptionIndexAvailabilityPatchParams {
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
	/**
	 * Event Id
	 * @format uuid
	 */
	eventId: string;
	/** Option Index */
	optionIndex: number;
}

export interface GetUserBookingOrderBookingOrderUserBookingIdGetParams {
	/** @default "en" */
	lang?: LanguageCode;
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
}

export interface GetAgencyBookingOrderBookingOrderAgencyBookingIdGetParams {
	/** @default "en" */
	lang?: LanguageCode;
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
}

export interface GetOperatorBookingOrderBookingOrderOperatorBookingIdGetParams {
	/** @default "en" */
	lang?: LanguageCode;
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
}

export interface GetOperatorOrderFinancialsBookingOrderOperatorBookingIdFinancialsGetParams {
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
}

export interface GetOperatorOrderVarianceBookingOrderOperatorBookingIdVarianceGetParams {
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
}

export interface GetOperatorBookingItineraryBookingOrderOperatorBookingIdItineraryGetParams {
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
}

export interface TransitionBookingStatusBookingOrderOperatorBookingIdStatusTransitionPatchParams {
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
	transition: BookingTransition;
}

export interface DeclineBookingBookingOrderOperatorBookingIdDeclinePostParams {
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
}

export interface ListMyBookingsBookingOrderMyGetParams {
	/** Booking Status */
	booking_status?: BookingStatus | null;
	/** Tour Id */
	tour_id?: string | null;
	/** Q */
	q?: string | null;
	/** Date From */
	date_from?: string | null;
	/** Date To */
	date_to?: string | null;
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @min 1
	 * @max 100
	 * @default 10
	 */
	limit?: number;
}

export interface GetBookingItineraryBookingOrderBookingIdItineraryGetParams {
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
}

export interface SubmitBookingOrderBookingOrderBookingIdSubmitPatchParams {
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
}

export interface UpdateBookingOrderBookingOrderBookingIdPatchParams {
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
}

export interface DeleteBookingOrderBookingOrderBookingIdDeleteParams {
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
}

export interface CancelBookingBookingOrderBookingIdCancelPostParams {
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
}

/** Event */
export type AddEventBookingRevisionBookingIdEventPostPayload =
	| (
			| ({
					typ: "ref";
			  } & InformationSingleEventInput)
			| ({
					typ: "bus";
			  } & BusSingleEventInput)
			| ({
					typ: "train";
			  } & TrainSingleEventInput)
			| ({
					typ: "transfer";
			  } & TransferSingleEventInput)
			| ({
					typ: "activity";
			  } & ActivitySingleEventInput)
			| ({
					typ: "housing";
			  } & HousingSingleEventInput)
			| ({
					typ: "flight";
			  } & FlightSingleEventInput)
			| ({
					typ: "guide";
			  } & GuideSingleEventInput)
			| ({
					typ: "supplementary";
			  } & SupplementarySingleEventInput)
	  )
	| MultiEvent;

export interface AddEventBookingRevisionBookingIdEventPostParams {
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
}

/** Event */
export type UpdateEventBookingRevisionBookingIdEventEventIdPatchPayload =
	| (
			| ({
					typ: "ref";
			  } & InformationSingleEventInput)
			| ({
					typ: "bus";
			  } & BusSingleEventInput)
			| ({
					typ: "train";
			  } & TrainSingleEventInput)
			| ({
					typ: "transfer";
			  } & TransferSingleEventInput)
			| ({
					typ: "activity";
			  } & ActivitySingleEventInput)
			| ({
					typ: "housing";
			  } & HousingSingleEventInput)
			| ({
					typ: "flight";
			  } & FlightSingleEventInput)
			| ({
					typ: "guide";
			  } & GuideSingleEventInput)
			| ({
					typ: "supplementary";
			  } & SupplementarySingleEventInput)
	  )
	| MultiEvent;

export interface UpdateEventBookingRevisionBookingIdEventEventIdPatchParams {
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
	/**
	 * Event Id
	 * @format uuid
	 */
	eventId: string;
}

export interface RemoveEventBookingRevisionBookingIdEventEventIdDeleteParams {
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
	/**
	 * Event Id
	 * @format uuid
	 */
	eventId: string;
}

export interface ListEditsBookingRevisionBookingIdEditsGetParams {
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
}

export interface PreviewBookingRevisionBookingIdPreviewGetParams {
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
}

export interface AddPassengerInfoBookingOrderBookingIdPaxPostParams {
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
}

export interface ListPassengerInfoBookingOrderBookingIdPaxGetParams {
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @min 1
	 * @max 100
	 * @default 10
	 */
	limit?: number;
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
}

export interface UpdatePassengerInfoBookingOrderBookingIdPaxPaxIdPatchParams {
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
	/**
	 * Pax Id
	 * @format uuid
	 */
	paxId: string;
}

export interface DeletePassengerInfoBookingOrderBookingIdPaxPaxIdDeleteParams {
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
	/**
	 * Pax Id
	 * @format uuid
	 */
	paxId: string;
}

export interface UploadPassengerPassportBookingOrderBookingIdPaxPaxIdPassportPostParams {
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
	/**
	 * Pax Id
	 * @format uuid
	 */
	paxId: string;
}

export interface GetFileBinaryBookingOrderPaxFileFileIdGetParams {
	/**
	 * File Id
	 * @format uuid
	 */
	fileId: string;
}

export interface RemoveFileBookingOrderPaxFileFileIdDeleteParams {
	/**
	 * File Id
	 * @format uuid
	 */
	fileId: string;
}

export interface ListPaymentsBookingPaymentGetParams {
	/**
	 * Skip
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @default 100
	 */
	limit?: number;
	/** Status */
	status?: ClientPaymentStatus | null;
	/** Booking Id */
	booking_id?: string | null;
	/** Created From */
	created_from?: string | null;
	/** Created To */
	created_to?: string | null;
	/** Q */
	q?: string | null;
}

export interface GetPaymentBookingPaymentPaymentIdGetParams {
	/**
	 * Payment Id
	 * @format uuid
	 */
	paymentId: string;
}

export interface UpdatePaymentBookingPaymentPaymentIdPatchParams {
	/**
	 * Payment Id
	 * @format uuid
	 */
	paymentId: string;
}

export interface DeletePaymentBookingPaymentPaymentIdDeleteParams {
	/**
	 * Payment Id
	 * @format uuid
	 */
	paymentId: string;
}

export interface ConfirmPaymentBookingPaymentPaymentIdConfirmPostParams {
	/**
	 * Payment Id
	 * @format uuid
	 */
	paymentId: string;
}

export interface ListAttachmentsBookingPaymentPaymentIdAttachmentGetParams {
	/**
	 * Payment Id
	 * @format uuid
	 */
	paymentId: string;
}

export interface AddAttachmentBookingPaymentPaymentIdAttachmentPostParams {
	/**
	 * Payment Id
	 * @format uuid
	 */
	paymentId: string;
}

export interface DownloadAttachmentBookingPaymentPaymentIdAttachmentFileIdGetParams {
	/**
	 * Payment Id
	 * @format uuid
	 */
	paymentId: string;
	/**
	 * File Id
	 * @format uuid
	 */
	fileId: string;
}

export interface RemoveAttachmentBookingPaymentPaymentIdAttachmentFileIdDeleteParams {
	/**
	 * Payment Id
	 * @format uuid
	 */
	paymentId: string;
	/**
	 * File Id
	 * @format uuid
	 */
	fileId: string;
}

export interface ListBookingReconciliationBookingReconciliationGetParams {
	/** Status */
	status?: BookingStatus | null;
	/** Tour Id */
	tour_id?: string | null;
	/** Date From */
	date_from?: string | null;
	/** Date To */
	date_to?: string | null;
	/**
	 * Outstanding Only
	 * @default false
	 */
	outstanding_only?: boolean;
	/**
	 * Payable Only
	 * @default false
	 */
	payable_only?: boolean;
	/** Q */
	q?: string | null;
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @min 1
	 * @max 100
	 * @default 10
	 */
	limit?: number;
}

export interface UploadVoucherBookingVoucherBookingIdPostParams {
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
}

export interface GetVoucherBookingVoucherBookingIdGetParams {
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
}

export interface DeleteVoucherBookingVoucherBookingIdDeleteParams {
	/**
	 * Booking Id
	 * @format uuid
	 */
	bookingId: string;
}

export interface ListMyInvoicesInvoiceGetParams {
	/** Statuses */
	statuses?: InvoiceStatus[] | null;
	/** Q */
	q?: string | null;
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @min 1
	 * @max 100
	 * @default 10
	 */
	limit?: number;
}

export interface GetInvoiceInvoiceInvoiceIdGetParams {
	/**
	 * Invoice Id
	 * @format uuid
	 */
	invoiceId: string;
}

export interface UploadInvoicePdfInvoiceInvoiceIdPdfPostParams {
	/**
	 * Invoice Id
	 * @format uuid
	 */
	invoiceId: string;
}

export interface GetInvoicePdfInvoiceInvoiceIdPdfGetParams {
	/**
	 * Invoice Id
	 * @format uuid
	 */
	invoiceId: string;
}

export interface RecordInvoicePaymentInvoiceInvoiceIdPaymentPostParams {
	/**
	 * Invoice Id
	 * @format uuid
	 */
	invoiceId: string;
}

export interface ListLedgerEntriesLedgerOperatorGetParams {
	/** Booking Id */
	booking_id?: string | null;
	/** Party Typ */
	party_typ?: LedgerParty | null;
	/** Party Id */
	party_id?: string | null;
	/** Flow */
	flow?: LedgerFlow | null;
	/** Typ */
	typ?: LedgerEntryType | null;
	/** Source */
	source?: LedgerSource | null;
	/** Occurred From */
	occurred_from?: string | null;
	/** Occurred To */
	occurred_to?: string | null;
	/** Q */
	q?: string | null;
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @min 1
	 * @max 100
	 * @default 10
	 */
	limit?: number;
}

export interface ListDebtorsLedgerOperatorDebtorsGetParams {
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @min 1
	 * @max 100
	 * @default 10
	 */
	limit?: number;
}

export interface ListCreditorsLedgerOperatorCreditorsGetParams {
	/**
	 * Skip
	 * @min 0
	 * @default 0
	 */
	skip?: number;
	/**
	 * Limit
	 * @min 1
	 * @max 100
	 * @default 10
	 */
	limit?: number;
}

export interface SearchGeoSearchGetParams {
	/**
	 * Q
	 * @minLength 1
	 * @maxLength 200
	 */
	q: string;
	/** @default "en" */
	lang?: LanguageCode;
	/**
	 * Limit
	 * @min 1
	 * @max 50
	 * @default 10
	 */
	limit?: number;
}

export interface ReverseGeoReverseGetParams {
	/**
	 * Lat
	 * @min -90
	 * @max 90
	 */
	lat: number;
	/**
	 * Long
	 * @min -180
	 * @max 180
	 */
	long: number;
	/** @default "en" */
	lang?: LanguageCode;
	/**
	 * Limit
	 * @min 1
	 * @max 10
	 * @default 1
	 */
	limit?: number;
}
