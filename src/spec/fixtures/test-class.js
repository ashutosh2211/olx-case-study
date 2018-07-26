const StateMachine = require('../../state-machine');

class TestClass extends StateMachine{

  constructor() {
    const transitionTable = {
      initial: 'solid',
      transitions: [
        {event: 'melt', from: 'solid', to: 'liquid'},
        {event: 'freeze', from: 'liquid', to: 'solid'},
        {event: 'vaporize', from: 'liquid', to: 'gas'},
        {event: 'condense', from: 'gas', to: 'liquid'},
        {event: 'forceToLiquid', from: '*', to: 'liquid'},
      ],
    };
    super(transitionTable);
  }

}

module.exports = TestClass;
