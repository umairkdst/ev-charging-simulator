# EV Charging Simulation Frontend

A responsive frontend built with **React**, **TypeScript**, **TailwindCSS**, and **Chart.js** to visualize EV charging simulations.

---

## Overview

The user can configure simulation parameters through an interactive UI which are:

- **Number of Charge Points**
- **Arrival Probability Multiplier**
- **Car Consumption** (kWh per 100 km)
- **Charging Power per Chargepoint** (kW)

### Input Validation

- Inputs for **Car Consumption** and **Charging Power** are validated.
- If a value goes below a defined threshold, an **error message** is displayed and the **Simulate** button is disabled.

### Simulation Trigger

- By default, inputs are empty.
- Clicking the **Simulate** button in the header:
  - Triggers network request to backend which uses task-1 to generate data.
  - Displays **loading skeletons/spinners** while the data is being prepared

### User Interface

The UI is fully responsive for all screen sizes and caters loading and error states. Their is separation of concerns between components and the logic and there are some resuable components in the code like **KeyMetricCard**. ChartJs is used to create visually appealing charts.

---

## Prerequisites

- [Node.js](https://nodejs.org/)
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
