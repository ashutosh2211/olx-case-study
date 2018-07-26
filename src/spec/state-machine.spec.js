const chai = require('chai');
const assert = chai.assert;
const TestClass = require('./fixtures/test-class');

describe('A TestClass which extends StateMachine', () => {
  let testClass;
  let invalidTransition = {};
  let seenStates = [];

  it('should properly instantiate', () => {
    testClass = new TestClass();
    assert.isObject(testClass);
  });

  describe('A TestClass instance', () => {
    it('should allow to register "onStateChange()" callback', () => {
      testClass.onStateChange((state) => {
        seenStates.push(state);
      });
    });

    it('should allow to register "onInvalidTransition()" callback', () => {
      testClass.onInvalidTransition((fromState, toState) => {
        invalidTransition = {fromState, toState};
      });
    });

    it('should be in the correct initial state', () => {
      assert.equal(testClass.getState(), 'solid');
    });

    it('should have all transition-table events as own functions', () => {
      assert.isFunction(testClass.melt);
      assert.isFunction(testClass.freeze);
      assert.isFunction(testClass.vaporize);
      assert.isFunction(testClass.condense);
    });

  });

  describe('Calling the "melt()" event', () => {
    it('should transition the state to liquid', async() => {
      await testClass.melt();
      assert.equal(testClass.getState(), 'liquid');
    });

    it('should have reported about to state changes through the callback', () => {
      assert.include(seenStates, 'solid');
      seenStates = [];
    });
  });

  describe('Calling the "melt()" event again', () => {
    it('should trigger "onInvalidTransition()" but not the "onStateChanged()" callback', async() => {
      await testClass.melt();
      assert.deepEqual({fromState: 'solid', toState: 'liquid'}, invalidTransition);
      assert.deepEqual([], seenStates);
    });

    it('should leave the current state', () => {
      assert.equal(testClass.getState(), 'liquid');
    });
  });

  describe('A non-awaited valid "freeze()" event', () => {
    it('should trigger the "onStateChange()" callback at first', async() => {
      testClass.freeze().catch(err => { throw err; });
      assert.deepEqual(['liquid'], seenStates);
      assert.equal(testClass.getState(), 'solid');
      seenStates = [];
    });

  });

  describe('A "*" should allow event triggers from any state', () => {
    it('the forceTo events should bring us to the target state no matter what', async() => {
      await testClass.forceToLiquid();
      assert.equal(testClass.getState(), 'liquid');
    });
  });
});
