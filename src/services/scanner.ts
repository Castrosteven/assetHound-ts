import { spawn } from "child_process";

interface OsInfo {
  Name: string;
  Version: string;
  BuildNumber: string;
  OSArchitecture: string;
  Manufacturer: string;
}

interface Scanner {
  getOs(): Promise<OsInfo | string>;
}

const scanner = class implements Scanner {
  host: string;
  constructor(host: string) {
    this.host = host;
  }

  async getOs(): Promise<OsInfo | string> {
    const win32_os = spawn("powershell.exe", [
      `Get-WMIObject -ComputerName ${this.host} win32_operatingsystem  | ConvertTo-Json`
    ]);
    let data: string = "";
    for await (const chunk of win32_os.stdout) {
      console.log("stdout chunk: " + chunk);
      data += chunk;
      //
    }
    let error: string = "";
    for await (const chunk of win32_os.stderr) {
      console.error("stderr chunk: " + chunk);
      error += chunk;
    }
    const exitCode = await new Promise((resolve, reject) => {
      win32_os.on("close", resolve);
    });
    let response;
    if (exitCode) {
      if (exitCode == 1) {
        return (response = "RPC Server is unavailable");
      }
    }

    const dataObj = JSON.parse(data);
    response = {
      Name: dataObj.Caption,
      Version: dataObj.Version,
      BuildNumber: dataObj.BuildNumber,
      OSArchitecture: dataObj.OSArchitecture,
      Manufacturer: dataObj.Manufacturer
    };
    return response;
  }
};

export default scanner;
