export class Profile {
    /** There are public variables, because they need to be accessed from the outside */
    constructor(
        public id: string,
        public firstName: string,
        public lastName: string,
        public email: string,
        public gender: string,
        public birthdate: Date,
        public avatar: string,
        public address: string,
        public actualPlan: string,
        public actualPlanFinishDate: string,
        public clasesConsumidas: string,
        public clasesPerdidas: string,
        public clasesTotales: string
    ) {}
}
