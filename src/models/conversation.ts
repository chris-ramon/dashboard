import Color from "../utils/color";
import Log from "./log";
import Output from "./output";
import StackTrace from "./stack-trace";

export interface ConversationProperties {
    request: Log;
    response: Log;
    outputs?: Output[];
    stackTraces?: StackTrace[];
}

export default class Conversation implements ConversationProperties {

    readonly request: Log;

    readonly response: Log;

    readonly outputs: Output[];

    readonly stackTraces: StackTrace[];

    constructor(props: ConversationProperties) {
        this.request = props.request;
        this.response = props.response;
        this.outputs = props.outputs ? props.outputs.slice() : [];
        this.stackTraces = props.stackTraces ? props.stackTraces.slice() : [];
    }

    get id(): string {
        return this.request.id;
    }

    get applicationId(): string {

        let applicationId = "";

        if (this.request.payload.session && this.request.payload.session.application) {
            // Leaving this in for backwards compatibility
            applicationId = this.request.payload.session.application.applicationId;
        }

        if (this.request.payload.context) {
            // This is the preferred applicationId
            applicationId = this.request.payload.context.System.application.applicationId;
        }

        return applicationId;
    }

    get sessionId(): string {
        let sessionId = "";
        if (this.request.payload.session) {
            sessionId = this.request.payload.session.sessionId;
        }

        return sessionId;
    }

    get userId(): string | undefined {

        let userId: string | undefined = undefined;

        if (typeof this.request.payload === "object") {
            if (this.request.payload.session && this.request.payload.session.user) {
                userId = this.request.payload.session.user.userId;
            } else if (this.request.payload.context && this.request.payload.context.System.user) {
                userId = this.request.payload.context.System.user.userId;
            }
        }

        return userId;
    }

    get userColors(): { fill: string, background: string } {

        // set the default
        let colors = {
            fill: "#ffffff",
            background: "#000000"
        };

        if (this.userId) {
            let lastSix = this.userId.substr(this.userId.length - 6);

            // regex for checking hex
            let isHex = /(^[0-9a-fA-F]{6}$)/;

            if (isHex.test(lastSix)) {
                colors.fill = "#" + lastSix;
                colors.background = Color.complementaryColor(lastSix);
            } else {
                // not hex, try to convert it to hex
                let decimalValue = parseInt(lastSix, 36);
                let convertedHex = decimalValue.toString(16);
                let fill = convertedHex.substr(convertedHex.length - 6);

                if (isHex.test(fill)) {
                    colors.fill = "#" + fill;
                    colors.background = Color.complementaryColor(fill);
                }
            }
        }

        return colors;
    }

    get requestPayloadType(): string | undefined {
        let requestType: string;

        if (this.request.payload.request) {
            requestType = this.request.payload.request.type;
        }

        // if it is an intent request, append the type
        if (requestType === "IntentRequest") {
            requestType = requestType + "." + this.intent;
        }

        return requestType;
    }

    get intent(): string | undefined {
        if (this.request.payload.request && this.request.payload.request.intent) {
            return this.request.payload.request.intent.name;
        } else {
            return undefined;
        }
    }

    get timestamp(): Date {
        return this.request.timestamp;
    }

    get hasError(): boolean {
        return this.hasOutputType("ERROR");
    }

    get hasCrash(): boolean {
        return this.stackTraces.length > 0;
    }

    hasOutputType(type: string): boolean {
        for (let output of this.outputs) {
            if (output.level === type) {
                return true;
            }
        }
        return false;
    }
}

