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
  IPAddress: string | Array<string>;
  mac: string;
  manufacturer: string;
  adapter: string;
}
interface HostInfo {
  ip: string;
  mac: string;
  dnsName: string;
}
interface Scanner {
  hostInfo(): Promise<HostInfo | string>;
  getBios(): Promise<BiosInfo | string>;
  getHw(): Promise<HwInfo | string>;
  getOs(): Promise<OsInfo | string>;
  getNetworkAdpaterInfo(): Promise<AdapaterInfo | any>;
  wmiObject(sub_class: string, host: string): Promise<object | string>;
  checkRcp(): Promise<boolean>;
}

const scanner = class implements Scanner {
  host: any;
  constructor(host: any) {
    this.host = host;
  }
  async checkRcp() {
    const check = spawn("powershell.exe", [
      `Test-NetConnection -ComputerName ${this.host} -port 135 -WarningAction silentlyContinue | ConvertTo-Json `
    ]);
    let data = "";
    for await (const chunk of check.stdout) {
      // console.log("stdout chunk: " + chunk);
      data += chunk;
    }
    let error = "";
    for await (const chunk of check.stderr) {
      // console.error("stderr chunk: " + chunk);
      error += chunk;
    }
    const exitCode = await new Promise((resolve, reject) => {
      check.on("close", resolve);
    });

    if (exitCode) {
      return false;
    }
    const result = JSON.parse(data).TcpTestSucceeded;
    return result
  }
  async hostInfo(): Promise<HostInfo | string> {
    const getHost = spawn("powershell.exe", [
      `[System.Net.Dns]::GetHostByAddress('${this.host}').HostName`
    ]);
    let data = "";
    for await (const chunk of getHost.stdout) {
      // console.log("stdout chunk: " + chunk);
      data += chunk;
    }
    let error = "";
    for await (const chunk of getHost.stderr) {
      // console.error("stderr chunk: " + chunk);
      error += chunk;
    }
    const exitCode = await new Promise((resolve, reject) => {
      getHost.on("close", resolve);
    });

    if (exitCode) {
      return `Error code : ${exitCode}`;
    }

    const adapaters = await this.getNetworkAdpaterInfo().then((res) => {
      return res;
    });

    const hostMac = adapaters.filter((adapter: any) => {
      const macs = adapter.IPAddress;
      return macs != null;
    });
    const a = hostMac.filter((a: any) => {
      return a.IPAddress.includes(`${this.host}`);
    });

    return {
      ip: this.host,
      dnsName: data.replace(/(\r\n|\n|\r)/gm, ""),
      mac: a[0].mac
    };
  }
  async resolveHostname() {
    const getHost = spawn("powershell.exe", [
      `Resolve-DnsName -Name ${this.host} | ConvertTo-Json`
    ]);
    let data = "";
    for await (const chunk of getHost.stdout) {
      // console.log("stdout chunk: " + chunk);
      data += chunk;
    }
    let error = "";
    for await (const chunk of getHost.stderr) {
      // console.error("stderr chunk: " + chunk);
      error += chunk;
    }
    const exitCode = await new Promise((resolve, reject) => {
      getHost.on("close", resolve);
    });

    if (exitCode) {
      // throw new Error(`subprocess error exit ${exitCode}, ${error}`);
      return "unknown";
    }
    const response = JSON.parse(data)

    return response.NameHost ? response.NameHost : response.Name
  }
  async resolveIpAddress() {
    // [System.Net.Dns]::GetHostByAddress('140.251.72.25').HostName

    const getHost = spawn("powershell.exe", [
      `[System.Net.Dns]::GetHostAddresses('${this.host}') | ConvertTo-Json`
    ]);
    let data = "";
    for await (const chunk of getHost.stdout) {
      // console.log("stdout chunk: " + chunk);
      data += chunk;
    }
    let error = "";
    for await (const chunk of getHost.stderr) {
      // console.error("stderr chunk: " + chunk);
      error += chunk;
    }
    const exitCode = await new Promise((resolve, reject) => {
      getHost.on("close", resolve);
    });

    if (exitCode) {
      // throw new Error(`subprocess error exit ${exitCode}, ${error}`);
      return "unknown";
    }
  
    return JSON.parse(data).IPAddressToString;
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
  async getNetworkAdpaterInfo(): Promise<AdapaterInfo | any> {
    return await this.wmiObject(
      "win32_NetworkAdapterConfiguration",
      this.host
    ).then(
      (data) => {
        const response = data.map((adapter: any) => {
          return {
            name: adapter.Name,
            description: adapter.Description,
            IPAddress: adapter.IPAddress,
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
