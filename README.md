# Notiflow

Notiflow is a React Native app that listens to notifications from other apps and, if they match specific triggers, sends data to a defined webhook URL.

<div>
  <img width="31%" src="https://github.com/0x7s0lt1/notiflow/blob/main/screenshots/Screenshot_1757706784.png" />
  <img width="31%" src="https://github.com/0x7s0lt1/notiflow/blob/main/screenshots/Screenshot_1757706795.png" />
  <img width="31%" src="https://github.com/0x7s0lt1/notiflow/blob/main/screenshots/Screenshot_1757706854.png" />
</div>

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
git clone https://github.com/0x7s0lt1/notiflow.git
cd notiflow
yarn install
npx expo run:android
```

Download: [notiflow.apk](https://github.com/0x7s0lt1/notiflow/blob/main/build/notiflow-v1.0.0.apk)
