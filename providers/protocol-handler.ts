import path from 'node:path';

import { app, BrowserWindow } from 'electron';

import getSongControls from './song-controls';

export const APP_PROTOCOL = 'youtubemusic';

let protocolHandler: ((cmd: string) => void) | undefined;

export function setupProtocolHandler(win: BrowserWindow) {
  if (process.defaultApp && process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(
      APP_PROTOCOL,
      process.execPath,
      [path.resolve(process.argv[1])],
    );
  } else {
    app.setAsDefaultProtocolClient(APP_PROTOCOL);
  }

  const songControls = getSongControls(win);

  protocolHandler = ((cmd: keyof typeof songControls) => {
    if (Object.keys(songControls).includes(cmd)) {
      songControls[cmd]();
    }
  }) as (cmd: string) => void;
}

export function handleProtocol(cmd: string) {
  protocolHandler?.(cmd);
}

export function changeProtocolHandler(f: (cmd: string) => void) {
  protocolHandler = f;
}

export default {
  APP_PROTOCOL,
  setupProtocolHandler,
  handleProtocol,
  changeProtocolHandler,
};

