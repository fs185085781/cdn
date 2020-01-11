(function(){
	/*拓展uni的功能 剪切板*/
	//#ifdef H5
	uni.setClipboardData = function(options){
		var text = options.data || "";
		navigator.clipboard.writeText(text)
		  .then(() => {
		    if(options.success){
		    	options.success();
		    }
		  })
		  .catch(err => {
		    if(options.fail){
		    	options.fail();
		    }
		  });
		  if(options.complete){
		  	options.complete();
		  }
	}
	uni.getClipboardData = function(options){
		navigator.clipboard.readText()
		  .then(text => {
		    if(options.success){
		    	options.success({data:text});
		    }
		  })
		  .catch(err => {
		    if(options.fail){
		    	options.fail();
		    }
		  });
		  if(options.complete){
		  	options.complete();
		  }
	}
	//#endif
})()