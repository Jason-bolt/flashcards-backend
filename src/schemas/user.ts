const userSchema = `#graphql
    type User {
        id: Int
        username: String
        password: String
    }

    # Inputs
    input newUserInput {
        username: String!
        password: String!
        passwordConfirmation: String!
    }
    
    input loginInput {
        username: String!
        password: String!
    }

    # Responses
    type UserWithoutPassword {
        id: String!
        username: String!
    }
    
    type UserLoggedIn {
        token: String
    }

    type UserResponse {
        status: String!
        message: String!
        data: UserWithoutPassword
    }
    
    type LoginUserResponse {
        status: String!
        message: String!
        data: UserLoggedIn
    }

    extend type Mutation {
        registerUser(data: newUserInput!): UserResponse!
        login(data: loginInput!): LoginUserResponse!
    }
`;

export default userSchema;
