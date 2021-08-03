using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DocumentModel;
using Amazon.DynamoDBv2.Model;
using Microsoft.Extensions.Logging;

namespace MonolithService
{
    public interface IMysfitsTableClient
    {
        string TableName { get; }
        AmazonDynamoDBClient Client { get; }

        public async Task<List<Mysfit>> GetAllMyfits()
        {
            ScanResponse response = await Client.ScanAsync(new ScanRequest
            {
                TableName = TableName
            });

            return response.Items.Select((item) => new Mysfit
            {
                MysfitId = item["MysfitId"].S,
                Name = item["Name"].S,
                Species = item["Species"].S,
                Description = item["Description"].S,
                Age = Int32.Parse(item["Age"].N),
                GoodEvil = item["GoodEvil"].S,
                LawChaos = item["LawChaos"].S,
                ThumbImageUri = item["ThumbImageUri"].S,
                ProfileImageUri = item["ProfileImageUri"].S,
                Likes = Int32.Parse(item["Likes"].N),
                Adopted = item["Adopted"].BOOL
            }).ToList();
        }

        public async Task<List<Mysfit>> QueryMysfits(Dictionary<string, string> queryParams)
        {
            QueryRequest request = new QueryRequest
            {
                TableName = TableName,
                KeyConditionExpression = $"{queryParams["filter"]} = :value",
                ExpressionAttributeValues = new Dictionary<string, AttributeValue>
                {
                    { ":value", new AttributeValue { S = queryParams["value"] } }
                },
                IndexName = $"{queryParams["filter"]}Index"
            };
            QueryResponse response = await Client.QueryAsync(request);
            return response.Items.Select((item) => new Mysfit
            {
                MysfitId = item["MysfitId"].S,
                Name = item["Name"].S,
                Species = item["Species"].S,
                Description = item["Description"].S,
                Age = Int32.Parse(item["Age"].N),
                GoodEvil = item["GoodEvil"].S,
                LawChaos = item["LawChaos"].S,
                ThumbImageUri = item["ThumbImageUri"].S,
                ProfileImageUri = item["ProfileImageUri"].S,
                Likes = Int32.Parse(item["Likes"].N),
                Adopted = item["Adopted"].BOOL
            }).ToList();
        }
        
        public async Task<Mysfit> GetMysfit(string mysfitId)
        {
            Primitive hash = new Primitive(mysfitId);

            try
            {
                var key = new Dictionary<string, AttributeValue>
                {
                    { "MysfitId", new AttributeValue { S = mysfitId } }
                };
                GetItemResponse response = await Client.GetItemAsync(TableName, key);
                if (!response.Item.ContainsKey("MysfitId"))
                {
                    return null;
                }
                return new Mysfit
                {
                    MysfitId = response.Item["MysfitId"].S,
                    Name = response.Item["Name"].S,
                    Species = response.Item["Species"].S,
                    Description = response.Item["Description"].S,
                    Age = Int32.Parse(response.Item["Age"].N),
                    GoodEvil = response.Item["GoodEvil"].S,
                    LawChaos = response.Item["LawChaos"].S,
                    ThumbImageUri = response.Item["ThumbImageUri"].S,
                    ProfileImageUri = response.Item["ProfileImageUri"].S,
                    Likes = Int32.Parse(response.Item["Likes"].N),
                    Adopted = response.Item["Adopted"].BOOL
                };
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public async void LikeMysfit(string mysfitId)
        {
            var request = new UpdateItemRequest
            {
                TableName = TableName,
                Key = new Dictionary<string, AttributeValue>
                {
                    { "MysfitId", new AttributeValue { S = mysfitId } }
                },
                UpdateExpression = "SET Likes = Likes + :n",
                ExpressionAttributeValues = new Dictionary<string, AttributeValue>
                {
                    { ":n", new AttributeValue { N = "1" } }
                }
            };
            UpdateItemResponse _response = await Client.UpdateItemAsync(request);
        }
        
        public async void AdoptMysfit(string mysfitId)
        {
            var request = new UpdateItemRequest
            {
                TableName = TableName,
                Key = new Dictionary<string, AttributeValue>
                {
                    { "MysfitId", new AttributeValue { S = mysfitId } }
                },
                UpdateExpression = "SET Adopted = :b",
                ExpressionAttributeValues = new Dictionary<string, AttributeValue>
                {
                    { ":b", new AttributeValue { BOOL = true } }
                }
            };
            UpdateItemResponse _response = await Client.UpdateItemAsync(request);
        }
    }

    public class MysfitsLocalTableClient : IMysfitsTableClient
    {
        private AmazonDynamoDBClient _client;
        private string _tableName;

        public string TableName => _tableName;

        public AmazonDynamoDBClient Client => _client;
        
        public MysfitsLocalTableClient()
        {
            AmazonDynamoDBConfig config = new AmazonDynamoDBConfig
            {
                ServiceURL = "http://127.0.0.1:8000"
            };
            _client = new AmazonDynamoDBClient(config);
            _tableName = Environment.GetEnvironmentVariable("DDB_TABLE_NAME");
        }
    }
    
    public class MysfitsTableClient : IMysfitsTableClient
    {
        private AmazonDynamoDBClient _client;
        private string _tableName;

        public string TableName => _tableName;

        public AmazonDynamoDBClient Client => _client;
        
        public MysfitsTableClient()
        {
            _client = new AmazonDynamoDBClient();
            _tableName = Environment.GetEnvironmentVariable("DDB_TABLE_NAME");
        }
    }
}