# Technical Task - Reonic

---

## My Take on The Task - Abstract Flow

In the project all the tasks are connected. Frontend sends the input parameters to the backend and the backend uses those to run a simulation and gives the results back which are displayed using charts and cards. The backend behind the scenes uses the Task-1 to generate data. We reasoning to connect it was that it made the whole project feel connected and also that I didn't have to worry too much on how to structure my mockups. Now at a time on the frontend we are only able to see data for one (latest) simulation and that is my **_assumption_**. We start with nothing and clicking on simulate creates data using the Task-1 and stores that in the database. Refreshing it only removes it from the frontend. It's still present in the database.

**Note:** More information on this is mentioned in the separate ReadMe files.

## Folder Structure

This repository is mono-repo styled and contains two repos for all the tasks mentioned in the documents. Each subfolder contains a separate ReadMe.md that explain how to run it and what's happening in it.

**Note:** Task-1 is inside the backend folder.

## Running code

You need to run both servers to run the application.

## Code Comments

To make the project easier to follow:

- Key components include inline comments explaining design choices for frontend.
- Some files contain **abstract-level notes** describing what’s happening in the code and why.

## Some of the bonus tasks

- For task 1 I'd use seed so the output is reproducable each time we run the simulation.
- If we increase the charge points and keep the rest of parameters same the CF decreases steadily.
- For the bonus task of adding custom stations I'd add a card or a model where user can input the parameters and that would act as customizable bulk editor where in a single simulation you can configure the parameters for each charge point.
- For the other bonus task of deviation I'd use a time series graph to show the decreasing trend.

## Expanding on the code

- For the application I'd show a history of all previous simulations ran because right now we only show the latest.
- I'd use a reducer for the state of simulate and results.
- If the system needed to handle many users and higher simulation tick rates, I’d integrate a queueing or caching layer (e.g., Redis or RabbitMQ) to batch and manage requests efficiently.
