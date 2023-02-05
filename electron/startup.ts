import { execFile } from "child_process"

const SERVICE_PATH = `C:\\Program Files (x86)\\DYMO\\DYMO Connect\\DYMO.WebApi.Win.Host.exe`
const PARAMETERS = ["--incognito"]

export const startDYMOWebServices = () => {
    execFile(SERVICE_PATH, PARAMETERS);
}