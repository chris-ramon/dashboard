import { expect } from "chai";

import { alexaRequestIntentLog, alexaRequestLaunchIntentLog, alexaRequestPlayerLog, alexaResponseLog, alexaResponsePlayerLog } from "../utils/test";
import { createConvo, Origin } from "./conversation";
import Log from "./log";
import Output from "./output";

describe("Alexa Conversation", function () {
    it("sets the properties", function () {
        let response = alexaResponseLog();
        let request = alexaRequestIntentLog();
        let output = new Output({
            message: "message",
            level: "DEBUG",
            timestamp: new Date(),
            transaction_id: "transaction_id",
            id: "id"
        });
        let outputs = [output];

        let conversation = createConvo({ response: response, request: request, outputs: outputs });

        expect(conversation).to.exist;
        expect(conversation.request).to.exist;
        expect(conversation.response).to.exist;
        expect(conversation.outputs).to.have.length(1);

        expect(conversation.origin).to.equal(Origin.AmazonAlexa);
        expect(conversation.sessionId).to.equal("SessionId.c5f6c9d5-e923-4305-9804-defee172386e");
        expect(conversation.userId).to.equal("amzn1.ask.account.AFP3ZWPOS2BGJR7OWJZ3DHPKMOMBGMYLIYKQUSZHAIR7ALWSV5B2MPTYCUZWZBNUJ3GFOZP6NOCGKQCA73Z2CS4II6OO5NQDUH52YC7UFM2ADB4WTMB66R5UONMNIZMS3NRHCTQXEUPMOQDRH3XSBXZWMGGZDSQA7R7E4EPA4IHO7FP6ANM7NFX7U7RQQ37AWQDI334WGWDJ63A");
        expect(conversation.requestPayloadType).to.equal("IntentRequest.HelloWorldIntent");
        expect(conversation.intent).to.equal("HelloWorldIntent");
        expect(conversation.timestamp).to.equal(request.timestamp);
        expect(conversation.outputs[0]).to.equal(output);
        expect(conversation.hasError).to.be.false;
    });

    describe("with launch intent request", function () {
        it("returns undefined for intent", function () {

            let response = alexaResponseLog();
            let request = alexaRequestLaunchIntentLog();

            let conversation = createConvo({ response: response, request: request });

            expect(conversation.intent).to.be.undefined;

        });
    });

    describe("with request from player", function () {
        it("sets the userId", function () {
            let conversation = createConvo({ response: alexaResponsePlayerLog(), request: alexaRequestPlayerLog() });
            expect(conversation.userId).to.equal("amzn1.ask.account.1237345d-bb6a-470a-b5fd-40dd148390a7");
        });
    });

    describe("hasError", function () {
        it("returns true when an error output exists", function () {
            let response = alexaResponseLog();
            let request = alexaRequestIntentLog();
            let output = new Output({
                message: "message",
                level: "ERROR",
                timestamp: new Date(),
                transaction_id: "transaction_id",
                id: "id"
            });
            let outputs = [output];

            let conversation = createConvo({ response: response, request: request, outputs: outputs });
            expect(conversation.hasError).to.be.true;
        });
    });

    describe("userColors", function () {
        it("returns default colors for an undefined userId", function () {

            let request = new Log({
                payload: {},
                log_type: "DEBUG",
                source: "source",
                transaction_id: "transaction_id",
                timestamp: new Date(),
                tags: [],
                id: ""
            });
            let response = alexaResponseLog();
            let output = new Output({
                message: "message",
                level: "DEBUG",
                timestamp: new Date(),
                transaction_id: "transaction_id",
                id: "id"
            });
            let outputs = [output];

            let conversation = createConvo({ response: response, request: request, outputs: outputs });

            expect(conversation.userColors.fill).to.equal("#ffffff");
            expect(conversation.userColors.background).to.equal("#000000");

        });

        it("returns the default colors for an empty string userId", function () {
            let request = new Log({
                payload: {
                    session: {
                        user: {
                            userId: ""
                        }
                    }
                },
                log_type: "DEBUG",
                source: "source",
                transaction_id: "transaction_id",
                timestamp: new Date(),
                tags: [],
                id: ""
            });
            let response = alexaResponseLog();
            let output = new Output({
                message: "message",
                level: "DEBUG",
                timestamp: new Date(),
                transaction_id: "transaction_id",
                id: "id"
            });
            let outputs = [output];

            let conversation = createConvo({ response: response, request: request, outputs: outputs });

            expect(conversation.userColors.fill).to.equal("#ffffff");
            expect(conversation.userColors.background).to.equal("#000000");
        });

        it("returns the hex color for a hex userId", function () {
            let request = new Log({
                payload: {
                    session: {
                        user: {
                            userId: "A234b6"
                        }
                    },
                    request: {
                        type: "TestRequest"
                    }
                },
                log_type: "DEBUG",
                source: "source",
                transaction_id: "transaction_id",
                timestamp: new Date(),
                tags: [],
                id: ""
            });
            let response = alexaResponseLog();
            let output = new Output({
                message: "message",
                level: "DEBUG",
                timestamp: new Date(),
                transaction_id: "transaction_id",
                id: "id"
            });
            let outputs = [output];

            let conversation = createConvo({ response: response, request: request, outputs: outputs });

            expect(conversation.userColors.fill).to.equal("#A234b6");
            expect(conversation.userColors.background).to.equal("#48b634");
        });

        it("returns the hex value for a base 36 userId", function () {
            let request = new Log({
                payload: {
                    session: {
                        user: {
                            userId: "ZZZZZZ"
                        }
                    },
                    request: {
                        type: "TestRequest"
                    }
                },
                log_type: "DEBUG",
                source: "source",
                transaction_id: "transaction_id",
                timestamp: new Date(),
                tags: [],
                id: ""
            });
            let response = alexaResponseLog();
            let output = new Output({
                message: "message",
                level: "DEBUG",
                timestamp: new Date(),
                transaction_id: "transaction_id",
                id: "id"
            });
            let outputs = [output];

            let conversation = createConvo({ response: response, request: request, outputs: outputs });

            expect(conversation.userColors.fill).to.equal("#bf0fff");
            expect(conversation.userColors.background).to.equal("#4fff0f");
        });

        it("returns the default hex color when no user id is present.", function () {
            let request = new Log({
                payload: {
                    request: {
                        type: "TestRequest"
                    }
                },
                log_type: "DEBUG",
                source: "source",
                transaction_id: "transaction_id",
                timestamp: new Date(),
                tags: [],
                id: ""
            });
            let response = alexaResponseLog();
            let output = new Output({
                message: "message",
                level: "DEBUG",
                timestamp: new Date(),
                transaction_id: "transaction_id",
                id: "id"
            });
            let outputs = [output];

            let conversation = createConvo({ response: response, request: request, outputs: outputs });

            expect(conversation.userColors.fill).to.equal("#ffffff");
            expect(conversation.userColors.background).to.equal("#000000");
        });

        it("returns the appropriate request payload type.", function () {
            let request = new Log({
                payload: {
                    session: {
                        user: {
                            userId: "ZZZZZZ"
                        }
                    },
                    request: {
                        type: "TestRequest"
                    }
                },
                log_type: "DEBUG",
                source: "source",
                transaction_id: "transaction_id",
                timestamp: new Date(),
                tags: [],
                id: ""
            });
            let response = alexaResponseLog();
            let output = new Output({
                message: "message",
                level: "DEBUG",
                timestamp: new Date(),
                transaction_id: "transaction_id",
                id: "id"
            });
            let outputs = [output];

            let conversation = createConvo({ response: response, request: request, outputs: outputs });
            expect(conversation.requestPayloadType).to.equal("TestRequest");
        });

        it("returns undefined if the request payload does not have a request object.", function () {
            let request = new Log({
                payload: {
                    session: {
                        user: {
                            userId: "ZZZZZZ"
                        }
                    }
                },
                log_type: "DEBUG",
                source: "source",
                transaction_id: "transaction_id",
                timestamp: new Date(),
                tags: [],
                id: ""
            });
            let response = alexaResponseLog();
            let output = new Output({
                message: "message",
                level: "DEBUG",
                timestamp: new Date(),
                transaction_id: "transaction_id",
                id: "id"
            });
            let outputs = [output];

            let conversation = createConvo({ response: response, request: request, outputs: outputs });
            expect(conversation.requestPayloadType).to.be.undefined;
        });

        it("returns undefined if the request payload does not exist.", function () {
            let request = new Log({
                payload: "Generic string",
                log_type: "DEBUG",
                source: "source",
                transaction_id: "transaction_id",
                timestamp: new Date(),
                tags: [],
                id: ""
            });
            let response = alexaResponseLog();
            let output = new Output({
                message: "message",
                level: "DEBUG",
                timestamp: new Date(),
                transaction_id: "transaction_id",
                id: "id"
            });
            let outputs = [output];

            let conversation = createConvo({ response: response, request: request, outputs: outputs });
            expect(conversation.requestPayloadType).to.be.undefined;
        });
    });

    describe("getOutputSpeech", function(){
      it("returns undefined when there is no response or payload at all", function(){
        let request = new Log({
          payload: {},
          log_type: "DEBUG",
          source: "source",
          transaction_id: "transaction_id",
          timestamp: new Date(),
          tags: [],
          id: ""
        });
        let response = new Log({
          payload: {},
          log_type: "DEBUG",
          source: "source",
          transaction_id: "transaction_id",
          timestamp: new Date(),
          tags: [],
          id: ""
        });
        let output = new Output({
          message: "message",
          level: "DEBUG",
          timestamp: new Date(),
          transaction_id: "transaction_id",
          id: "id"
        });
        let outputs = [output];

        let conversation = createConvo({ response: response, request: request, outputs: outputs });

        expect(conversation.outputSpeechText).to.be.undefined;
      });

      it("returns the text when there is response and outputSpeech text on the payload", function(){
        let request = new Log({
          payload: {},
          log_type: "DEBUG",
          source: "source",
          transaction_id: "transaction_id",
          timestamp: new Date(),
          tags: [],
          id: ""
        });
        let response = new Log({
          payload: {response: {outputSpeech: {text: "this is a test text to render on the conversation bubble"}}},
          log_type: "DEBUG",
          source: "source",
          transaction_id: "transaction_id",
          timestamp: new Date(),
          tags: [],
          id: ""
        });
        let output = new Output({
          message: "message",
          level: "DEBUG",
          timestamp: new Date(),
          transaction_id: "transaction_id",
          id: "id"
        });
        let outputs = [output];

        let conversation = createConvo({ response: response, request: request, outputs: outputs });

        expect(conversation.outputSpeechText).to.equals("this is a test text to render on the conversation bubble");
      });
    });

    describe("without a request", function () {

        let response = alexaResponseLog();
        let request = undefined;
        let output = new Output({
            message: "message",
            level: "DEBUG",
            timestamp: new Date(),
            transaction_id: "transaction_id",
            id: "id"
        });
        let outputs = [output];

        let conversation = createConvo({ response: response, request: request, outputs: outputs });

        it("returns the id from the response", function () {
            expect(conversation.id).to.equal(response.id);
        });

        it("returns the timestamp from the response", function () {
            expect(conversation.timestamp).to.equal(response.timestamp);
        });
    });
});
