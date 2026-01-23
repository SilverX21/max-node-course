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

    type AuthData {
        userId: ID!
        token: String!
    }

    type PostData {
        posts: [Post!]!
        totalPosts: Int!
    }

    input PostInputData {
        title: String!
        content: String!
        imageUrl: String!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData!
        posts(page: Int, perPage: Int): PostData!
        post(id: ID!): Post!
        user: User!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
        createPost(postInput: PostInputData): Post!
        updatePost(id: ID!, postInput: PostInputData): Post!
        deletePost(id: ID!): Boolean!
        updateStatus(status: String!): User!
    }

    schema {
    query: RootQuery
        mutation: RootMutation
    }    
`);
