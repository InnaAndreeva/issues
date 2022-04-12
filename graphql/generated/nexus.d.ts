/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context } from "./../context"
import type { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    DateTime<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    DateTime<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  UserSession: { // input type
    email: string; // String!
    id: string; // ID!
    image?: string | null; // String
    name?: string | null; // String
    role: NexusGenEnums['Role']; // Role!
  }
}

export interface NexusGenEnums {
  Quarter: "Q1" | "Q2" | "Q3" | "Q4"
  Role: "ADMIN" | "USER"
  SortOrder: "asc" | "desc"
  UserKind: "GHOST" | "USER"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
}

export interface NexusGenObjects {
  Activity: { // root type
    created_at: NexusGenScalars['DateTime']; // DateTime!
    ghost?: NexusGenRootTypes['Ghost'] | null; // Ghost
    id: string; // ID!
    updated_at: NexusGenScalars['DateTime']; // DateTime!
    user?: NexusGenRootTypes['User'] | null; // User
  }
  Ghost: { // root type
    activity?: NexusGenRootTypes['Activity'] | null; // Activity
    created_at: NexusGenScalars['DateTime']; // DateTime!
    email: string; // String!
    host?: NexusGenRootTypes['User'] | null; // User
    host_id: string; // String!
    id: string; // ID!
    updated_at: NexusGenScalars['DateTime']; // DateTime!
    user?: NexusGenRootTypes['User'] | null; // User
  }
  Goal: { // root type
    blocks?: Array<NexusGenRootTypes['Goal'] | null> | null; // [Goal]
    computedOwner?: NexusGenRootTypes['UserAnyKind'] | null; // UserAnyKind
    connected?: Array<NexusGenRootTypes['Goal'] | null> | null; // [Goal]
    created_at: NexusGenScalars['DateTime']; // DateTime!
    dependsOn?: Array<NexusGenRootTypes['Goal'] | null> | null; // [Goal]
    description: string; // String!
    estimate?: NexusGenScalars['DateTime'] | null; // DateTime
    id: number; // Int!
    issuer?: NexusGenRootTypes['Activity'] | null; // Activity
    issuer_id?: string | null; // String
    key?: boolean | null; // Boolean
    owner?: NexusGenRootTypes['Activity'] | null; // Activity
    owner_id?: string | null; // String
    participants?: Array<NexusGenRootTypes['Activity'] | null> | null; // [Activity]
    personal?: boolean | null; // Boolean
    private?: boolean | null; // Boolean
    project?: Array<NexusGenRootTypes['Project'] | null> | null; // [Project]
    project_id?: number | null; // Int
    quarter?: Array<NexusGenEnums['Quarter'] | null> | null; // [Quarter]
    relatedTo?: Array<NexusGenRootTypes['Goal'] | null> | null; // [Goal]
    title: string; // String!
    updated_at: NexusGenScalars['DateTime']; // DateTime!
    year: string[]; // [String!]!
  }
  Mutation: {};
  Project: { // root type
    computedOwner?: NexusGenRootTypes['UserAnyKind'] | null; // UserAnyKind
    created_at: NexusGenScalars['DateTime']; // DateTime!
    description?: string | null; // String
    goals?: Array<NexusGenRootTypes['Goal'] | null> | null; // [Goal]
    id: number; // Int!
    owner?: NexusGenRootTypes['Activity'] | null; // Activity
    slug?: string | null; // String
    title: string; // String!
    updated_at: NexusGenScalars['DateTime']; // DateTime!
  }
  Query: {};
  User: { // root type
    activity?: NexusGenRootTypes['Activity'] | null; // Activity
    activity_id?: string | null; // String
    created_at: NexusGenScalars['DateTime']; // DateTime!
    email: string; // String!
    id: string; // ID!
    image?: string | null; // String
    name?: string | null; // String
    role: NexusGenEnums['Role']; // Role!
    updated_at: NexusGenScalars['DateTime']; // DateTime!
  }
  UserAnyKind: { // root type
    activity?: NexusGenRootTypes['Activity'] | null; // Activity
    email?: string | null; // String
    id?: string | null; // String
    image?: string | null; // String
    kind?: NexusGenEnums['UserKind'] | null; // UserKind
    name?: string | null; // String
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  Activity: { // field return type
    created_at: NexusGenScalars['DateTime']; // DateTime!
    ghost: NexusGenRootTypes['Ghost'] | null; // Ghost
    id: string; // ID!
    updated_at: NexusGenScalars['DateTime']; // DateTime!
    user: NexusGenRootTypes['User'] | null; // User
  }
  Ghost: { // field return type
    activity: NexusGenRootTypes['Activity'] | null; // Activity
    created_at: NexusGenScalars['DateTime']; // DateTime!
    email: string; // String!
    host: NexusGenRootTypes['User'] | null; // User
    host_id: string; // String!
    id: string; // ID!
    updated_at: NexusGenScalars['DateTime']; // DateTime!
    user: NexusGenRootTypes['User'] | null; // User
  }
  Goal: { // field return type
    blocks: Array<NexusGenRootTypes['Goal'] | null> | null; // [Goal]
    computedOwner: NexusGenRootTypes['UserAnyKind'] | null; // UserAnyKind
    connected: Array<NexusGenRootTypes['Goal'] | null> | null; // [Goal]
    created_at: NexusGenScalars['DateTime']; // DateTime!
    dependsOn: Array<NexusGenRootTypes['Goal'] | null> | null; // [Goal]
    description: string; // String!
    estimate: NexusGenScalars['DateTime'] | null; // DateTime
    id: number; // Int!
    issuer: NexusGenRootTypes['Activity'] | null; // Activity
    issuer_id: string | null; // String
    key: boolean | null; // Boolean
    owner: NexusGenRootTypes['Activity'] | null; // Activity
    owner_id: string | null; // String
    participants: Array<NexusGenRootTypes['Activity'] | null> | null; // [Activity]
    personal: boolean | null; // Boolean
    private: boolean | null; // Boolean
    project: Array<NexusGenRootTypes['Project'] | null> | null; // [Project]
    project_id: number | null; // Int
    quarter: Array<NexusGenEnums['Quarter'] | null> | null; // [Quarter]
    relatedTo: Array<NexusGenRootTypes['Goal'] | null> | null; // [Goal]
    title: string; // String!
    updated_at: NexusGenScalars['DateTime']; // DateTime!
    year: string[]; // [String!]!
  }
  Mutation: { // field return type
    createGoal: NexusGenRootTypes['Goal'] | null; // Goal
    createProject: NexusGenRootTypes['Project'] | null; // Project
    inviteUser: NexusGenRootTypes['Ghost'] | null; // Ghost
  }
  Project: { // field return type
    computedOwner: NexusGenRootTypes['UserAnyKind'] | null; // UserAnyKind
    created_at: NexusGenScalars['DateTime']; // DateTime!
    description: string | null; // String
    goals: Array<NexusGenRootTypes['Goal'] | null> | null; // [Goal]
    id: number; // Int!
    owner: NexusGenRootTypes['Activity'] | null; // Activity
    slug: string | null; // String
    title: string; // String!
    updated_at: NexusGenScalars['DateTime']; // DateTime!
  }
  Query: { // field return type
    findGhost: Array<NexusGenRootTypes['Ghost'] | null> | null; // [Ghost]
    findUser: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    findUserAnyKind: Array<NexusGenRootTypes['UserAnyKind'] | null> | null; // [UserAnyKind]
    project: NexusGenRootTypes['Project'] | null; // Project
    projectGoals: Array<NexusGenRootTypes['Goal'] | null> | null; // [Goal]
    projectsCompletion: Array<NexusGenRootTypes['Project'] | null> | null; // [Project]
    users: Array<NexusGenRootTypes['User'] | null> | null; // [User]
  }
  User: { // field return type
    activity: NexusGenRootTypes['Activity'] | null; // Activity
    activity_id: string | null; // String
    created_at: NexusGenScalars['DateTime']; // DateTime!
    email: string; // String!
    id: string; // ID!
    image: string | null; // String
    name: string | null; // String
    role: NexusGenEnums['Role']; // Role!
    updated_at: NexusGenScalars['DateTime']; // DateTime!
  }
  UserAnyKind: { // field return type
    activity: NexusGenRootTypes['Activity'] | null; // Activity
    email: string | null; // String
    id: string | null; // String
    image: string | null; // String
    kind: NexusGenEnums['UserKind'] | null; // UserKind
    name: string | null; // String
  }
}

export interface NexusGenFieldTypeNames {
  Activity: { // field return type name
    created_at: 'DateTime'
    ghost: 'Ghost'
    id: 'ID'
    updated_at: 'DateTime'
    user: 'User'
  }
  Ghost: { // field return type name
    activity: 'Activity'
    created_at: 'DateTime'
    email: 'String'
    host: 'User'
    host_id: 'String'
    id: 'ID'
    updated_at: 'DateTime'
    user: 'User'
  }
  Goal: { // field return type name
    blocks: 'Goal'
    computedOwner: 'UserAnyKind'
    connected: 'Goal'
    created_at: 'DateTime'
    dependsOn: 'Goal'
    description: 'String'
    estimate: 'DateTime'
    id: 'Int'
    issuer: 'Activity'
    issuer_id: 'String'
    key: 'Boolean'
    owner: 'Activity'
    owner_id: 'String'
    participants: 'Activity'
    personal: 'Boolean'
    private: 'Boolean'
    project: 'Project'
    project_id: 'Int'
    quarter: 'Quarter'
    relatedTo: 'Goal'
    title: 'String'
    updated_at: 'DateTime'
    year: 'String'
  }
  Mutation: { // field return type name
    createGoal: 'Goal'
    createProject: 'Project'
    inviteUser: 'Ghost'
  }
  Project: { // field return type name
    computedOwner: 'UserAnyKind'
    created_at: 'DateTime'
    description: 'String'
    goals: 'Goal'
    id: 'Int'
    owner: 'Activity'
    slug: 'String'
    title: 'String'
    updated_at: 'DateTime'
  }
  Query: { // field return type name
    findGhost: 'Ghost'
    findUser: 'User'
    findUserAnyKind: 'UserAnyKind'
    project: 'Project'
    projectGoals: 'Goal'
    projectsCompletion: 'Project'
    users: 'User'
  }
  User: { // field return type name
    activity: 'Activity'
    activity_id: 'String'
    created_at: 'DateTime'
    email: 'String'
    id: 'ID'
    image: 'String'
    name: 'String'
    role: 'Role'
    updated_at: 'DateTime'
  }
  UserAnyKind: { // field return type name
    activity: 'Activity'
    email: 'String'
    id: 'String'
    image: 'String'
    kind: 'UserKind'
    name: 'String'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    createGoal: { // args
      description: string; // String!
      key?: boolean | null; // Boolean
      owner_id: string; // String!
      personal?: boolean | null; // Boolean
      private?: boolean | null; // Boolean
      project_id: number; // Int!
      title: string; // String!
      user: NexusGenInputs['UserSession']; // UserSession!
    }
    createProject: { // args
      description?: string | null; // String
      owner_id: string; // String!
      title: string; // String!
      user: NexusGenInputs['UserSession']; // UserSession!
    }
    inviteUser: { // args
      email: string; // String!
      user: NexusGenInputs['UserSession']; // UserSession!
    }
  }
  Query: {
    findGhost: { // args
      query: string; // String!
      sortBy?: NexusGenEnums['SortOrder'] | null; // SortOrder
    }
    findUser: { // args
      query: string; // String!
      sortBy?: NexusGenEnums['SortOrder'] | null; // SortOrder
    }
    findUserAnyKind: { // args
      query: string; // String!
      sortBy?: NexusGenEnums['SortOrder'] | null; // SortOrder
    }
    project: { // args
      slug: string; // String!
    }
    projectGoals: { // args
      slug: string; // String!
    }
    projectsCompletion: { // args
      query: string; // String!
      sortBy?: NexusGenEnums['SortOrder'] | null; // SortOrder
    }
    users: { // args
      sortBy?: NexusGenEnums['SortOrder'] | null; // SortOrder
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}