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
    hostInfo() {
        var e_1, _a, e_2, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const getHost = child_process_1.spawn("powershell.exe", [
                `[System.Net.Dns]::GetHostByAddress('${this.host}').HostName`
            ]);
            let data = "";
            try {
                for (var _c = __asyncValues(getHost.stdout), _d; _d = yield _c.next(), !_d.done;) {
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
                for (var _e = __asyncValues(getHost.stderr), _f; _f = yield _e.next(), !_f.done;) {
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
                mac: a[0].mac
            };
        });
    }
    wmiObject(sub_class, host) {
        var e_3, _a, e_4, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const child = child_process_1.spawn("powershell.exe", [
                `Get-WMIObject -ComputerName ${host} ${sub_class} | ConvertTo-Json`
            ]);
            let data = "";
            try {
                for (var _c = __asyncValues(child.stdout), _d; _d = yield _c.next(), !_d.done;) {
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
                for (var _e = __asyncValues(child.stderr), _f; _f = yield _e.next(), !_f.done;) {
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
                    Manufacturer: data.Manufacturer
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
                    Model: data.Model
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
                    SerialNumber: data.SerialNumber
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
                        adapter: adapter.NetConnectionID
                    };
                });
                return response;
            }, (error) => {
                return `rpc server is unavailable ${error}`;
            });
        });
    }
};
exports.default = scanner;
