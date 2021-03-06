import * as chai from "chai";

import Conversation, { createConvo, Origin } from "../../../models/conversation";
import { Log, LogProperties } from "../../../models/log";
import StackTrace from "../../../models/stack-trace";
import { dummyOutputs } from "../../../utils/test";

import {
    TYPE_DATE,
    TYPE_EXCEPTION,
    TYPE_ID,
    TYPE_INTENT,
    TYPE_LOG_LEVEL,
    TYPE_ORIGIN,
    TYPE_REQUEST,
    TYPE_USER_ID
} from "./ConvoFilters";
import {
    DateFilter,
    ExceptionFilter,
    IDFilter,
    IntentFilter,
    LogLevelFilter,
    OriginFilter,
    RequestFilter,
    UserIDFilter
} from "./ConvoFilters";

chai.use(require("chai-datetime"));
let expect = chai.expect;

const fullSessionID = "amzn1.echo-api.session.4ad25fd6-5287-4f09-a142-dfbad23c1ff9";
const fullUserID = "amzn1.ask.account.AE2GW6ZHVQYQG4ILBSOHWUXACSTTHENV426JX23R6PS2TBQBW5ZVHHTNETVCIBALJE77IRJKQ4OFBIHWAZTNCEZTLS3EY6V7TYQLXQEJZ2CH4LPXG2GL27D4VCJVZXIONQG6452LDN7IXVCJ3EBRBO2JYF3YCMHINQ4N7VS6NINYW3DR53W5GSQTYOFAHT6LVXFHIZCEAMZVB5I";

let requestProps: LogProperties = {
    payload: {
        request: {
            intent: {
                name: "Testing.Request.Intent"
            },
            type: "TestRequest"
        },
        session: {
            sessionId: fullSessionID,
            applicationId: "ABC123",
            user: {
                userId: fullUserID
            },
        },
    },
    stack: "Request Test Stack",
    log_type: "DEBUG",
    source: "Source123",
    transaction_id: "TestTransactionID",
    timestamp: new Date(),
    tags: ["Tag1, Tag2, Tag3, Tag4"],
    id: "LogID1234567890"
};

let responseProps: LogProperties = {
    payload: "Response Payload!",
    stack: "Response Test Stack",
    log_type: "DEBUG",
    source: "Source123",
    transaction_id: "TestTransactionID",
    timestamp: new Date(),
    tags: ["Tag1, Tag2, Tag3, Tag4"],
    id: "LogID0987654321"
};

describe("Filters.tsx", function () {
    describe("LogLevelFilter", function () {
        it("Tests type attribute is not undefined", function () {
            let filter = new LogLevelFilter("DEBUG");
            expect(filter.type).to.equal(TYPE_LOG_LEVEL);
        });

        it("Tests filter attribute is not undefined", function () {
            let filter = new LogLevelFilter("DEBUG");
            expect(filter.filter).to.not.be.undefined;
        });

        it("Tests the filter will return true with a positive response.", function () {
            let filter = new LogLevelFilter("DEBUG");

            let convo = createConvo({
                request: new Log(requestProps),
                response: new Log(responseProps),
                outputs: dummyOutputs(6)
            });

            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter will return false when neither log is correct.", function () {
            let filter = new LogLevelFilter("ERROR");

            let convo = createConvo({
                request: new Log(requestProps),
                response: new Log(responseProps)
            });

            expect(filter.filter(convo)).to.be.false;
        });

        it("Tests the filter will return true when searching for undefined log type.", function () {
            let filter = new LogLevelFilter(undefined);

            let convo = createConvo({
                request: new Log(requestProps),
                response: new Log(responseProps)
            });

            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter will return true when searching for empty log type.", function () {
            let filter = new LogLevelFilter("");

            let convo = createConvo({
                request: new Log(requestProps),
                response: new Log(responseProps)
            });

            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter will return false when given an empty conversation.", function () {
            let filter = new LogLevelFilter("DEBUG");

            expect(filter.filter(undefined)).to.be.false;
        });
    });

    describe("IDFilter", function () {
        let convo = createConvo({
            request: new Log(requestProps),
            response: new Log(responseProps)
        });

        it("Tests the type attribute is not undefined.", function () {
            let filter = new IDFilter("1234");
            expect(filter.type).to.equal(TYPE_ID);
        });

        it("Tests the filter attribute is not undefined.", function () {
            let filter = new IDFilter("1234");
            expect(filter.filter).to.not.be.undefined;
            expect(filter.filter).to.not.be.null;
        });

        it("Tests the fitler attribute to return true with a good ID.", function () {
            let filter = new IDFilter(convo.id.substr(0)); // So it creates a new string and can't use a reference compare.
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter attribute to return true with a partial ID at the start.", function () {
            let filter = new IDFilter(convo.id.substr(0, 2));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter attribute to return true with a partial ID at the end.", function () {
            let filter = new IDFilter(convo.id.substr(3));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter attribute to return true with a partial ID in the middle.", function () {
            let filter = new IDFilter(convo.id.substr(2, 5));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter attribute to return true with an undefined ID.", function () {
            let filter = new IDFilter(undefined);
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter attribute to return true with a empty ID.", function () {
            let filter = new IDFilter("");
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter attribute to return false with an ID not in it.", function () {
            let filter = new IDFilter("Nope");
            expect(filter.filter(convo)).to.be.false;
        });

        it("Tests the filter attribute to return false with an undefined convo.", function () {
            let filter = new IDFilter(convo.id.substr(0));
            expect(filter.filter(undefined)).to.be.false;
        });
    });

    describe("DateFilter", function () {
        let convo: Conversation;

        before(function () {
            requestProps.timestamp.setFullYear(2016, 12, 15);
            responseProps.timestamp.setFullYear(2016, 12, 15);
            convo = createConvo({
                request: new Log(requestProps),
                response: new Log(responseProps)
            });
        });

        it("Tests the static type attribute is correct.", function() {
            expect(DateFilter.type).to.equal(TYPE_DATE);
        });

        it("Tests the type attribute is not undefined.", function () {
            let filter = new DateFilter(new Date());
            expect(filter.type).to.equal(TYPE_DATE);
        });

        it("Tests the filter attribute is not undefined.", function () {
            let filter = new DateFilter(new Date());
            expect(filter.filter).to.not.be.undefined;
            expect(filter.filter).to.not.be.null;
        });

        it("Tests the getStartDate property returns the appropriate value.", function () {
            let startDate = new Date(2016, 12, 14);
            let filter = new DateFilter(startDate, new Date(2016, 12, 16));
            expect(filter.startDate).to.equalDate(startDate);
        });

        it("Tests the getEndDate property returns the appropriate value.", function () {
            let endDate = new Date(2016, 12, 16);
            let filter = new DateFilter(new Date(2016, 12, 14), endDate);
            expect(filter.endDate).to.equalDate(endDate);
        });

        it("Tests the filter will return true if between the start and end date.", function () {
            let filter = new DateFilter(new Date(2016, 12, 14), new Date(2016, 12, 16));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter will return true if the convo happens after the start date with undefined end.", function () {
            let filter = new DateFilter(new Date(2016, 12, 14));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter will return true if the convo happens before the end date with undefined end.", function () {
            let filter = new DateFilter(undefined, new Date(2016, 12, 16));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter will return false if the convo happens before the start date with undefined end.", function () {
            let filter = new DateFilter(new Date(2016, 12, 16));
            expect(filter.filter(convo)).to.be.false;
        });

        it("Tests the filter will return false if the convo happens before the end date with undefined start.", function () {
            let filter = new DateFilter(undefined, new Date(2016, 12, 14));
            expect(filter.filter(convo)).to.be.false;
        });

        it("Tests the filter will return true if no start or end are defined.", function () {
            let filter = new DateFilter();
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the filter will return false if between the start and end date.", function () {
            let filter = new DateFilter(new Date(2016, 12, 14), new Date(2016, 12, 16));
            expect(filter.filter(undefined)).to.be.false;
        });

        it("Tests the date filter will return true if the start date is equal to the start date.", function () {
            let filter = new DateFilter(new Date(requestProps.timestamp));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the date filter will return true if the start date is equal to the end date.", function () {
            let filter = new DateFilter(undefined, new Date(requestProps.timestamp));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the date filter will return true if the start date is equal to the end date.", function () {
            let startDate = new Date(2016, 12, 15, 0, 0, 0);
            let endDate = new Date(2016, 12, 15, 23, 59, 59);
            let filter = new DateFilter(startDate, endDate);
            expect(filter.filter(convo)).to.be.true;
        });
    });

    describe("Intent filter", function () {
        let convo: Conversation;

        before(function () {
            convo = createConvo({
                request: new Log(requestProps),
                response: new Log(responseProps)
            });
        });

        it("Tests the intent filter is the correct type.", function () {
            const filter: IntentFilter = new IntentFilter("ERROR");
            expect(filter.type).to.equal(TYPE_INTENT);
        });

        it("Tests the intent filter returns a filter.", function () {
            const filter: IntentFilter = new IntentFilter("ERROR");
            expect(filter.filter).to.exist;
        });

        it("Tests a true filter with undefined", function () {
            const filter: IntentFilter = new IntentFilter(undefined);
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests a true filter with empty", function () {
            const filter: IntentFilter = new IntentFilter("");
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests a true filter", function () {
            const filter: IntentFilter = new IntentFilter(convo.intent);
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests a like filter from the beginning", function () {
            const filter: IntentFilter = new IntentFilter(convo.intent.substr(0, 2));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests a like filter from the end", function () {
            const filter: IntentFilter = new IntentFilter(convo.intent.substr(convo.intent.length - 2));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests a like filter from the middle", function () {
            const filter: IntentFilter = new IntentFilter(convo.intent.substr(2, convo.intent.length - 2));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests a false filter", function () {
            const filter: IntentFilter = new IntentFilter("Really weird intent that it could not accidentally have.");
            expect(filter.filter(convo)).to.be.false;
        });

        it("Tests a true filter", function () {
            const filter: IntentFilter = new IntentFilter(convo.intent);
            expect(filter.filter(undefined)).to.be.false;
        });

        it("Tests a false filter when convo doesn't have an intent", function () {
            const newConvo = createConvo({
                request: new Log(responseProps),
                response: new Log(responseProps)
            });

            const filter: IntentFilter = new IntentFilter("Test Convo");
            expect(filter.filter(newConvo)).to.be.false;
        });
    });

    describe("UserID filter", function () {
        let convo: Conversation;

        before(function () {
            convo = createConvo({
                request: new Log(requestProps),
                response: new Log(responseProps)
            });
        });

        it("Tests the user filter returns the correct type.", function () {
            const filter: UserIDFilter = new UserIDFilter("amz");
            expect(filter.type).to.equal(TYPE_USER_ID);
        });

        it("Tests the user filter returns a filter.", function () {
            const filter: UserIDFilter = new UserIDFilter("amz");
            expect(filter.filter).to.exist;
        });

        it("Tests that the user filter matches a full user id.", function () {
            const filter: UserIDFilter = new UserIDFilter(fullUserID);
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests that the user filter matches a partial match from the beginning.", function () {
            const filter: UserIDFilter = new UserIDFilter(fullUserID.slice(0, 5));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests that the user filter matches a partial match from the middle.", function () {
            const filter: UserIDFilter = new UserIDFilter(fullUserID.slice(0, 5));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests that the user filter matches a partial match from the end.", function () {
            const length = fullUserID.length;
            const filter: UserIDFilter = new UserIDFilter(fullUserID.slice(length - 10));
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests that the user filter matches an empty string.", function () {
            const filter: UserIDFilter = new UserIDFilter("");
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests that the user filter matches an undefined.", function () {
            const filter: UserIDFilter = new UserIDFilter(undefined);
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests that the user filter does not match a defined if filtering for only undefined.", function() {
            const filter: UserIDFilter = new UserIDFilter(undefined, true);
            expect(filter.filter(convo)).to.be.false;
        });

        it("Tests that the user filter does match a defined if filtering for only undefined and get an undefined.", function() {
            const copyConvo = {...convo};
            copyConvo.userId = undefined;

            const filter: UserIDFilter = new UserIDFilter(undefined, true);
            expect(filter.filter(copyConvo)).to.be.true;
        });

        it("Test that user filter does not match a bad user name.", function () {
            const filter: UserIDFilter = new UserIDFilter("Really weird user ID");
            expect(filter.filter(convo)).to.be.false;
        });

        it("Tests that the user filter returns false when the convo doesn't have a user.", function () {
            const newConvo = createConvo({
                request: new Log(responseProps),
                response: new Log(responseProps)
            });
            const filter: UserIDFilter = new UserIDFilter(fullUserID);
            expect(filter.filter(newConvo)).to.be.false;
        });
    });

    describe("Request filter", function () {
        let convo: Conversation;

        before(function () {
            convo = createConvo({
                request: new Log(requestProps),
                response: new Log(responseProps)
            });
        });

        it("Tests the request filter returns the correct type.", function () {
            const filter = new RequestFilter();
            expect(filter.type).to.equal(TYPE_REQUEST);
        });

        it("Tests the request filter returns the correct value with default constructor", function () {
            const filter = new RequestFilter();
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the request filter returns the correct value when undefined is passed in.", function () {
            const filter = new RequestFilter();
            expect(filter.filter(undefined)).to.be.true;
        });

        it("Tests the request filter returns the correct value when request exists.", function () {
            const filter = new RequestFilter("TestRequest");
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the request filter returns the correct value when request exists and with partial value.", function () {
            const filter = new RequestFilter("estReques");
            expect(filter.filter(convo)).to.be.true;
        });

        it("Tests the request filter returns the correct value when request does not exist.", function () {
            const filter = new RequestFilter("Does not exist request");
            expect(filter.filter(convo)).to.be.false;
        });

        it("Tests the request filter returns the correct value when there is no type.", function () {
            const filter = new RequestFilter("TestRequest");
            const newConvo = createConvo({
                request: new Log(responseProps), // Response doesn't have a type so we'll just use that.
                response: new Log(responseProps)
            });

            expect(filter.filter(newConvo)).to.be.false;
        });
    });

    describe("Has Exception filter", function () {

        it("Tests the Exception Filter returns the correct type.", function () {
            const filter: ExceptionFilter = new ExceptionFilter();
            expect(filter.type).to.equal(TYPE_EXCEPTION);
        });

        it("Tests the Exception Filter returns correct value with default constructor and exception exists.", function () {
            const filter: ExceptionFilter = new ExceptionFilter();
            const trace: StackTrace = new StackTrace({
                id: "trace0",
                timestamp: new Date(),
                raw: "Really long stack trace",
                message: "Stack trace message",
                elements: []
            });

            const newConvo = createConvo({
                request: new Log(responseProps),
                response: new Log(responseProps),
                stackTraces: [trace]
            });

            expect(filter.filter(newConvo)).to.be.true;
        });

        it("Tests the Exception Filter returns correct value with default constructor and exception does not exist.", function () {
            const filter: ExceptionFilter = new ExceptionFilter();
            const newConvo = createConvo({
                request: new Log(responseProps),
                response: new Log(responseProps)
            });

            expect(filter.filter(newConvo)).to.be.false;
        });
    });

    describe("Origin filter", function () {
        it("Tests the Origin filter returns the correct type.", function () {
            const filter: OriginFilter = new OriginFilter(Origin.AmazonAlexa);
            expect(filter.type).to.equal(TYPE_ORIGIN);
        });

        it("Tests the Origin filter returns true on correct origin.", function () {
            const filter: OriginFilter = new OriginFilter(Origin.AmazonAlexa);
            const newConvo = createConvo({
                request: new Log(requestProps),
                response: new Log(responseProps)
            });

            expect(filter.filter(newConvo)).to.be.true;
        });

        it("Tests the Origin filter returns true on bad origin.", function () {
            const filter: OriginFilter = new OriginFilter(Origin.GoogleHome);
            const newConvo = createConvo({
                request: new Log(responseProps),
                response: new Log(responseProps)
            });

            expect(filter.filter(newConvo)).to.be.false;
        });

        it("Tests the Origin filter returns true on undefined origin.", function () {
            const filter: OriginFilter = new OriginFilter(undefined);
            const newConvo = createConvo({
                request: new Log(responseProps),
                response: new Log(responseProps)
            });

            expect(filter.filter(newConvo)).to.be.true;
        });
    });
});