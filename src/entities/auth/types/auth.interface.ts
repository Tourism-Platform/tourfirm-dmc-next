export interface IAuthAccount {
	id: string;
	email: string;
	role: string;
	picture: string | null;
	agencyId: string | null;
	operatorId: string | null;
}
