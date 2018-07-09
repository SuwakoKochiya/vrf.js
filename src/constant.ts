import * as elliptic from "elliptic";
import { Point } from './utils';

export const EDDSA = new elliptic.eddsa('ed25519');
export const N2 = 32;
export const N = N2 / 2;
export const LIMIT = 100;
export const CO_FACTOR = 8;
export const G = EDDSA.curve.g as Point;
export const Q = EDDSA.curve.n as any;