@all
Feature: Ordering a Single day item

Scenario: Verify Ordering a single day item with Order Remaining Items True
When You are in BOSS home page 
Then Click Place Order from Landing Page to navigate to Order Selection page.
And Check only Daily checkbox for selecting single day item
And Select All Daily Items
And Click on Continue Button
And Get the required Item details from the Service for 'Daily'
And Verify Cursor if defaulted to order quantity text box
And Verify Tooltip for the Item
And If remaining Orders are more than Zero, Enter Zero in Order text box then click on Enter Key
And ReOrder the Item with Zero in Order text box then click on Enter Key
And Click on Review and Finalise Button
And Verify that we will get modal popup with Order InComplete order quantity
And Click On NO button on modal pop up 
And Enter number Max number in order textbox and click on Enter Key
And Verify that we will get modal popup with Maximum order quantity
And Click on Close Button
And Enter Order Quantity ONE in the Order text box and click Enter Key
And Click on Review and Finalise Button
And click On YES button on modal pop up
And Verify the Daily Trend for last '10' days
And Click on Submit Button 
And Verify that Order Landing page got opened and Remaining to Order was decreased by one

Scenario: Verify Ordering a single day item with Order Remaining Items False
When You are in BOSS home page 
Then Click Place Order from Landing Page to navigate to Order Selection page.
And Check only Daily checkbox for selecting single day item
And Disable the Order remaining items only radio button
And Select All Daily Items
And Click on Continue Button
And Order Submit Date
And Verify Order Delivered Date
And Enter Order Quantity ONE in the Order text box and click Enter Key
And Verify the Daily Trend for last '8' days
And Verify the Weekly Trend for last '4' weeks
And Click on Review and Finalise Button
And click On YES button on modal pop up
And Verify the Daily Trend for last '10' days
And Click on Submit Button 
And Verify that Order Landing page got opened and Remaining to Order was decreased by one

Scenario: Verify Ordering a single day item with Order Remaining Items True and with All Items Radio button ON
When You are in BOSS home page 
Then Click Place Order from Landing Page to navigate to Order Selection page.
And Check only Daily checkbox for selecting single day item
And Disable the Order remaining items only radio button
And Click on All Radio button
And Select All Daily Items
And Click on Continue Button
And Clear the existing order quantity and make sure that we have defaulted to Zero
And Verify the Daily Trend for last '8' days
And Verify the Weekly Trend for last '4' weeks
And Close the Chevron
And Click on Review and Finalise Button
And click On YES button on modal pop up
And Verify the Daily Trend for last '10' days
And Modify the Order quantity for one item in review and finalise page
And Click on Submit Button 
And Verify that Order Landing page got opened and Remaining to Order was decreased by one


Scenario: Verify Warning message when you click on Home button in the middle of transaction
When You are in BOSS home page 
Then Click Place Order from Landing Page to navigate to Order Selection page.
And Check only Daily checkbox for selecting single day item
And Disable the Order remaining items only radio button
And Select All Daily Items
And Click on Continue Button
And Click in Home Button and verify the popup
And Click Place Order from Landing Page to navigate to Order Selection page.
And Disable the Order remaining items only radio button
And Check only Daily checkbox for selecting single day item
And Select All Daily Items
And Click on Continue Button
And Enter Order Quantity ONE in the Order text box and click Enter Key
And Click on Review and Finalise Button
And click On YES button on modal pop up
And Enter Order quantity for first item in review and finalize page for 'Daily'
And Click On Home Button and verify that we are in ordering page


Scenario: Verify Ordering a single day item with clicking Previous Button in the middle of order
When You are in BOSS home page 
Then Click Place Order from Landing Page to navigate to Order Selection page.
And Disable the Order remaining items only radio button
And Check only Daily checkbox for selecting single day item
And Select All Daily Items
And Click on Continue Button
And Enter Order Quantity ONE in the Order text box and click Enter Key
And Click On Previous Button and Verify pop up message
And Disable the Order remaining items only radio button
And Check only Daily checkbox for selecting single day item
And Select All Daily Items
And Click on Continue Button
And Enter Order Quantity ONE in the Order text box and click Enter Key
And Click on Review and Finalise Button
And click On YES button on modal pop up
And Enter Order quantity for first item in review and finalize page for 'Daily'
And Click On Previous Button and verify that we are in order details page

Scenario: Verify Ordering a single day item with clicking Previous Button in the middle of order with All items enabled
When You are in BOSS home page 
Then Click Place Order from Landing Page to navigate to Order Selection page.
And Disable the Order remaining items only radio button
And Check only Daily checkbox for selecting single day item
And Click on All Radio button
And Select All Daily Items
And Click on Continue Button
And Enter Order Quantity ONE in the Order text box and click Enter Key
And Click On Previous Button and Verify pop up message

Scenario: Verify Ordering a single day item with Order Remaining Items False and order all items with 10 Quantity
When You are in BOSS home page 
Then Click Place Order from Landing Page to navigate to Order Selection page.
And Check only Daily checkbox for selecting single day item
And Disable the Order remaining items only radio button
And Select All Daily Items
And Click on Continue Button
And Enter Order Quantity as '10' all the items
And Click on Review and Finalise Button
And Verify the Daily Trend for last '10' days
And Verify the Items Ordered count matches
And Click on Submit Button 
And Verify that Order reaminging Quantity as '0'

Scenario: Verify Ordering a single day item with Order Remaining Items False and order all items with 5 Quantity
When You are in BOSS home page 
Then Click Place Order from Landing Page to navigate to Order Selection page.
And Check only Daily checkbox for selecting single day item
And Disable the Order remaining items only radio button
And Select All Daily Items
And Click on Continue Button
And Get the required Item details from the Service for 'Daily'
And Enter Order Quantity as '5' all the items
And Click on Review and Finalise Button
And Verify the Daily Trend for last '10' days
And Verify the Items Ordered count matches
And Click on Submit Button 
And Verify that Order reaminging Quantity as '0'
