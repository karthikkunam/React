@all
Feature: Ordering a Non-daily item

    Scenario: Verify Ordering a Non-daily item with Order Remaining Items True
        When You are in BOSS home page 
        Then Click Place Order from Landing Page to navigate to Order Selection page.
        And Check only Non-Daily checkbox for selecting Non-Daily item
        And Select the first avilable Non-Daily item and Verify remaing Items to Order
        And Click on Continue Button
        And Verify Cursor if defaulted to first question
        And Get the required Item details from the Service for 'NonDaily'
        And Verify Tooltip for the Item
        And Answer the question on forecast sales
        And Enter Order Quantity ONE in the Order text box and click Enter Key for Non-Daily items
        And Verify the Daily Trend for last '8' days
        And Verify the Weekly Trend for last '4' weeks for Non_daily Item
        And Click on Review and Finalise Button
        And Verify that we will get modal popup with No. of items not ordered
        And click On YES button on modal pop up
        And Verify the Daily Trend for last '10' days
        And Click on Submit Button 
        And Verify that Order Landing page got opened and Remaining to Order was decreased by one for Non-Daily Items

    Scenario: Verify Ordering a Non-Daily items with Order Remaining Items False and order all items with 10 Quantity
        When You are in BOSS home page 
        Then Click Place Order from Landing Page to navigate to Order Selection page.
        And Check only Non-Daily checkbox for selecting Non-Daily item
        And Select the first avilable Non-Daily item and Verify remaing Items to Order
        And Click on Continue Button
        And Enter Order Quantity as '10' all the items
        And Click on Review and Finalise Button
        And click On YES button on modal pop up
        And Verify the Daily Trend for last '10' days
        And Click on Submit Button 
        And Verify that Order reaminging Quantity as '0'

    Scenario: Verify Ordering a Non-Daily items with Order Remaining Items False and with All Items Radio button ON
        When You are in BOSS home page 
        Then Click Place Order from Landing Page to navigate to Order Selection page.
        And Check only Non-Daily checkbox for selecting Non-Daily item
        And Click on All Radio button
        And Select the first avilable Non-Daily item and Verify remaing Items to Order
        And Click on Continue Button
        And Enter Order Quantity as '10' all the items
        And Click on Review and Finalise Button
        And click On YES button on modal pop up
        And Verify the Daily Trend for last '10' days
        And Click on Submit Button 
        And Verify that Order reaminging Quantity as '0'
