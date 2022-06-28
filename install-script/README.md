## What is it?

This script needs to be executed once for your Flex Instance. It just creates a new activity called "Flex for Mobile".

## Why do you need this?

- Flex needs a way to know if the Call should be sent to the Agent's cellphone or Desktop

- Flex should only send a Push Notification to an Agent's cellphone if they are working on mobile

- Supervisors need to be able to create custom reports in Flex Insights, separating the view and metrics of the agents on Desktop from the ones on Mobile (for example, "Average handle time" and other metrics are completely different on these devices)

## How to execute this script:

1. Go to the root folder (`cd ..` from here) and rename `/.env-example` to `/.env` and follow the instructions in the `.env` file.
2. Go back to this folder (`cd ./install-script`) and execute `npm install` to install the packages into your computer.
3. Execute `npm start` to execute the script.

Simple as that :-)
