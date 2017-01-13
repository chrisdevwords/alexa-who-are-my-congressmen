
import mocha from 'mocha';
import chai from 'chai';
import request from 'request-promise-native';
import sinon from 'sinon';

const { beforeEach, afterEach, describe, it } = mocha;
const { expect, config } = chai;

config.includeStack = true;

import getMembersByAddress from '../src/serivce-helper';

describe('The Service Helper Methods', () => {

    describe('Get member by Address', () => {

        it('gets a member of congress by address', (done) => {
            getMembersByAddress('45 Main St. Brooklyn')
                .then(({ message }) => {
                    expect(message).to.eq(
                        'Your representative is Nydia M. Velázquez, ' +
                        'and your senators are Kirsten E. Gillibrand and and Charles E. Schumer.'
                    );
                    done();
                })
                .catch(done);
        });
    });
});
