1. Detail what you have already completed in your project. What requirements were met in completing these bits?
    * Implemented people functionality, supporting creation of a person in the database, deleting a person, swapping roles, updating affiliations or updating an existing person's role properties
    * Created tests for each module – person, roles, texts, mastheads, users, etc.
    * Successfully connect to a local and cloud instance of MongoDB
    * Successfully created an instance of the cloud server and connect to it in order to manipulate people objects in the database
    * Initialized endpoints to use on the client side to create people objects, set roles, update affiliations, and modify text pages
2. Set out your goals for this semester. Please detail what the requirement is that each goal will meet, and how you expect to meet it.
    * Refine manuscript functions based on the requirements in manuscript_req.md
        * Implement ways to modify our manuscript by writing functions to create, read, update, and delete objects (form fields, field names)
        * How: Divide functionality amongst each member of the team, for actions like parsing form data, accessing field names, and reading title values.
    * Integrate backend and frontend into one application
        * Uphold backend logic to handle database updates, creation of users, changes in properties like affiliation or role
        * Allow users on client side to interact with the backend via the frontend (e.g. form handling, form submission parsing)
        * How: Research / Learn ways to handle data displays (e.g. visualizing users created in the database on our frontend), polish frontend features by creating a user friendly UI to handle user input, support clear instructions for clarity on how to use the application
    * Include more tests to handle people and text CRUD functions
        * Create test cases that make use of each function, ensuring that these functions succeed as expected and fail safely when given invalid inputs