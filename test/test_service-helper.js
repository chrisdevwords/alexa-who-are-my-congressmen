
import mocha from 'mocha';
import chai from 'chai';
import request from 'request-promise-native';
import sinon from 'sinon';

const { beforeEach, afterEach, describe, it } = mocha;
const { expect, config } = chai;

config.includeStack = true;

import {
    getMembersByAddress,
    getBulkContactMessage,
    sendBulkMessage
} from '../src/serivce-helper';

describe('The Service Helper Methods', () => {

    describe('#getMemberByAddress', () => {

        it('gets a member of congress by address', (done) => {
            getMembersByAddress('45 Main St. Brooklyn')
                .then(({ representative }) => {
                    const { name } = representative;
                    expect(name).to.eq(
                        'Nydia M. Velázquez'
                    );
                    done();
                })
                .catch(done);
        });
    });

    describe('send SMS message', () => {

        context.skip('with a valid message', () => {
            it('sends a valid message', (done) => {
                sendBulkMessage('Marco Rubio here! I am a lego figure')
                    .then((result) => {
                        expect(result.code).to.eq(200);
                        done();
                    })
                    .catch(done);
            });
        });
    });


    describe('#getBulkContactMessage', () => {
        context('with 3 members of congress', () => {
            
            it('resolves with a message of multiple contacts', (done) => {
                getBulkContactMessage(['Nydia M. Velázquez', 'Mike Doyle', 'Mitch McConnel'])
                    .then((contacts) => {
                        expect(contacts).to.be.an('array');
                        expect(contacts.length).to.eq(3);
                        contacts.forEach(({ message }) => {
                            expect(message).to.be.a('string');
                        });
                        done();
                    })
                    .catch(done);
            });
        });

        context('with names it can`t find', () => {
            it('resolves with an error message', (done) => {
                getBulkContactMessage(['Mayor McCheese', 'Biff Tannen', 'Joe Quimby'])
                    .then((contacts) => {
                        expect(contacts).to.be.an('array');
                        expect(contacts.length).to.eq(3);
                        contacts.forEach(({ message }) => {
                            expect(message).to.be.a('string');
                        });
                        done();
                    })
                    .catch(done);

            })
        });

        context('with at least one name it can find', () => {
            it('resolves with an error message', (done) => {
                getBulkContactMessage(['Charles Schumer', 'Biff Tannen', 'Joe Quimby'])
                    .then((contacts) => {
                        expect(contacts).to.be.an('array');
                        expect(contacts.length).to.eq(3);
                        contacts.forEach(({ message }) => {
                            expect(message).to.be.a('string');
                        });
                        done();
                    })
                    .catch(done);

            })
        });

    })
});
