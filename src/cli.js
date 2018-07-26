const StateMachine = require('./state-machine');
const fs = require('fs');
const errors = require('./errors');
const program = require('commander');

program
  .option('-f, --filePath <required>', 'States')
  .option('-e, --event <required>', 'Event')
  .option('-i, --initialState [initialState]', 'Initial State')
  .option('-t, --finalState [finalState]', 'Final State')
  .parse(process.argv);

/**
 * Runs the state machine transition based on command line arguments provided
 */
async function run() {
  if (!program.filePath || !program.event) {
    throw errors.ParametersMissing;
  }
  const states = JSON.parse(fs.readFileSync(program.filePath, 'utf8'));

  if (program.initialState) {
    states.initial = program.initialState;
  }
  const stateMachine = new StateMachine(states);

  stateMachine.onStateChange((fromState, toState) => {
    console.log(`Transition successful: ${fromState} to ${toState}`);
  });

  stateMachine.onInvalidTransition((fromState, toState) => {
    console.log(`Transition failed: ${fromState} to ${toState}`);
  });

  if (program.finalState) {
    const isValid = await stateMachine.validate(program.event, program.finalState);
    if (isValid) {
      console.log(`Transition for event ${program.event} is Valid`);
    } else {
      console.log(`Transition for event ${program.event} is Invalid`);
    }
  } else {
    await stateMachine[program.event]();
  }

}

/**
 * Main function to run the cli
 */
async function main() {
  try {
    await run();
  } catch (exc) {
    console.error(`Something went wrong: ${exc.message}`);
  }
}

main();
