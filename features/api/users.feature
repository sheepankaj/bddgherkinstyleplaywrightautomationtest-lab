Feature: JSONPlaceholder Users API
  As an API consumer
  I want to retrieve a user by ID
  So that I can validate the returned data is correct

  Scenario: Validate user details for ID 2
    Given I request user with ID 2 from the users API
    Then the response status code should be 200
    And the user name should be "Ervin Howell"
    And the user username should be "Antonette"
    And the user email should be "Shanna@melissa.tv"
