//
//  TodayViewController.m
//  TodayExtension
//
//  Created by Jordan Byron on 10/28/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "TodayViewController.h"
#import <NotificationCenter/NotificationCenter.h>
#import <RCTRootView.h>
#import <RCTBundleURLProvider.h>

@interface TodayViewController () <NCWidgetProviding>

@end

@implementation TodayViewController

- (void)loadView {
  NSURL *jsCodeLocation;
  
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  //jsCodeLocation = [NSURL URLWithString:@"http://192.168.88.254:8081/index.ios.bundle?platform=ios"];
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"TodayWidget"
                                               initialProperties:nil
                                                   launchOptions:nil];

  rootView.backgroundColor = [UIColor colorWithWhite:0.0 alpha:0.0];
  rootView.opaque = NO;
  
  self.view = rootView;
}

- (void)viewDidLoad {
    [super viewDidLoad];
  
    // This is required in order for there to be space for
    // the React Native stuff to show up
    [self setPreferredContentSize:CGSizeMake(0, 200)];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)widgetPerformUpdateWithCompletionHandler:(void (^)(NCUpdateResult))completionHandler {
    // Perform any setup necessary in order to update the view.
    
    // If an error is encountered, use NCUpdateResultFailed
    // If there's no update required, use NCUpdateResultNoData
    // If there's an update, use NCUpdateResultNewData

    completionHandler(NCUpdateResultNewData);
}

@end
