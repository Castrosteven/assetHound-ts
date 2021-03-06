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
const scanner_1 = __importDefault(require("../services/scanner"));
const db_1 = __importDefault(require("../database/db"));
const cors = require("cors");
const router = express_1.default.Router();
router.use(cors());
// CORS
router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
router.get("/computer", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ip = Object.keys(req.query).length === 0
        ? req.ip.replace("::ffff:", "")
        : req.query.host;
    const Scanner = new scanner_1.default(ip);
    const hostInfo = yield Scanner.hostInfo();
    const osInfo = yield Scanner.getOs();
    const hwInfo = yield Scanner.getHw();
    const biosInfo = yield Scanner.getBios();
    const networkInfo = yield Scanner.getNetworkAdpaterInfo();
    const response = {
        hostInfo: hostInfo,
        osInfo: osInfo,
        hwInfo: hwInfo,
        biosInfo: biosInfo,
        networkInfo: networkInfo,
    };
    res.send(response);
}));
router.get("/computer/os", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ip = Object.keys(req.query).length === 0
        ? req.ip.replace("::ffff:", "")
        : req.query.host;
    const Scanner = new scanner_1.default(ip);
    const osInfo = yield Scanner.getOs();
    res.send(osInfo);
}));
router.get("/computer/host", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ip = Object.keys(req.query).length === 0
        ? req.ip.replace("::ffff:", "")
        : req.query.host;
    const Scanner = new scanner_1.default(ip);
    const hostInfo = yield Scanner.hostInfo();
    res.send(hostInfo);
}));
router.get("/computer/hw", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ip = Object.keys(req.query).length === 0
        ? req.ip.replace("::ffff:", "")
        : req.query.host;
    const Scanner = new scanner_1.default(ip);
    const hwInfo = yield Scanner.getHw();
    res.send(hwInfo);
}));
router.get("/computer/bios", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ip = Object.keys(req.query).length === 0
        ? req.ip.replace("::ffff:", "")
        : req.query.host;
    const Scanner = new scanner_1.default(ip);
    const biosInfo = yield Scanner.getBios();
    res.send(biosInfo);
}));
router.get("/computer/net", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ip = Object.keys(req.query).length === 0
        ? req.ip.replace("::ffff:", "")
        : req.query.host;
    const Scanner = new scanner_1.default(ip);
    const networkInfo = yield Scanner.getNetworkAdpaterInfo();
    res.send(networkInfo);
}));
router.post("/computer/register", cors(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ip = Object.keys(req.query).length === 0
        ? req.ip.replace("::ffff:", "")
        : req.query.host;
    const Scanner = new scanner_1.default(ip);
    const computerInfo = yield Scanner.allInfo();
    const data = Object.assign(Object.assign({}, computerInfo), { cwid: req.body.cwid });
    const response = db_1.default(data);
    res.send(response);
}));
exports.default = router;
