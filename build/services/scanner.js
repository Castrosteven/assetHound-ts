"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const scanner = class {
    constructor(host) {
        this.host = host;
    }
    checkRcp() {
        var e_1, _a, e_2, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const check = child_process_1.spawn("powershell.exe", [
                `Test-NetConnection -ComputerName ${this.host} -port 135 -WarningAction silentlyContinue | ConvertTo-Json `,
            ]);
            let data = "";
            try {
                for (var _c = __asyncValues(check.stdout), _d; _d = yield _c.next(), !_d.done;) {
                    const chunk = _d.value;
                    // console.log("stdout chunk: " + chunk);
                    data += chunk;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) yield _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
            let error = "";
            try {
                for (var _e = __asyncValues(check.stderr), _f; _f = yield _e.next(), !_f.done;) {
                    const chunk = _f.value;
                    // console.error("stderr chunk: " + chunk);
                    error += chunk;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_2) throw e_2.error; }
            }
            const exitCode = yield new Promise((resolve, reject) => {
                check.on("close", resolve);
            });
            if (exitCode) {
                return false;
            }
            const result = JSON.parse(data).TcpTestSucceeded;
            return result;
        });
    }
    hostInfo() {
        var e_3, _a, e_4, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const getHost = child_process_1.spawn("powershell.exe", [
                `[System.Net.Dns]::GetHostByAddress('${this.host}').HostName`,
            ]);
            let data = "";
            try {
                for (var _c = __asyncValues(getHost.stdout), _d; _d = yield _c.next(), !_d.done;) {
                    const chunk = _d.value;
                    // console.log("stdout chunk: " + chunk);
                    data += chunk;
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) yield _a.call(_c);
                }
                finally { if (e_3) throw e_3.error; }
            }
            let error = "";
            try {
                for (var _e = __asyncValues(getHost.stderr), _f; _f = yield _e.next(), !_f.done;) {
                    const chunk = _f.value;
                    // console.error("stderr chunk: " + chunk);
                    error += chunk;
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_4) throw e_4.error; }
            }
            const exitCode = yield new Promise((resolve, reject) => {
                getHost.on("close", resolve);
            });
            if (exitCode) {
                return `Error code : ${exitCode}`;
            }
            const adapaters = yield this.getNetworkAdpaterInfo().then((res) => {
                return res;
            });
            const hostMac = adapaters.filter((adapter) => {
                const macs = adapter.IPAddress;
                return macs != null;
            });
            const a = hostMac.filter((a) => {
                return a.IPAddress.includes(`${this.host}`);
            });
            return {
                ip: this.host,
                dnsName: data.replace(/(\r\n|\n|\r)/gm, ""),
                mac: a[0].mac,
            };
        });
    }
    resolveHostname() {
        var e_5, _a, e_6, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const getHost = child_process_1.spawn("powershell.exe", [
                `Resolve-DnsName -Name ${this.host} | ConvertTo-Json`,
            ]);
            let data = "";
            try {
                for (var _c = __asyncValues(getHost.stdout), _d; _d = yield _c.next(), !_d.done;) {
                    const chunk = _d.value;
                    // console.log("stdout chunk: " + chunk);
                    data += chunk;
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) yield _a.call(_c);
                }
                finally { if (e_5) throw e_5.error; }
            }
            let error = "";
            try {
                for (var _e = __asyncValues(getHost.stderr), _f; _f = yield _e.next(), !_f.done;) {
                    const chunk = _f.value;
                    // console.error("stderr chunk: " + chunk);
                    error += chunk;
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_6) throw e_6.error; }
            }
            const exitCode = yield new Promise((resolve, reject) => {
                getHost.on("close", resolve);
            });
            if (exitCode) {
                // throw new Error(`subprocess error exit ${exitCode}, ${error}`);
                return "unknown";
            }
            const response = JSON.parse(data);
            return response.NameHost ? response.NameHost : response.Name;
        });
    }
    resolveIpAddress() {
        var e_7, _a, e_8, _b;
        return __awaiter(this, void 0, void 0, function* () {
            // [System.Net.Dns]::GetHostByAddress('140.251.72.25').HostName
            const getHost = child_process_1.spawn("powershell.exe", [
                `[System.Net.Dns]::GetHostAddresses('${this.host}') | ConvertTo-Json`,
            ]);
            let data = "";
            try {
                for (var _c = __asyncValues(getHost.stdout), _d; _d = yield _c.next(), !_d.done;) {
                    const chunk = _d.value;
                    // console.log("stdout chunk: " + chunk);
                    data += chunk;
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) yield _a.call(_c);
                }
                finally { if (e_7) throw e_7.error; }
            }
            let error = "";
            try {
                for (var _e = __asyncValues(getHost.stderr), _f; _f = yield _e.next(), !_f.done;) {
                    const chunk = _f.value;
                    // console.error("stderr chunk: " + chunk);
                    error += chunk;
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_8) throw e_8.error; }
            }
            const exitCode = yield new Promise((resolve, reject) => {
                getHost.on("close", resolve);
            });
            if (exitCode) {
                // throw new Error(`subprocess error exit ${exitCode}, ${error}`);
                return "unknown";
            }
            return JSON.parse(data).IPAddressToString;
        });
    }
    wmiObject(sub_class, host) {
        var e_9, _a, e_10, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const child = child_process_1.spawn("powershell.exe", [
                `Get-WMIObject -ComputerName ${host} ${sub_class} | ConvertTo-Json`,
            ]);
            let data = "";
            try {
                for (var _c = __asyncValues(child.stdout), _d; _d = yield _c.next(), !_d.done;) {
                    const chunk = _d.value;
                    // console.log("stdout chunk: " + chunk);
                    data += chunk;
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) yield _a.call(_c);
                }
                finally { if (e_9) throw e_9.error; }
            }
            let error = "";
            try {
                for (var _e = __asyncValues(child.stderr), _f; _f = yield _e.next(), !_f.done;) {
                    const chunk = _f.value;
                    // console.error("stderr chunk: " + chunk);
                    error += chunk;
                }
            }
            catch (e_10_1) { e_10 = { error: e_10_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_10) throw e_10.error; }
            }
            const exitCode = yield new Promise((resolve, reject) => {
                child.on("close", resolve);
            });
            if (exitCode) {
                throw new Error(`${exitCode}`);
            }
            return JSON.parse(data);
        });
    }
    getOs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.wmiObject("win32_operatingsystem", this.host).then((data) => {
                const response = {
                    Name: data.Caption,
                    Version: data.Version,
                    BuildNumber: data.BuildNumber,
                    OSArchitecture: data.OSArchitecture,
                    Manufacturer: data.Manufacturer,
                };
                return response;
            }, (error) => {
                return `rpc server is unavailable ${error}`;
            });
        });
    }
    getHw() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.wmiObject("win32_computersystem", this.host).then((data) => {
                const response = {
                    Name: data.Caption,
                    Domain: data.Domain,
                    Manufacturer: data.Manufacturer,
                    Model: data.Model,
                };
                return response;
            }, (error) => {
                return `rpc server is unavailable ${error}`;
            });
        });
    }
    getBios() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.wmiObject("win32_bios", this.host).then((data) => {
                const response = {
                    SerialNumber: data.SerialNumber,
                };
                return response;
            }, (error) => {
                return `rpc server is unavailable ${error}`;
            });
        });
    }
    getNetworkAdpaterInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.wmiObject("win32_NetworkAdapterConfiguration", this.host).then((data) => {
                const response = data.map((adapter) => {
                    return {
                        name: adapter.Name,
                        description: adapter.Description,
                        IPAddress: adapter.IPAddress,
                        mac: adapter.MACAddress,
                        manufacturer: adapter.Manufacturer,
                        adapter: adapter.NetConnectionID,
                    };
                });
                return response;
            }, (error) => {
                return `rpc server is unavailable ${error}`;
            });
        });
    }
    allInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const hostInfo = yield this.hostInfo();
            const osInfo = yield this.getOs();
            const hwInfo = yield this.getHw();
            const biosInfo = yield this.getBios();
            const networkInfo = yield this.getNetworkAdpaterInfo();
            const response = {
                hostInfo: hostInfo,
                osInfo: osInfo,
                hwInfo: hwInfo,
                biosInfo: biosInfo,
                networkInfo: networkInfo,
            };
            return response;
        });
    }
};
exports.default = scanner;
