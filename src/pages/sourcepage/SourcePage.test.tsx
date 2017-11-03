import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as moment from "moment";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { Button } from "react-toolbox/lib/button";
import Dialog from "react-toolbox/lib/dialog";

import LogService from "../../services/log";
import { dummyLogs, dummySources } from "../../utils/test";
import SourceFullSummary from "./SourceFullSummary";
import SourceHeader from "./SourceHeader";
import { SourcePage } from "./SourcePage";

chai.use(sinonChai);
chai.use(require("chai-datetime"));
let expect = chai.expect;

describe("Source Page", function () {
    let logs = dummyLogs(10);
    let source = dummySources(1)[0];
    const user: any = { isOwner: true };

    describe("Initial load", function () {
        let getLogs: sinon.SinonStub;
        let getTimeSummary: sinon.SinonStub;
        let getIntentSummary: sinon.SinonStub;
        let getSourceSummary: sinon.SinonStub;
        let goHome: sinon.SinonStub;
        let removeSource: sinon.SinonStub;

        before(function () {
            getLogs = sinon.stub(LogService, "getLogs").returns(Promise.resolve(logs));
            getTimeSummary = sinon.stub(LogService, "getTimeSummary").returns(Promise.resolve(dummyTimeSummary(5)));
            getIntentSummary = sinon.stub(LogService, "getIntentSummary").returns(Promise.resolve(dummyIntentSummary(5)));
            getSourceSummary = sinon.stub(LogService, "getSourceSummary").returns(Promise.resolve(dummySourceStats()));
            goHome = sinon.stub();
            removeSource = sinon.stub();
        });

        afterEach(function () {
            getLogs.reset();
            getTimeSummary.reset();
            getIntentSummary.reset();
            getSourceSummary.reset();
            goHome.reset();
            removeSource.reset();
        });

        after(function () {
            getLogs.restore();
            getTimeSummary.restore();
            getIntentSummary.restore();
            getSourceSummary.restore();
        });

        it("Tests that the source details header is visible when source exists.", function () {
            const wrapper = shallow((
                <SourcePage user={user} source={source} goHome={goHome} removeSource={removeSource} />
            ));

            const dataTiles = wrapper.find(SourceHeader);
            expect(dataTiles).to.have.length(1);
        });

        it("Tests that nothing is displayed when source is not defined.", function () {
            const wrapper = shallow((
                <SourcePage user={user} source={undefined} goHome={goHome} removeSource={removeSource} />
            ));

            expect(wrapper.find(SourceHeader)).to.have.length(0);
            expect(wrapper.find(SourceFullSummary)).to.have.length(0);
            expect(wrapper.find(SourcePage)).to.have.length(0);
        });

        it("Tests that the source data tiles have their correct values.", function () {
            const wrapper = shallow((
                <SourcePage user={user} source={source} goHome={goHome} removeSource={removeSource} />
            ));

            const dataTile = wrapper.find(SourceHeader).at(0);
            expect(dataTile).to.have.prop("source", source);
        });

        it("Tests that the summary view is there.", function () {
            const wrapper = shallow((
                <SourcePage user={user} source={source} goHome={goHome} removeSource={removeSource} />
            ));

            expect(wrapper.find(SourceFullSummary)).to.have.length(1);
        });

        it("Tests that the summary view has the appropriate props.", function () {
            const start = moment().subtract(7, "days");
            const end = moment();
            const wrapper = shallow((
                <SourcePage user={user} source={source} goHome={goHome} removeSource={removeSource} />
            ));

            const summary = wrapper.find(SourceFullSummary);
            expect(summary).to.have.prop("source", source);

            // Can't use the convience of chai to check dates.
            const startProp = summary.prop("startDate") as moment.Moment;
            const endProp = summary.prop("endDate") as moment.Moment;
            expect(startProp.toDate()).to.equalDate(start.toDate());
            expect(endProp.toDate()).to.equalDate(end.toDate());
        });
    });

    describe("Delete source", function () {
        let goHome: sinon.SinonStub;
        let removeSource: sinon.SinonStub;
        let wrapper: ShallowWrapper<any, any>;

        describe("Successful deletes", function () {
            beforeEach(function () {
                goHome = sinon.stub();
                removeSource = sinon.stub().returns(Promise.resolve(source));
                wrapper = shallow(<SourcePage user={user} source={source} goHome={goHome} removeSource={removeSource} />);
            });

            it("Tests the dialog is opened.", function () {
                wrapper.find(Button).at(0).simulate("click");

                expect(wrapper.state("deleteDialogActive")).to.be.true;

                const dialog = wrapper.find(Dialog);
                expect(dialog.prop("active")).to.be.true;
            });

            describe("Dialog", function () {
                let dialog: ShallowWrapper<any, any>;
                let actions: any[];

                beforeEach(function () {
                    // Act like we just opened it.
                    wrapper.find(Button).at(0).simulate("click");

                    dialog = wrapper.find(Dialog).at(0);
                    actions = dialog.prop("actions");
                });

                it("Tests the first action is proper.", function () {
                    const action = actions[0];

                    // first one is the cancel action.
                    expect(action.label).to.equal("Cancel");
                    expect(action.onClick).to.exist;
                });

                it("Tests the second action is proper.", function () {
                    const action = actions[1];

                    // second one is the delete action.
                    expect(action.label).to.equal("Delete");
                    expect(action.onClick).to.exist;
                });

                describe("First Action", function () {
                    beforeEach(function () {
                        const action = actions[0];
                        action.onClick();
                    });

                    it("Tests the first action performed its duties.", function () {
                        expect(wrapper.state("deleteDialogActive")).to.be.false;
                    });
                });

                describe("Second Action", function () {
                    beforeEach(function () {
                        const action = actions[1];
                        return action.onClick(); // This action returns a Promise just for this test.
                    });

                    it("Tests the delete action called remove source..", function () {
                        expect(removeSource).to.have.been.calledOnce;
                        expect(removeSource).to.have.been.calledWith(source);
                    });

                    it("Tests the delete action called GoHome once removed.", function () {
                        expect(goHome).to.be.calledOnce;
                    });
                });
            });
        });

        describe("Unsuccessful deletes", function () {
            before(function () {
                goHome = sinon.stub();
                removeSource = sinon.stub().returns(Promise.reject(new Error("Error per requirements of the test.")));
                wrapper = shallow(<SourcePage user={user} source={source} goHome={goHome} removeSource={removeSource} />);

                const actions = wrapper.find(Dialog).at(0).prop("actions");
                const deleteAction = actions[1];
                return deleteAction.onClick();
            });

            it("Tests the GoHome method is not called on failed delete.", function () {
                expect(goHome).to.not.be.called;
            });
        });
    });
});

function dummyTimeSummary(size: number): LogService.TimeSummary {
    return {
        buckets: dummyTimeBuckets(size),
        amazonBuckets: dummyTimeBuckets(size / 2),
        googleBuckets: dummyTimeBuckets(size / 2)
    };
}

function dummyIntentSummary(size: number): LogService.IntentSummary {
    return {
        count: dummyIntentBuckets(size)
    };
}

function dummySourceStats(): LogService.SourceStats {
    return {
        source: randomNameGenerator(),
        stats: {
            totalUsers: 1000,
            totalEvents: 2000,
            totalExceptions: 5 // Don't want to go crazy here.
        },
        "Amazon.Alexa": {
            totalUsers: 2000,
            totalEvents: 1000,
            totalExceptions: 6
        },
        "Google.Home": {
            totalUsers: 5000,
            totalEvents: 3000,
            totalExceptions: 7
        },
        Unknown: {
            totalUsers: 7000,
            totalEvents: 4000,
            totalExceptions: 8
        }
    };
}

function dummyTimeBuckets(size: number): LogService.TimeBucket[] {
    let buckets: LogService.TimeBucket[] = [];

    let date: Date = new Date();
    for (let i = 0; i < size; ++i) {
        buckets.push({
            date: date.toISOString(),
            count: i
        });
        date.setDate(date.getDate() - 1);
    }

    return buckets;
}

function dummyIntentBuckets(size: number): LogService.IntentBucket[] {
    let buckets: LogService.IntentBucket[] = [];

    for (let i = 0; i < size; ++i) {
        buckets.push({
            name: randomNameGenerator(),
            count: i,
            origin: "Amazon.Alexa"
        });
    }

    return buckets;
}

function randomNameGenerator(): string {
    let name: string = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; ++i) {
        name += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return name;
}
