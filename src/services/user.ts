import "isomorphic-fetch";
import {remoteservice} from "./remote-service";

export namespace user {

    const SOURCE_URL: string = "https://source-api.bespoken.tools/v1/";
    const ADD_MEMBER_URL: string = SOURCE_URL + "addTeamMember";
    const GET_TEAM_URL: string = SOURCE_URL + "team";
    const UPDATE_TEAM_NOTIFICATIONS_URL: string = SOURCE_URL + "updateTeamNotifications";

    interface Member {
        email: string;
        currentUserId: string;
        userType: "viewer" | "admin";
    }

    export function addTeamMember(user: any, auth: remoteservice.auth.Auth = remoteservice.defaultService().auth(), db: remoteservice.database.Database = remoteservice.defaultService().database()): Promise<any> {
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
                "x-access-token": process.env.SOURCE_API_ACCESS_TOKEN
            },
            body: JSON.stringify(member),
        }).then(function (result: any) {
            if (result.status === 200) {
                return result.json();
            } else {
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
                "x-access-token": process.env.SOURCE_API_ACCESS_TOKEN
            }
        }).then(function (result: any) {
            if (result.status === 200) {
                return result.json();
            } else {
                return Promise.reject(new Error(result.statusText));
            }
        });
    }

    export function updateNotifications(updated: any, auth: remoteservice.auth.Auth = remoteservice.defaultService().auth(), db: remoteservice.database.Database = remoteservice.defaultService().database()): Promise<any> {
        let currentUser = auth.currentUser;
        return fetch(UPDATE_TEAM_NOTIFICATIONS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": process.env.SOURCE_API_ACCESS_TOKEN
            },
            body: JSON.stringify({
                currentUserId: currentUser.uid,
                email: updated.email,
                enableNotifications: updated.enableNotifications,
            }),
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
