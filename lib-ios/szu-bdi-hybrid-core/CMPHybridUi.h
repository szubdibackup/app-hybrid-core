#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#ifndef Hybrid_h
#define Hybrid_h

typedef void (^HybridCallback)(id responseData);

typedef void (^HybridHandler)(id data, HybridCallback responseCallback);

typedef void (^HybridAlertCallback)(UIAlertAction *action);

#endif /* Hybrid_h */

#ifndef CMPHybridUi_h
#define CMPHybridUi_h

@protocol HybridUiProtocol

@optional

- (void)setTopBar:(BOOL)haveTopBar;

- (void)setTopBarTitle:(NSString *)title;

#warning move to pageUiData...
- (void)setWebViewUiUrl:(NSString *)url;

//callback for close..
- (void)setCallback:(HybridCallback)callback;

- (void)activityClose;

@end

@interface CMPHybridUi : UIViewController<HybridUiProtocol>


@end
#endif /* CMPHybridUi_h */