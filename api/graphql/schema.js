const { buildSchema } = require("graphql");

//Here we define the GraphQL schema
//type is used to define the structure of the data
//RootQuery is the entry point for queries
//for example, the hello query returns a String type which is required (!)
//input defines the structure of the data that will be sent to the server in mutations
//if you look closely, you'll see that RootMutation will handle a mutation that
//creates a user, where it receives a UserInputData input and returns a User type.
module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    type RootQuery {
        hello: String!}

    type RootMutation {
        createUser(userInput: UserInputData): User!
    }

    schema {
    query: RootQuery
        mutation: RootMutation
    }    
`);
