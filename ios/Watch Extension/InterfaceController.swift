//
//  InterfaceController.swift
//  Watch Extension
//
//  Created by Jordan Byron on 1/2/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

import WatchKit
import Foundation
import WatchConnectivity

class InterfaceController: WKInterfaceController, WCSessionDelegate {
  
  private let session : WCSession? = WCSession.isSupported() ? WCSession.defaultSession() : nil
  
  @IBOutlet var garageDoorStatusLabel: WKInterfaceLabel!
  @IBOutlet var garageDoorButton: WKInterfaceButton!
  @IBOutlet var alarmStatusLabel: WKInterfaceLabel!
  @IBOutlet var lastUpdatedLabel: WKInterfaceLabel!
  
  @IBAction func garageDoorButtonPressed() {
    sendMessage(["garageDoor": "toggle"])
  }
  
  @IBAction func alarmStayMenuPressed() {
    sendMessage(["alarm": "stay"])
  }
  
  @IBAction func alarmAwayMenuPressed() {
    sendMessage(["alarm": "away"])
  }
  
  @IBAction func alarmOffMenuPressed() {
    sendMessage(["alarm": "off"])
  }
  
  @IBAction func refreshMenuPressed() {
    alarmStatus      = "Connecting ..."
    garageDoorStatus = "Connecting ..."
    lastUpdatedText  = "..."
    
    requestUpdate()
  }
  
  var garageDoorStatus: String? {
    didSet {
      if let status = garageDoorStatus   {
        garageDoorStatusLabel.setText(status)
        if(status == "Open") {
          garageDoorButton.setTitle("Close Garage")
        } else if(status == "Closed") {
          garageDoorButton.setTitle("Open Garage")
        } else {
          garageDoorButton.setTitle("Toggle Garage")
        }
      }
    }
  }
  
  var alarmStatus: String? {
    didSet {
      if let status = alarmStatus   {
        alarmStatusLabel.setText(status)
        
        if(status == "Ready") {
          alarmStatusLabel.setTextColor(UIColor.greenColor())
        } else if(status.containsString("Armed")) {
          alarmStatusLabel.setTextColor(UIColor.redColor())
        } else {
          alarmStatusLabel.setTextColor(UIColor.whiteColor())
        }
      }
    }
  }
  
  var lastUpdated: NSDate? {
    didSet {
      if let lastUpdated = lastUpdated   {
        let formatter = NSDateFormatter()
        formatter.timeStyle = .ShortStyle
        formatter.dateStyle = .NoStyle
        lastUpdatedLabel.setText(formatter.stringFromDate(lastUpdated))
      }
    }
  }
  
  var lastUpdatedText: String? {
    didSet {
      if let lastUpdatedText = lastUpdatedText   {
        lastUpdatedLabel.setText(lastUpdatedText)
      }
    }
  }
  
  override init() {
    super.init()
    
    session?.delegate = self
    session?.activateSession()
  }
  
  func session(session: WCSession, didReceiveMessage message: [String : AnyObject], replyHandler: ([String : AnyObject]) -> Void) {
    let message = message as NSDictionary
    
    let garageDoor   = message.valueForKey("garageDoor") as? String
    //let alarm        = message.valueForKey("alarm") as? String
    let alarmDisplay = message.valueForKey("alarmDisplay") as? String
    
    if (garageDoor != nil)   { self.garageDoorStatus = String(garageDoor!).capitalizedString }
    if (alarmDisplay != nil) { self.alarmStatus      = alarmDisplay }
    
    lastUpdated = NSDate()
  }
  
  func requestUpdate() {
    sendMessage(["update": "request"])
  }
  
  func showErrorAlert(error: String){
    
    let h0 = { print("ok")}
    
    let action1 = WKAlertAction(title: "OK", style: .Default, handler:h0)
    
    presentAlertControllerWithTitle("Error", message: error, preferredStyle: .ActionSheet, actions: [action1])
  }
  
  func sendMessage(messageData: [String : AnyObject]) {
    print(session)
      if let session = session where session.reachable {
        session.sendMessage(messageData,
          replyHandler: { replyData in
          }, errorHandler: { error in
            print(error)
        })
      }
  }
  
  override func awakeWithContext(context: AnyObject?) {
    super.awakeWithContext(context)
  }

  override func willActivate() {
    // This method is called when watch view controller is about to be visible to user
    super.willActivate()
    
    requestUpdate()
  }

  override func didDeactivate() {
    // This method is called when watch view controller is no longer visible
    super.didDeactivate()
  }

}
