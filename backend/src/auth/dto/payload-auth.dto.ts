export class PayloadAuthDto {
	email: string;
	sub: string;
	roles: string[];
	exp: number;
	iat: number;
	iss: string;
}
