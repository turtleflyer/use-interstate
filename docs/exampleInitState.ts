import { initInterstate } from '../lib/use-interstate';

export type NoteTitleID = `note-title-${number}`;

export type NotesTitles = { [P in NoteTitleID]: string };

export type NoteBodyID = `note-body-${number}`;

export type NotesBodies = { [P in NoteBodyID]: string };

export interface UIState {
  scrollPosition: number;
  columns: number;
}

export type AppState = UIState & NotesTitles & NotesBodies;

export const { useInterstate, setInterstate, readInterstate } = initInterstate<AppState>({
  scrollPosition: 0,
  columns: 1,
});
