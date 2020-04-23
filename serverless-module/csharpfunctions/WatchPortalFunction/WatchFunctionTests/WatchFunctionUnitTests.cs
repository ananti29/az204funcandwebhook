using System;
using Xunit;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Microsoft.Extensions.Logging.Abstractions;

namespace WatchFunctionTests
{
    public class WatchFunctionUnitTests
    {
        [Fact]
        public void TestWatchFunctionSuccess()
        {
            var httpContext = new DefaultHttpContext();
            var queryStringValue = "abc";
            var request = new DefaultHttpRequest(new DefaultHttpContext())
            {
                Query = new QueryCollection
                (
                    new System.Collections.Generic.Dictionary<string, StringValues>()
                    {
                        {
                            "model", queryStringValue
                        }
                    }
                )
            };

            var logger = NullLoggerFactory.Instance.CreateLogger("Null Logger");

            WatchPortalFunction.Watchproperties watchinfo = new WatchPortalFunction.Watchproperties
            {
                Manufacturer = "Abc",
                Casetype = "Solid",
                Bezel = "Titanium",
                Dial = "Roman",
                Casefinish = "Silver",
                Jewels = 15,
                Type = "watch"
            };

            var response = WatchPortalFunction.WatchInfo.Run(request, watchinfo, logger);
            response.Wait();

            // Check that the response is an "OK" response
            Assert.IsAssignableFrom<OkObjectResult>(response.Result);

            // Check that the contents of the response are the expected contents
            var result = (OkObjectResult)response.Result;
            
            Assert.Equal(watchinfo, result.Value);
        }

        [Fact]
        public void TestWatchFunctionFailureNoQueryString()
        {
            var httpContext = new DefaultHttpContext();
            var request = new DefaultHttpRequest(new DefaultHttpContext());
            var logger = NullLoggerFactory.Instance.CreateLogger("Null Logger");

            WatchPortalFunction.Watchproperties watchinfo = new WatchPortalFunction.Watchproperties
            {
               /* 
                Manufacturer = "Abc",
                Casetype = "Solid",
                Bezel = "Titanium",
                Dial = "Roman",
                Casefinish = "Silver",
                Jewels = 15,
                Type = "watch" 
                */
            };

            var response = WatchPortalFunction.WatchInfo.Run(request, watchinfo, logger);
            response.Wait();

            // Check that the response is an "Bad" response
            Assert.IsAssignableFrom<BadRequestObjectResult>(response.Result);

            // Check that the contents of the response are the expected contents
            var result = (BadRequestObjectResult)response.Result;
            Assert.Equal(new { message = "Please provide a watch model in the query string" }.ToString(), result.Value.ToString());
        }

        [Fact]
        public void TestWatchFunctionFailureNoModel()
        {
            var httpContext = new DefaultHttpContext();
            var queryStringValue = "";
            var request = new DefaultHttpRequest(new DefaultHttpContext())
            {
                Query = new QueryCollection
                (
                    new System.Collections.Generic.Dictionary<string, StringValues>()
                    {
                        { "no-model", queryStringValue }
                    }
                )
            };

            var logger = NullLoggerFactory.Instance.CreateLogger("Null Logger");

            WatchPortalFunction.Watchproperties watchinfo = new WatchPortalFunction.Watchproperties
            {
                /*
                Manufacturer = "Abc",
                Casetype = "Solid",
                Bezel = "Titanium",
                Dial = "Roman",
                Casefinish = "Silver",
                Jewels = 15,
                Type = "watch"
                */
            };

            var response = WatchPortalFunction.WatchInfo.Run(request, watchinfo, logger);
            response.Wait();

            // Check that the response is an "Bad" response
            Assert.IsAssignableFrom<BadRequestObjectResult>(response.Result);

            // Check that the contents of the response are the expected contents
            var result = (BadRequestObjectResult)response.Result;
            Assert.Equal(new { message = "Please provide a watch model in the query string" }.ToString(), result.Value.ToString());
        }
    }
}
