node_redis_cache
================

A simple lru/static cache that uses a redis instance

PLEASE NOTE - dont use this in production, this is more an experiment than anything else at the moment, I am deferring packaging and putting
it on npm until I have worked on it a bit more.

I was inspired by the following article:
http://oldblog.antirez.com/post/redis-as-LRU-cache.html

Instructions:

Install redis, must be >= v2.6.14
Run your redis server, with a memory limit set and the volatile_ttl memory policy:

root$ redis-server --maxmemory 5mb --maxmemory-policy volatile-ttl

download this project to a folder

run 'npm install' in your project folder root to get all the required modules (redis, async)

and then run 'node node_redis_cache_test 100000' this will run the rather incomplete and ugly test script I created for the cache
it tests adding and fetching a small collection, and then pushes 100000 test objects into the volatile cache, and then
randomly attempts fetching the items - finally lists cache hits/misses etc. The misses go up as you add more items to the
test, this is because I assume our redis db is only allowed 5mb of memory space, so items are pushed out based on their
ttl. Volatile gets reset the objects ttl in the cache - ensuring items that are fetched more often will not be kicked out first.

The node_redis_cache.js module is what is doing the work, with the help of node_redis and async
https://github.com/mranney/node_redis
https://github.com/caolan/async

The module is instantiated like so: 
var cache = require('./redis_lru_cache');

And has the following methods:

cache.initialize({dbKey:'redis_lru_test'}, function(e){
  //this is the initialization code, look in the function to see what other optional params you can use
  //the dbKey parameter is essential as it uniquely identifies your application in redis
  //the idea is you may have multiple apps caching to the same redis instance
})

putAllStatic:function(objectKeyPropertyName, items, done)
//puts a bunch of objects in the cache - that will always live in the cache (no ttl)
//objectKeyPropertyName - the name of the property in your list object objects that should be used to key each item
//items - the list of items
//done - the callback (e, resp)

putAllVolatile:functionobjectKeyPropertyName, items, ttl, done)
//puts a bunch of objects in the cache - that all have an expiry set in milliseconds
//objectKeyPropertyName - the name of the property in your list object objects that should be used to key each item
//items - the list of items
//ttl - amount of time in milliseconds the items can live in the cache until they are expired
//done - the callback (e, resp)

putCollectionStatic:function(collectionKey, objectKeyPropertyName, collectionItems, done)
//puts a bunch of objects in the cache, under an umbrella set (static so no ttl)
collectionKey - the key of the collection you wish to add the items to
//objectKeyPropertyName - the name of the property in your list object objects that should be used to key each item
//items - the list of items
//done - the callback (e, resp)

putCollectionVolatile:function(collectionKey, objectKeyPropertyName, collectionItems, ttl, done)
//puts a bunch of objects in the cache, under an umbrella set with a ttl
collectionKey - the key of the collection you wish to add the items to
//objectKeyPropertyName - the name of the property in your list object objects that should be used to key each item
//items - the list of items
//ttl - amount of time in milliseconds the items can live in the cache until they are expired
//done - the callback (e, resp)

putVolatile:function(collectionKey, key, item, ttl, done)
//puts a single item into the cache, if the collectionKey is null - it is not grouped

putStatic:function(collectionKey, key, item, done)
//puts a single item into the cache with no expiry

getVolatile:function(key, ttl, done)
//gets a single object - updates its ttl on fetching it, by yr ttl amount
//done - the callback (e, item)

getStatic:function(key, done)
//gets a single static object with the specified key
//done - the callback (e, item)

getCollectionVolatile:function(collectionKey, ttl,  done)
//gets all objects that exist under the collectionKey
//done - yr callback (e, items)

getCollectionStatic:function(collectionKey, done)
//gets all static objects taht exist under teh collection key
//done - yr callback (e, items)



