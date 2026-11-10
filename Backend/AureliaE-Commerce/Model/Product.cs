using AureliaE_Commerce.Model.AttributeProduct;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace AureliaE_Commerce.Model
{
    public class Product
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        [JsonPropertyName("id")]
        public string id { get; set; }
        public string name { get; set; }
        public string type { get; set; }
        public string subcategory { get; set; }
        public string brand { get; set; }
        public string origin { get; set; }
        public double price { get; set; }
        public string description { get; set; }
        public float rating { get; set; }
        public int stock { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }
        public string thumbnail { get; set; }
        public List<string> images { get; set; }
        public string material { get; set; }
        public List<variant>? variants { get; set; }
        public int sold { get; set; }
        public decimal? discountValue { get; set; } = null;
        public string? discountType { get; set; }
        public string? season { get; set; }
    }
}
