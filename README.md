# Description:

Create a library which will be validating transitions between states and implement a graph of advert states using it.

# Case-Study

Implements a State Machine to validate transitions

## Stack

* NodeJS

* Mocha (Testing framework)

## Requirements
Install Node v10.x.x and npm from terminal

run commands:

```
$ cd <(root directory where package.json exists)>
$ npm install

```

## Installation:

cd <(root directory where package.json exists)>
npm install

## Testing

Unit Tests are written using mocha and chai

```
$ npm test
```

## Transitions
```
{
  "initial": "New",
  "transitions": [
    {
      "event": "activate",
      "from": "New",
      "to": "Active"
    },
    {
      "event": "expired",
      "from": "Active",
      "to": "Outdated"
    },
    {
      "event": "limit",
      "from": "New",
      "to": "Limited"
    },
    {
      "event": "activateLimited",
      "from": "Limited",
      "to": "Active"
    },
    {
      "event": "reactivate",
      "from": "Outdated",
      "to": "Active"
    },
    {
      "event": "remove",
      "from": "Outdated",
      "to": "Removed"
    }
  ]
}
```

## Running the cli:

Required arguments:

-f -> the path of the file containing the possible transitions or an initial state\
-e -> the name of the event

Optional arguments:

-i -> an optional initial state, will override the initial state provided in the above file\
-t -> the final state that is expected. If this parameter is provided the final state is checked explicitly.

## Examples
```
$ node src/cli.js -f states/advert.json -e activate -t Active

Transition successful: New to Active
Transition for event activate is Valid
```

```
$ node src/cli.js -f states/advert.json -e remove -t Removed -i Outdated

Transition successful: Outdated to Removed
Transition for event remove is Valid
```

```
$ node src/cli.js -f states/advert.json -e remove -i Outdated

Transition successful: Outdated to Removed
```