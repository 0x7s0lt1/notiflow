# NotiFlow

Notiflow is a React Native app that listens to notifications from other apps and, if they match specific triggers, sends data to a defined webhook URL.

## Features
- Listens to notifications (with user permission)
- Detects triggers based on keywords
- Sends configurable webhook payloads
- Runs in background (headless tasks)

## Requirements
- Android 7.0+
- Notification access permission enabled

## Setup
```bash
git clone https://github.com/0x7s0lt1/twfl-notiflow.git
cd notiflow
yarn install
npx expo run:android