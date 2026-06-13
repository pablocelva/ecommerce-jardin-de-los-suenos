export namespace OpenAPI {
  export interface Document {
    openapi: string;
    info: InfoObject;
    servers?: ServerObject[];
    paths: PathsObject;
    components?: ComponentsObject;
  }

  export interface InfoObject {
    title: string;
    version: string;
    description?: string;
  }

  export interface ServerObject {
    url: string;
    description?: string;
  }

  export type PathsObject = Record<string, PathItemObject>;

  export interface PathItemObject {
    get?: OperationObject;
    post?: OperationObject;
    put?: OperationObject;
    delete?: OperationObject;
  }

  export interface OperationObject {
    tags?: string[];
    summary?: string;
    description?: string;
    security?: SecurityRequirementObject[];
    parameters?: ParameterObject[];
    requestBody?: RequestBodyObject;
    responses: ResponsesObject;
  }

  export type SecurityRequirementObject = Record<string, string[]>;

  export interface ParameterObject {
    name: string;
    in: "query" | "header" | "path" | "cookie";
    required?: boolean;
    schema?: SchemaObject;
  }

  export interface RequestBodyObject {
    required?: boolean;
    content: Record<string, MediaTypeObject>;
  }

  export interface MediaTypeObject {
    schema?: SchemaObject | ReferenceObject;
  }

  export type ResponsesObject = Record<
    string,
    {
      description: string;
      content?: Record<string, MediaTypeObject>;
    }
  >;

  export interface ComponentsObject {
    securitySchemes?: Record<string, SecuritySchemeObject>;
    schemas?: Record<string, SchemaObject>;
  }

  export interface SecuritySchemeObject {
    type: string;
    scheme?: string;
    bearerFormat?: string;
  }

  export interface SchemaObject {
    type?: string;
    format?: string;
    example?: unknown;
    enum?: string[];
    minimum?: number;
    nullable?: boolean;
    properties?: Record<string, SchemaObject | ReferenceObject>;
    items?: SchemaObject | ReferenceObject;
    required?: string[];
    default?: unknown;
    $ref?: string;
  }

  export interface ReferenceObject {
    $ref: string;
  }
}