#import "CMPNativeUi.h"
#import "CMPHybridTools.h"

@implementation CMPNativeUi

//---------------- UIViewController: ----------

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    [self trigger:CMPHybridEventMemoryWarning];
    
    // Dispose of any resources that can be recreated.
    [CMPHybridTools quickAlertMsgForOldiOS:@"Memory Warning" callback:^{
        
        //TODO...
    }];
}

//-(void) viewWillAppear:(BOOL)animated
//{
//    [super viewWillAppear:animated];
//
//    [self trigger:CMPHybridEventBeforeDisplay];
//}

//-(void) viewDidLoad
//{
//    [super viewDidLoad];
//    //[self initUi];//super did...
//}

- (BOOL)prefersStatusBarHidden {
    NSLog(@"CMPHybridUi_UIViewController prefersStatusBarHidden returns NO");
    return NO;
}

-(UIStatusBarStyle)preferredStatusBarStyle{
    //return UIStatusBarStyleLightContent;
    NSLog(@"CMPHybridUi_UIViewController preferredStatusBarStyle returns UIStatusBarStyleDefault");
    return UIStatusBarStyleDefault;
}

//------------   <HybridUi> ------------


- (void) resetTopBarBtn
{
    NSLog(@"resetTopBarBtn in NativeUi....");
    
    UIBarButtonItem *leftBar
    = [[UIBarButtonItem alloc]
       initWithImage:[UIImage imageNamed:@"btn_nav bar_left arrow"]//see Images.xcassets
       style:UIBarButtonItemStylePlain
       target:self
       action:@selector(closeUi) //on('click')=>close()
       ];
    leftBar.tintColor = [UIColor blueColor];
    
    self.navigationItem.leftBarButtonItem=leftBar;
    
    //    self.navigationItem.leftBarButtonItem
    //    = [[UIBarButtonItem alloc]
    //       initWithBarButtonSystemItem:UIBarButtonSystemItemReply
    //       target:self
    //       action:@selector(closeUi)];
    //
    //    UIBarButtonItem *rightBtn
    //    = [[UIBarButtonItem alloc]
    //       initWithBarButtonSystemItem:UIBarButtonSystemItemStop target:self action:nil];
    //    self.navigationItem.rightBarButtonItem = rightBtn;
    //[super resetTopBarBtn];
}

//- (void) evalJs :(NSString *)js_s
//{
//    NSLog(@"NativeUi: TODO evalJs()");
//}

//call by viewDidLoad(), child can override!
- (void)initUi
{
    [super initUi];

    self.view.backgroundColor=[UIColor blackColor];
    
    //self.navigationController.navigationBar.translucent=NO;
    self.navigationController.navigationBar.backgroundColor=[UIColor blackColor];
    self.navigationController.navigationBar.tintColor = [UIColor brownColor];
}

@end
