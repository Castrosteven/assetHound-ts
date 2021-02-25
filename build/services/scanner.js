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
    getOs() {
        var e_1, _a, e_2, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const win32_os = child_process_1.spawn("powershell.exe", [
                "Get-WMIObject win32_operatingsystem"
            ]);
            let data = "";
            try {
                for (var _c = __asyncValues(win32_os.stdout), _d; _d = yield _c.next(), !_d.done;) {
                    const chunk = _d.value;
                    console.log("stdout chunk: " + chunk);
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
                for (var _e = __asyncValues(win32_os.stderr), _f; _f = yield _e.next(), !_f.done;) {
                    const chunk = _f.value;
                    console.error("stderr chunk: " + chunk);
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
                win32_os.on("close", resolve);
            });
            if (exitCode) {
                return exitCode;
            }
            return data;
        });
    }
};
exports.default = scanner;
