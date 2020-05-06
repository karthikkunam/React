@all
Feature: Ordering a GR-Recap item and GR-Recap page E2E Tests

    Scenario: Verify Ordering a GR-Recap item
    When You are in BOSS home page
    Then Click Place Order from Landing Page to navigate to Order Selection page.
    And Check only Non-Daily checkbox for selecting Non-Daily item
    And Click on the Order Remaining Item Only Button
    And Select the first available Non-Daily GR item and Verify remaining Items to Order
    And Click on Continue Button
    And Get the required GR Item details from the Service
    And Verify Cursor is defaulted to first Order Qty box
    And Verify First item in details page is expanded by default
    And Enter Projected Forecast sales Quantity TWENTY in the Order text box and hit Enter Key
    And Verify GR Items Formula validations for BoH, OnO, MoH, Inventory and OrderQty values
    And Validate MaxAllowable Order Qty in order textbox and click on Enter Key for GR Item
    And Click on Close Button
    And Click on Review and Finalize Button
    #And Verify Ordered Qty value in Review and Finalize page
    And Click on Submit Button
    And Click on the GR-recap Button
    And Verify GR Recap page validations for BoH, OnO, Status Approved, Order Qty# value and User Edited

    Scenario: Verify GR Recap RECALCULATE and Last Recalculated time tests
    When You are in BOSS home page
    Then Click Place Order from Landing Page to navigate to Order Selection page.
    And Click on the GR-recap Button
    #Then I save the Last Recalculated time
    And Click on Recalculate Button
    And Verify last recalculated time was present

    Scenario: Verify Item Long Name, UPC and ItemNumber details in Item Info tool-tip Drop Down (R7B-2162) for NonDaily-GR Order Cycle for better ordering decision
    When You are in BOSS home page
    Then Click Place Order from Landing Page to navigate to Order Selection page.
    And Check only Non-Daily checkbox for selecting Non-Daily item
    And Click on the Order Remaining Item Only Button
    And Select the first available Non-Daily GR item and Verify remaining Items to Order
    And Click on Continue Button
    And Get the required Item details from the Service for 'NonDailyGR'
    And Verify Cursor is defaulted to first Order Qty box
    And Verify First item in details page is expanded by default
    And Verify Tooltip for the Item
    
    Scenario: Verify a warning message is displayed if user leaves the GR Recap page with unapproved orders which will only occur when Approval is disabled.  (R7B-1967)
    When You are in BOSS home page 
    Then Click Place Order from Landing Page to navigate to Order Selection page.
    Then Click on the GR-recap Button
    Then Click On Close Button in GR Recap page and Verify pop up message
    And Validate Tapping YES upon Close Button click, returns user to Order Landing page
    Then Click on the GR-recap Button
    Then Click in Home Button in GR Recap page and verify the popup
    And Validate Tapping YES on Home Button click, returns user to Ordering Home

# Scenario: Verify GR Recap page User Edited and Approve button tests 
# When You are in BOSS home page
# Then Click Place Order from Landing Page to navigate to Order Selection page.
# And Click on the GR-recap Button
# And Click on GRRecap Dropdown Button
# And Select First item in GR recap Grid
# # And Click on Continue Button
# And Click on Category and item description header
# And Verify that all the items got selected and Approve button is enabled

###############################################################################################
#  Feature: Ordering a GR-recap item

# Scenario: Verify Ordering a GR-recap items
# When You are in BOSS home page 
# Then Click Place Order from Landing Page to navigate to Order Selection page.
# And Click on the GR-recap Button
# #And Click on Recaliculate Button 
# #And Verify last recalculated time was present
# #And Click on GRRecap Dropdown Button
# #And Select First item in GR recap Grid
# #And Click on Continue Button
# And Click on Category and item description header
# And Verify that all the items got selected and Approve button is enabled


# Scenario: Verify Max/min allowable order qty for non GR Items
# When You are in BOSS home page
# Then Click Place Order from Landing Page to navigate to Order Selection page.
# And Check only Non-Daily checkbox for selecting Non-Daily item
# And Click on the Order Remaining Item Only Button
# And Select the first available Non-Daily GR item and Verify remaining Items to Order
# And Click on Continue Button
# And Get the required GR Item details from the Service
# # Then Get the Max allowable qty from services
# # Then Get the min allowable qty from services
# # And Verify Cursor is defaulted to first Order Qty box
# # And Enter Projected Forecast sales Quantity TWENTY in the Order text box and hit Enter Key
# # And Validate MaxAllowable Order Qty in order textbox and click on Enter Key for GR Item
# # And Click on Close Button
# # And Enter number Min number in order textbox and click on Enter Key for GR Item

# Scenario: Verify Ordering a GR-recap items Max value with USer Edited Color as Red
# When You are in BOSS home page
# Then Click Place Order from Landing Page to navigate to Order Selection page.
# And Click on the GR-recap Button
# # And Get the required GR Item details from the Service
# Then user check the status and updated the OrderQty max