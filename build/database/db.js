"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importStar(require("aws-sdk"));
const db = new aws_sdk_1.DynamoDB.DocumentClient({ region: "us-east-1" });
aws_sdk_1.default.config.update({
    region: "us-east-1",
});
const addToDatabase = (data) => {
    const params = {
        TableName: "assets",
        Item: {
            asset: data.hwInfo.Name,
            mac: data.hostInfo.mac,
            info: Object.assign({}, data),
        },
    };
    db.put(params, (err, data) => {
        if (err) {
            console.error("Unable to add movie", params.Item.asset, ". Error JSON:", JSON.stringify(err, null, 2));
        }
        else {
            console.log("PutItem succeeded:", `${data}`);
        }
    });
};
exports.default = addToDatabase;
