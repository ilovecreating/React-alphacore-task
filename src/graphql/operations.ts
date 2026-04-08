import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

const TREE_NODE_FIELDS = gql`
  fragment TreeNodeFields on TreeNode {
    id
    label
    name
    description
    is_assigned
    in_library
    properties {
      name
      value
      value_type
      measure
    }
    relations {
      name
    }
  }
`;

export const GET_TREE = gql`
  ${TREE_NODE_FIELDS}
  query GetTree {
    tree {
      ...TreeNodeFields
      children {
        ...TreeNodeFields
        children {
          ...TreeNodeFields
          children {
            ...TreeNodeFields
            children {
              ...TreeNodeFields
              children {
                ...TreeNodeFields
              }
            }
          }
        }
      }
    }
  }
`;
