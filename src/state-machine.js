const EventEmitter = require('events');

/**
 * Provides state machine structure which can be extended
 * @class Represents the StateMachine
 */
class StateMachine {

  constructor(params) {
    this._state = params.initial;
    this._transitions = params.transitions;
    this._allowedStates = new Map();
    this._eventEmitter = new EventEmitter();
    this._init();
  }

  /**
   * Return the current state of the machine
   * @return {string} The current state of the machine
   */
  getState() {
    return this._state;
  }

  /**
   * Registers a function callback which listens for valid state changes
   * @param {function} callback which listens on a valid state change
   */
  onStateChange(callback) {
    this._eventEmitter.on('state', callback);
  }

  /**
   * Registers a function callback which listens for invalid state changes
   * @param {function} callback which listens on an invalid state change
   */
  onInvalidTransition(callback) {
    this._eventEmitter.on('invalidTransition', callback);
  }

  /**
   * Adds async function to be triggered on events which emits a vaild or invalid state change signal
   */
  _init() {
    for (let row of this._transitions) {
      if (this._allowedStates.has(row.event)) {
        this._allowedStates.get(row.event).push(row.from);
      } else {
        this._allowedStates.set(row.event, [row.from]);
      }
      // Generate the implementation of the event-function body
      this[row.event] = async(...args) => {
        // Check if the event is allowed in current state
        if (this._validate(row)) {
          // Update internal state
          this._state = row.to;
          // Notify all listeners for a new state
          this._eventEmitter.emit('state', row.from, this._state);
        } else {
          // Notify about invalid transition
          this._eventEmitter.emit('invalidTransition', row.from, this._state);
        }
      };
    }
    // Notify about reaching the initial state
    this._eventEmitter.emit('state', this._state);
  }

  /**
   * Checks if a particular transition is allowed from the current state
   * @param {string} transition to be checked
   */
  _validate(transition) {
    return this._allowedStates.get(transition.event).includes(this._state) || transition.from === '*';
  }

  /**
   * Checks if a particular event transition has reached a correct next State
   * @param {string} event to be checked
   * @param {string} finalState that should be reached
   */
  async validate(event, finalState) {
    await this[event]();
    return this._state.toLowerCase() === finalState.toLowerCase();
  }
}

module.exports = StateMachine;
