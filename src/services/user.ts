import "isomorphic-fetch";
import {remoteservice} from "./remote-service";

export namespace user {

    const SOURCE_URL: string = "http://localhost:9250/v1/";
    const ADD_MEMBER_URL: string = SOURCE_URL + "addTeamMember";
    const GET_TEAM_URL: string = SOURCE_URL + "team";

    interface Member {
        email: string;
        currentUserId: string;
        userType: "viewer" | "admin";
    }

    export function addTeamMemer(user: any, auth: remoteservice.auth.Auth = remoteservice.defaultService().auth(), db: remoteservice.database.Database = remoteservice.defaultService().database()): Promise<any> {
        let currentUser = auth.currentUser;
        const member: Member = {
            email: user.email,
            currentUserId: currentUser.uid,
            userType: user.userType,
        };
        return fetch(ADD_MEMBER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": "source-dev-token"
            },
            body: JSON.stringify(member),
        }).then(function (result: any) {
            if (result.status === 200) {
                return result.json();
            } else {
                console.log(2);
                return Promise.reject(new Error(result.statusText));
            }
        });
    }

    export function getTeam(auth: remoteservice.auth.Auth = remoteservice.defaultService().auth(), db: remoteservice.database.Database = remoteservice.defaultService().database()): Promise<any> {
        let currentUser = auth.currentUser;
        const GET_TEAM_URL_WITH_PARAMS = GET_TEAM_URL + "?id=" + currentUser.uid;
        return fetch(GET_TEAM_URL_WITH_PARAMS, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": "source-dev-token"
            },
            body: {},
        }).then(function (result: any) {
            if (result.status === 200) {
                return result.json();
            } else {
                return Promise.reject(new Error(result.statusText));
            }
        });
    }
}

export default user;
