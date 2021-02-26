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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const computerRoutes_1 = __importDefault(require("./routes/computerRoutes"));
const scanner_1 = __importDefault(require("./services/scanner"));
const cors = require("cors");
const app = express_1.default();
const PORT = 4000;
app.use(cors());
// CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//
app.set("trust proxy", true);
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
//root endpoint
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const host = Object.keys(req.query).length === 0
        ? req.ip.replace("::ffff:", "")
        : req.query.host;
    const Scanner = new scanner_1.default(host);
    const rcpStatus = yield Scanner.checkRcp();
    const hostname = yield Scanner.resolveHostname();
    const ip = yield Scanner.resolveIpAddress();
    const result = {
        ip: ip,
        hostname: hostname.replace(/\r?\n?/g, ""),
        rcpStatus: rcpStatus,
    };
    res.send(result);
}));
app.use(computerRoutes_1.default);
