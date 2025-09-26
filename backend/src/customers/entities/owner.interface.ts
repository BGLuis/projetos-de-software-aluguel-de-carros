export interface Owner {
	getDocumentsRequest(): void;
	cancelRequest(): void;
	getPersonalData(): any;
}
