import * as chai from "chai";
import * as fetchMock from "fetch-mock";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import remoteservice from "./remote-service";
import UserService from "./user";

chai.use(sinonChai);
let expect = chai.expect;

/**
 * The User to be defined as the current logged in user.
 */
let mockUser: remoteservice.user.User = {
    emailVerified: true,
    displayName: "testUsers",
    email: "test@testdomain.test",
    photoURL: undefined,
    providerId: "ABC123",
    uid: "ABCD1234567890"
};

const mockAuth: remoteservice.auth.Auth = <remoteservice.auth.Auth>{
    get currentUser() {
        return mockUser;
    }
};

describe("User Service", function () {

    let db: remoteservice.database.Database;
    let ref: remoteservice.database.Reference;

    beforeEach(function () {
        db = <remoteservice.database.Database>{};
        ref = <remoteservice.database.Reference>{};

        db.ref = sinon.stub().returns(ref);
        ref.child = sinon.stub().returns(ref);
    });

    describe("Tests the addTeamMember function", function () {
        let mockResponse: any;
        let user: any;

        before(function () {
            user = {userType: "viewer", email: "test@test.com"};
            mockResponse = {user: {email: "test@test.com", userType: "viewer"}};
            fetchMock.post(/https:\/\/source-api\.bespoken\.tools\/v1\/addTeamMember/, mockResponse);
        });

        afterEach(function () {
            fetchMock.reset();
        });

        after(function () {
            fetchMock.restore();
        });

        it("Tests that the appropriate headers are sent.", function () {
            return UserService.addTeamMember(user, mockAuth, db)
                .then(function (value: any) {
                    const args = fetchMock.lastCall()[1] as RequestInit;
                    const header = args.headers;
                    expect(args.method).to.equal("POST");
                    expect(header["Content-Type"]).to.equal("application/json");
                });
        });

        it("Tests the appropriate body is sent", function () {
            return UserService.addTeamMember(user, mockAuth, db)
                .then(function (value: any) {
                    const args = fetchMock.lastCall()[1] as RequestInit;
                    const body = JSON.parse(args.body);
                    expect(body.email).to.deep.equal(user.email);
                    expect(body.userType).to.equal(user.userType);
                    expect(body.currentUserId).to.deep.equal(mockUser.uid);
                });
        });

        describe("Thrown error", function () {
            let errorResponse: () => Promise<any>;

            before(function () {
                errorResponse = () => { return Promise.reject("Error per requirements of the test."); };
                fetchMock.restore();
                fetchMock.post(/https:\/\/source-api\.bespoken\.tools\/v1\/addTeamMember/, errorResponse);
            });

            after(function () {
                fetchMock.restore();
                fetchMock.post(/https:\/\/source-api\.bespoken\.tools\/v1\/addTeamMember/, mockResponse);
            });

            it("Tests that an error is thrown to the catch.", function () {
                let caughtError: Error;
                return UserService.addTeamMember(user, mockAuth, db)
                    .catch(function (err: Error) {
                        caughtError = err;
                    }).then(function () {
                        expect(caughtError).to.exist;
                    });
            });
        });
    });

    describe("Tests the getTeam function", function () {
        let mockResponse: any;
        let user: any;

        before(function () {
            user = {userType: "viewer", email: "test@test.com"};
            mockResponse = [
                {email: "test@test.com", userType: {userType: "viewer", enableNotifications: false}},
                {email: "test1@test.com", userType: {userType: "viewer", enableNotifications: false}},
                {email: "test2@test.com", userType: {userType: "admin", enableNotifications: false}}
            ];
            fetchMock.get(/https:\/\/source-api\.bespoken\.tools\/v1\/team\?id=ABCD1234567890/, mockResponse);
        });

        afterEach(function () {
            fetchMock.reset();
        });

        after(function () {
            fetchMock.restore();
        });

        it("Tests that the appropriate headers are sent.", function () {
            return UserService.getTeam(mockAuth, db)
                .then(function (value: any) {
                    const args = fetchMock.lastCall()[1] as RequestInit;
                    const header = args.headers;
                    expect(args.method).to.equal("GET");
                    expect(header["Content-Type"]).to.equal("application/json");
                });
        });

        describe("Thrown error", function () {
            let errorResponse: () => Promise<any>;

            before(function () {
                errorResponse = () => { return Promise.reject("Error per requirements of the test."); };
                fetchMock.restore();
                fetchMock.get(/https:\/\/source-api\.bespoken\.tools\/v1\/team\?id=ABCD1234567890/, errorResponse);
            });

            after(function () {
                fetchMock.restore();
                fetchMock.get(/https:\/\/source-api\.bespoken\.tools\/v1\/team\?id=ABCD1234567890/, mockResponse);
            });

            it("Tests that an error is thrown to the catch.", function () {
                let caughtError: Error;
                return UserService.getTeam(mockAuth, db)
                    .catch(function (err: Error) {
                        caughtError = err;
                    }).then(function () {
                        expect(caughtError).to.exist;
                    });
            });
        });
    });
});
