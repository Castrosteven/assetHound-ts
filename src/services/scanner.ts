import { spawn } from "child_process";

interface OsInfo {
  Name: string;
  Version: string;
  BuildNumber: string;
  OSArchitecture: string;
  Manufacturer: string;
}
interface HwInfo {
  Name: string;
  Domain: string;
  Manufacturer: string;
  Model: string;
}

interface BiosInfo {
  SerialNumber: string;
}

interface AdapaterInfo {
  name: string;
  description: string;
  mac: string;
  manufacturer: string;
  adapter: string;
}

interface Scanner {
  getBios(): Promise<BiosInfo | string>;
  getHw(): Promise<HwInfo | string>;
  getOs(): Promise<OsInfo | string>;
  getNetworkAdpaterInfo(): Promise<AdapaterInfo | string>;
  wmiObject(sub_class: string, host: string): Promise<object | string>;
}

const scanner = class implements Scanner {
  host: string;
  constructor(host: string) {
    this.host = host;
  }

  async wmiObject(sub_class: string, host: string) {
    const child = spawn("powershell.exe", [
      `Get-WMIObject -ComputerName ${host} ${sub_class} | ConvertTo-Json`
    ]);
    let data: string = "";
    for await (const chunk of child.stdout) {
      // console.log("stdout chunk: " + chunk);
      data += chunk;
      //
    }
    let error: string = "";
    for await (const chunk of child.stderr) {
      // console.error("stderr chunk: " + chunk);
      error += chunk;
    }
    const exitCode = await new Promise((resolve, reject) => {
      child.on("close", resolve);
    });

    if (exitCode) {
      throw new Error(`${exitCode}`);
    }

    return JSON.parse(data);
  }
  async getOs(): Promise<OsInfo | string> {
    console.log(this.host);
    return await this.wmiObject("win32_operatingsystem", this.host).then(
      (data) => {
        const response = {
          Name: data.Caption,
          Version: data.Version,
          BuildNumber: data.BuildNumber,
          OSArchitecture: data.OSArchitecture,
          Manufacturer: data.Manufacturer
        };
        return response;
      },
      (error) => {
        return `rpc server is unavailable ${error}`;
      }
    );
  }
  async getHw(): Promise<HwInfo | string> {
    return await this.wmiObject("win32_computersystem", this.host).then(
      (data) => {
        const response = {
          Name: data.Caption,
          Domain: data.Domain,
          Manufacturer: data.Manufacturer,
          Model: data.Model
        };
        return response;
      },
      (error) => {
        return `rpc server is unavailable ${error}`;
      }
    );
  }
  async getBios(): Promise<BiosInfo | string> {
    return await this.wmiObject("win32_bios", this.host).then(
      (data) => {
        const response = {
          SerialNumber: data.SerialNumber
        };
        return response;
      },
      (error) => {
        return `rpc server is unavailable ${error}`;
      }
    );
  }
  async getNetworkAdpaterInfo(): Promise<AdapaterInfo | string> {
    return await this.wmiObject("win32_NetworkAdapter", this.host).then(
      (data) => {
        const response = data.map((adapter: any) => {
          return {
            name: adapter.Name,
            description: adapter.Description,
            mac: adapter.MACAddress,
            manufacturer: adapter.Manufacturer,
            adapter: adapter.NetConnectionID
          };
        });
        return response;
      },
      (error) => {
        return `rpc server is unavailable ${error}`;
      }
    );
  }
};

export default scanner;
