export class User {
    /** public variables to be accessed from the outside */
    constructor(
        public email: string,
        // tslint:disable-next-line: variable-name
        public _tokenType: string,
        // tslint:disable-next-line: variable-name
        private _token: string,
        // tslint:disable-next-line: variable-name
        private _refreshToken: string,
        // tslint:disable-next-line: variable-name
        private _tokenExpirationDate: Date,

    ) {}

    /**
     * To navigate inside the app, we need obtain the token
     *
     * @return  string|null
     */
    get token() {
        if ( !this._tokenExpirationDate || this._tokenExpirationDate <= new Date()) {
            return null;
        }

        return this._token;
    }

    /**
     * Obtain the type token for requests
     *
     * @return  string|null
     */
    get tokenType() {
        if ( !this._tokenType ) {
            return null;
        }

        return this._tokenType;
    }
}
