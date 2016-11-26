#import "ApiUiOpen.h"
#import "CMPHybridTools.h"
#import "JSO.h"

@implementation ApiUiOpen

- (HybridHandler) getHandler{
    return ^(id data, HybridCallback responseCallback) {
        HybridUi caller=self.currentUi;
        
        JSO *name=[data getChild:@"name"];
        NSString *name_s= [name toString];
        if([CMPHybridTools isEmptyString:name_s]){
            name_s=@"UiRoot";//TMP !!! need UiError...
            //NSLog(@" strange, no name at uiopen??");
            //return;
        }
        
        dispatch_async(dispatch_get_main_queue(), ^{
            HybridUi ui=[CMPHybridTools startUi:name_s initData:data objCaller:caller];
            if(ui!=nil){
                //                [ui on:@"initdone" :^(NSString *eventName, id extraData){
                //                    //responseCallback(extraData);
                //                    NSLog(@" init done!!!");
                //                }];
                [ui on:@"close" :^(NSString *eventName, id extraData){
                    dispatch_async(dispatch_get_main_queue(), ^{
                        [caller resetTopBarStatus];
                        responseCallback([JSO id2o:@{@"STS":@"OK",@"name":name_s}]);
                    });
                }];
            }
        });
    };
}

@end
