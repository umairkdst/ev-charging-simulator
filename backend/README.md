# EV Charging Simulation Backend

A lightweight backend built with **Express**, **SQLite**, and **TypeORM** to power EV charging simulations.

---

## Overview

The backend exposes **six routes** in total:

- The frontend primarily uses **`createParameters`** and **`mockSimulation`** APIs.
- The remaining routes are tested with **Vitest**.

Code structure follows a clean separation of concerns:  
**Routes → Controllers → Services**

- **`createParameters`**: Accepts input from the frontend and saves it into the database.
- **`simulate`**: Runs the simulation logic (adapted from **Task 1**) to generate realistic data.
  - Includes helper functions:
    - **`exemplaryDay`** → simulates daily EV charging usage
    - **`generateChargePointPower`** → generates slightly randomized power usage, adjusted according to input parameters
- You can also view the db file online using this [link](https://sqliteviewer.app/).

---

## Prerequisites

- [Node.js](https://nodejs.org/)
- [SQLite](https://www.sqlite.org/)
- npm

---

## Getting Started

First intall the modules required using:

```bash
npm run install
```

Start the development server:

```bash
npm run dev
```

Run tests for APIs:

```bash
npm run test
```

Run the simulation (Task 1):

```bash
npm run simulate 20 18 11
```

**Note:** Parameters must be passed in this order:

1. **Charge Points**
2. **Car Consumption**
3. **Power per Chargepoint**
