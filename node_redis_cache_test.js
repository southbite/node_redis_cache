var global_cache = require('./node_redis_cache');
var async = require('async');

//max lru mem, db key, done
global_cache.initialize({dbKey:'redis_lru_test'}, function(e){
	
	var randomTestCount = process.argv[2];
	
	if (randomTestCount != null)
	{
		if (isNaN(randomTestCount))
		{
			console.log('random test count argument invalid, defaulting to 10');
			randomTestCount = 10;
		}
		
	}
	
	if (randomTestCount == null)
	{
		console.log('random test count argument not set, defaulting to 10');
		randomTestCount = 10;
	}
	
	//console.log(randomTestCount);
	//process.exit(0);
	
	if (!e)
	{
		var testStaticObjectsType1 = [{_id:0, name:'test 0', type:'1'}, {_id:1, name:'test 1', type:'1'}, {_id:2, name:'test 2', type:'1'}, {_id:3, name:'test 3', type:'1'}];
		//putCollectionStatic:function(collectionKey, objectKeyPropertyName, collectionItems,
		global_cache.putCollectionStatic('testStaticObjectsType1', '_id', testStaticObjectsType1, function(e, resp){
			
			console.log('putAllStatic 1 RAN');
			console.log(e);
			
			if (!e)
			{
				console.log('putAllStatic 1 PASS');
				
				global_cache.getCollectionStatic('testStaticObjectsType1', function(e, resp){
					
					console.log('testStaticObjectsType1 resp');
					console.log(resp);
					
					if (!e && resp.length == testStaticObjectsType1.length)
					{
						console.log('getStaticAll 1 PASS');
						
						console.log('getting single 0');
						
						global_cache.getStatic(0, function(e, resp){
							
							if (!e)
							{
								console.log('getting single passed');
								
								
								var testLRUObjects = [];
								var LRUCacheMisses = 0;
								var LRUCacheHits = 0;
								var LRUPushErrors = [];
								var LRUGetErrors = [];
								
								
								var randomPushesCount = 0;
								var randomGetsCount = 0;
								
								
								
								async.until(function(){
									
									return (randomPushesCount == randomTestCount);
								}, 
								function(callback){
									
										var objLRU = {_id:randomPushesCount, name:'test ' + randomPushesCount.toString(), type:'LRU'};
										testLRUObjects.push(objLRU);
										var errorOccured = null;
										
										//putVolatile:function(key, item, ttl, done)
										global_cache.putVolatile(null, randomPushesCount, objLRU, 1000 * 60 * 60, function(e, resp){
											
											
											if (e)
												LRUPushErrors.push(e);
											else
												console.log('lru item pushed: id ' + randomPushesCount);
											
											randomPushesCount++;
											callback(null);
											
										}.bind(this));
										
								}, 
								function(e){
							
									for (var i = 0;i < randomTestCount; i++)
									{
										var randomID = Math.floor((Math.random()*10)+i);
										
										console.log('getting ' + randomID);
										
										global_cache.getVolatile(randomID, 1000 * 60 * 60, function(e, resp){
											
											if (!e)
											{
												if (resp != null)
												{
													LRUCacheHits++;
												}
												else
													LRUCacheMisses++;
											}
											else
												LRUGetErrors.push(e);
											
											randomGetsCount++;
											
										});
									}
									
								});
									

								
								async.until(function(){
									
											console.log(randomGetsCount);
											console.log(randomPushesCount);
											console.log(randomTestCount);
									
											return ((randomGetsCount == randomTestCount) && (randomPushesCount == randomTestCount));
										}, 
										function(callback){
											console.log('running random lru...');
											
											console.log('test complete');
											console.log('LRU hits: ' + LRUCacheHits.toString());
											console.log('LRU misses: ' + LRUCacheMisses.toString());
											
											console.log('LRU push errors: ' + LRUPushErrors.length.toString());
											
											if (LRUPushErrors.length > 0)
												console.log('latest LRU push error' + LRUPushErrors[LRUPushErrors.length - 1].toString());
											
											console.log('LRU get errors: ' + LRUGetErrors.length.toString());
											
											setTimeout(callback, 1000);
										}, 
										function(e){
									
											console.log('test complete');
											console.log('LRU hits: ' + LRUCacheHits.toString());
											console.log('LRU misses: ' + LRUCacheMisses.toString());
											console.log('LRU push errors: ' + LRUPushErrors.length.toString());
											console.log('LRU get errors: ' + LRUGetErrors.length.toString());
											
											process.exit(0);
										});
								
							}
								
						});
						
					}
					else
						console.log('getStaticAll 1 FAIL: ' + e);
					
				});
					
			}
			else
				console.log('putAllStatic 1: FAIL: ' + e.toString());
			
		});
				
	}
	else
		console.log('Test Failed: Initializing');
	
	
});
		
	


