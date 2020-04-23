using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace WatchPortalFunction
{
    public static class WatchInfo
    {
        [FunctionName("WatchInfo")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            [CosmosDB(
                databaseName: "func-io-learn-db",
                collectionName: "Bookmarks",
                ConnectionStringSetting = "CosmosDBConnection",
                Id = "{Query.model}",
                PartitionKey = "{Query.model}")] Watchproperties watchdocument,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            // Retrieve the model id from the query string
            string model = req.Query["model"];

            // If the user specified a model id, find the details of the model of watch
            if (model != null)
            {
                log.LogInformation("model OK. model is: {model}", model);

                return new OkObjectResult(watchdocument);
            }
            return new BadRequestObjectResult(new { message = "Please provide a watch model in the query string" });
        }
    }
}
