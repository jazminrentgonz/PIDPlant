# PID Plant Incubator Web Application

## Overview
This repository contains the web-based control and monitoring interface for the **PID-Controlled Plant Incubator** capstone project.  
The application provides:

- A plant profile database
- A personal dashboard for managing selected plants
- PID control parameter configuration
- Bluetooth Low Energy (BLE) integration for live telemetry and control
- A modular frontend architecture suitable for hardware integration

This project is intended to be **collaboratively developed** by the capstone team. All teammates should follow the setup steps below to ensure a consistent development environment.

---

## System Architecture (High Level)

**Frontend**
- React + TypeScript
- Vite development/build tool
- Local state + localStorage persistence
- Web Bluetooth (BLE) for direct device communication

**Hardware Interface**
- BLE GATT service exposed by the incubator microcontroller
- Telemetry notifications (temperature, humidity, actuator output)
- Command writes (setpoints, PID gains, operating mode)

---

## Prerequisites

Each contributor must install the following **before running the project**.

### Required Software
| Tool | Version | Notes |
|----|----|----|
| Node.js | ≥ 18.x (LTS recommended) | Required for Vite |
| npm | Comes with Node | Package manager |
| Git | Latest | Version control |
| Chrome or Edge | Latest | Required for Web Bluetooth |

> ⚠️ **Web Bluetooth is not supported on Safari or iOS browsers.**

---

## Project Setup

### 1. Clone the Repository
```bash
git clone https://github.com/jazminrentgonz/PIDPlant.git
cd PIDPlant
````

### 2. Install Dependencies, Production Build, & Run Application 
```bash
npm install
npm run build
npm run dev
````

Click Local Site: http://localhost:5173/

### 3. Active App Development 
1. Pull before working
```bash
  git pull origin main 
````
2. Create a feature branch
```bash
  git checkout -b feature/your-feature-name
````
3. Commit frequently
```bash
  git add .
  git commit -m "Comment"
````
4. Push your branch, and then open pull request on GitHub
```bash
  git push origin feature/your-feature-name
````
---
## Project Website Application Software Structure: ##

<img width="450" height="946" alt="structure" src="https://github.com/user-attachments/assets/13d4a420-e994-4988-910f-0b85a843bde1" />
