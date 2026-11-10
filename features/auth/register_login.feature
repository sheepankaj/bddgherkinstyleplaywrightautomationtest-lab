Feature: ParaBank User Registration and Authentication
  As a new ParaBank user
  I want to register and then login securely
  So that I can verify complete authentication works end-to-end

  Background:
    Given I navigate to the ParaBank home page

  Scenario: Register a new user and verify account creation
    Then I should see the "Welcome to ParaBank" text
    When I register a new user with random credentials
    Then I should see the registration success message
    When I click logout
    Then I should see the "Welcome to ParaBank" text

  Scenario: Login with the registered user and validate account overview
    When I login with the registered credentials
    Then I should be on the "Accounts Overview" page
    When I click logout
    Then I should see the "Welcome to ParaBank" text
