import AWS, { DynamoDB } from "aws-sdk";

const db = new DynamoDB.DocumentClient({ region: "us-east-1" });

AWS.config.update({
  region: "us-east-1",
});

interface data {
  hwInfo: any;
  hostInfo: any;
  cwid: any;
}

const addToDatabase = async (data: data) => {
  const params = {
    TableName: "assets",
    Item: {
      asset: data.hwInfo.Name,
      mac: data.hostInfo.mac,
      info: { ...data },
    },
  };

  await db.put(params, (err, data) => {
    if (err) {
      console.error(
        "Unable to add movie",
        params.Item.asset,
        ". Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("PutItem succeeded:", `${data}`);
      return "goo";
    }
  });
};

export default addToDatabase;
