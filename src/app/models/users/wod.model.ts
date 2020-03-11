export class Wod {
    /** public variables to be accessed from the outside */
    constructor(
        public identificador: number,
        public claseTypeId: number,
        public claseType: string,
        public date: Date
    ) {}
}
