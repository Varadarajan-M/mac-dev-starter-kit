import { exec } from "child_process";
import os from "os";
import { promisify } from "util";
import { InstallableItem } from "../types";
import path from "path";
import { readFileSync } from "fs";

export const isMacOs = os.type() === "Darwin";

export const execAsync = promisify(exec);


export const loadConfigFromJson = (fileName: string) : InstallableItem[] => {
    const config = readFileSync(path.join(__dirname, `../config/${fileName}.json`), 'utf8');
    return JSON.parse(config);
}