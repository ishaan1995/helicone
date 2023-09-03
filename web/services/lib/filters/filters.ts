import { cp } from "fs";
import { supabaseServer } from "../../../lib/supabaseServer";
import {
  AllOperators,
  AnyOperator,
  FilterBranch,
  FilterLeaf,
  filterListToTree,
  FilterNode,
  TablesAndViews,
} from "./filterDefs";

type KeyMapper<T> = (filter: T) => {
  column: string;
  operator: AllOperators;
  value: string;
};

type KeyMappings = {
  [key in keyof TablesAndViews]: KeyMapper<TablesAndViews[key]>;
};

const extractOperatorAndValueFromAnOperator = (
  operator: AnyOperator
): { operator: AllOperators; value: any } => {
  for (const key in operator) {
    return {
      operator: key as AllOperators,
      value: operator[key as keyof typeof operator],
    };
  }
  throw new Error(`Invalid operator${operator}`);
};

function easyKeyMappings<T extends keyof TablesAndViews>(keyMappings: {
  [key in keyof TablesAndViews[T]]: string;
}): (key: {
  [key in keyof TablesAndViews[T]]: AnyOperator;
}) => { column: string; operator: AllOperators; value: string } {
  return (key: {
    [key in keyof TablesAndViews[T]]: AnyOperator;
  }) => {
    const column = Object.keys(key)[0] as keyof typeof keyMappings;
    const columnFromMapping = keyMappings[column];
    const { operator, value } = extractOperatorAndValueFromAnOperator(
      key[column as keyof typeof keyMappings]
    );

    return {
      column: `${columnFromMapping}`,
      operator: operator,
      value: value,
    };
  };
}

function easyKeyMappingsWithTable<T extends keyof TablesAndViews>(
  keyMappings: {
    [key in keyof TablesAndViews[T]]: string;
  },
  table: T
): (key: {
  [key in keyof TablesAndViews[T]]: AnyOperator;
}) => { column: string; operator: AllOperators; value: string } {
  return (key: {
    [key in keyof TablesAndViews[T]]: AnyOperator;
  }) => {
    const column = keyMappings[key as keyof typeof keyMappings];
    const { operator, value } = extractOperatorAndValueFromAnOperator(
      key[column as keyof typeof keyMappings]
    );

    return {
      column: `${table}.${column}`,
      operator: operator,
      value: value,
    };
  };
}

const NOT_IMPLEMENTED = () => {
  throw new Error("Not implemented");
};

const whereKeyMappings: KeyMappings = {
  user_metrics: easyKeyMappingsWithTable(
    {
      user_id: "user_id",
      last_active: "last_active",
      total_requests: "total_requests",
    },
    "user_metrics"
  ),
  user_api_keys: easyKeyMappingsWithTable(
    {
      api_key_hash: "api_key_hash",
      api_key_name: "api_key_name",
    },
    "user_api_keys"
  ),
  properties: (filter) => {
    const key = Object.keys(filter)[0];
    const { operator, value } = extractOperatorAndValueFromAnOperator(
      filter.property
    );
    return {
      column: `properties ->> '${key}'`,
      operator: operator,
      value: value,
    };
  },
  values: (filter) => {
    const key = Object.keys(filter)[0];
    const { operator, value } = extractOperatorAndValueFromAnOperator(
      filter.value
    );
    return {
      column: `prompt_values ->> '${key}'`,
      operator: operator,
      value: value,
    };
  },
  request: easyKeyMappings<"request">({
    prompt: `coalesce(request.body ->>'prompt', request.body ->'messages'->0->>'content')`,
    created_at: "request.created_at",
    user_id: "request.user_id",
    auth_hash: "request.auth_hash",
    org_id: "request.helicone_org_id",
    id: "request.id",
  }),
  response: easyKeyMappings<"response">({
    body_completion:
      "(coalesce(response.body ->'choices'->0->>'text', response.body ->'choices'->0->>'message'))::text",
    body_model: "request.body ->> 'model'",
    body_tokens: "((response.body -> 'usage') ->> 'total_tokens')::bigint",
    status: "response.status",
  }),
  properties_table: easyKeyMappings<"properties_table">({
    auth_hash: "properties.auth_hash",
    key: "properties.key",
    value: "properties.value",
  }),

  response_copy_v1: easyKeyMappings<"response_copy_v1">({
    auth_hash: "response_copy_v1.auth_hash",
    model: "response_copy_v1.model",
    request_created_at: "response_copy_v1.request_created_at",
    latency: "response_copy_v1.latency",
    user_id: "response_copy_v1.user_id",
    status: "response_copy_v1.status",
  }),
  response_copy_v2: easyKeyMappings<"response_copy_v2">({
    auth_hash: "response_copy_v2.auth_hash",
    model: "response_copy_v2.model",
    request_created_at: "response_copy_v2.request_created_at",
    latency: "response_copy_v2.latency",
    user_id: "response_copy_v2.user_id",
    status: "response_copy_v2.status",
    organization_id: "response_copy_v2.organization_id",
  }),
  response_copy_v3: (filter) => {
    return easyKeyMappings<"response_copy_v3">({
      auth_hash: "response_copy_v3.auth_hash",
      model: "response_copy_v3.model",
      request_created_at: "response_copy_v3.request_created_at",
      latency: "response_copy_v3.latency",
      user_id: "response_copy_v3.user_id",
      status: "response_copy_v3.status",
      organization_id: "response_copy_v3.organization_id",
    })(filter);
  },
  users_view: NOT_IMPLEMENTED,
  properties_copy_v1: easyKeyMappings<"properties_copy_v1">({
    key: "properties_copy_v1.key",
    value: "properties_copy_v1.value",
    auth_hash: "properties_copy_v1.auth_hash",
  }),

  properties_copy_v2: easyKeyMappings<"properties_copy_v2">({
    key: "properties_copy_v2.key",
    value: "properties_copy_v2.value",
    organization_id: "properties_copy_v2.organization_id",
  }),
  property_with_response_v1: easyKeyMappings<"property_with_response_v1">({
    property_key: "property_with_response_v1.property_key",
    property_value: "property_with_response_v1.property_value",
    request_created_at: "property_with_response_v1.request_created_at",
    organization_id: "property_with_response_v1.organization_id",
  }),
  run: (filter) => {
    if ("custom_properties" in filter && filter.custom_properties) {
      const key = Object.keys(filter.custom_properties)[0];
      const { operator, value } = extractOperatorAndValueFromAnOperator(
        filter.custom_properties[key as keyof typeof filter.custom_properties]
      );
      return {
        column: `custom_properties ->> '${key}'`,
        operator: operator,
        value: value,
      };
    }
    return easyKeyMappings<"run">({
      created_at: "run.created_at",
      org_id: "run.org_id",
      id: "run.id",
      description: "run.description",
      name: "run.name",
      status: "run.status",
      timeout_seconds: "run.timeout_seconds",
      updated_at: "run.updated_at",
    })(filter);
  },
  task: (filter) => {
    if ("custom_properties" in filter && filter.custom_properties) {
      console.log("customer_properties", filter.custom_properties);
      const key = Object.keys(filter.custom_properties)[0];
      console.log("key", key);

      const { operator, value } = extractOperatorAndValueFromAnOperator(
        filter.custom_properties[key as keyof typeof filter.custom_properties]
      );
      console.log("operator", operator);
      console.log("value", value);
      return {
        column: `custom_properties ->> '${key}'`,
        operator: operator,
        value: value,
      };
    }
    return easyKeyMappings<"task">({
      created_at: "task.created_at",
      id: "task.id",
      name: "task.name",
      description: "task.description",
      parent_task: "task.parent_task",
      timeout_seconds: "task.timeout_seconds",
      org_id: "task.org_id",
      run_id: "task.run",
      status: "task.status",
      updated_at: "task.updated_at",
    })(filter);
  },
};

const havingKeyMappings: KeyMappings = {
  user_metrics: easyKeyMappings<"user_metrics">({
    last_active: "max(request.created_at)",
    total_requests: "count(request.id)",
  }),
  users_view: easyKeyMappings<"users_view">({
    cost: "cost",
  }),
  user_api_keys: NOT_IMPLEMENTED,
  properties: NOT_IMPLEMENTED,
  request: NOT_IMPLEMENTED,
  response: NOT_IMPLEMENTED,
  values: NOT_IMPLEMENTED,
  properties_table: NOT_IMPLEMENTED,
  response_copy_v1: NOT_IMPLEMENTED,
  properties_copy_v1: NOT_IMPLEMENTED,
  response_copy_v2: NOT_IMPLEMENTED,
  response_copy_v3: NOT_IMPLEMENTED,
  properties_copy_v2: NOT_IMPLEMENTED,
  property_with_response_v1: NOT_IMPLEMENTED,
  run: NOT_IMPLEMENTED,
  task: NOT_IMPLEMENTED,
};

export function buildFilterLeaf(
  filter: FilterLeaf,
  argsAcc: any[],
  keyMappings: KeyMappings,
  argPlaceHolder: (arg_index: number, arg: any) => string
): {
  filters: string[];
  argsAcc: any[];
} {
  const filters: string[] = [];

  for (const _tableKey in filter) {
    const tableKey = _tableKey as keyof typeof filter;
    const table = filter[tableKey];
    const mapper = keyMappings[tableKey] as KeyMapper<typeof table>;
    const { column, operator: operatorKey, value } = mapper(table);

    const sqlOperator =
      operatorKey === "equals"
        ? "="
        : operatorKey === "like"
        ? "LIKE"
        : operatorKey === "ilike"
        ? "ILIKE"
        : operatorKey === "gte"
        ? ">="
        : operatorKey === "lte"
        ? "<="
        : operatorKey === "not-equals"
        ? "!="
        : operatorKey === "contains"
        ? "ILIKE"
        : undefined;

    filters.push(
      `${column} ${sqlOperator} ${argPlaceHolder(argsAcc.length, value)}`
    );
    if (operatorKey === "contains") {
      argsAcc.push(`%${value}%`);
    } else {
      argsAcc.push(value);
    }
  }

  return {
    filters,
    argsAcc,
  };
}

export function buildFilterBranch(
  args: Omit<BuildFilterArgs, "filter"> & { filter: FilterBranch }
): {
  filter: string;
  argsAcc: any[];
} {
  const { filter, argPlaceHolder, argsAcc, having } = args;
  if (filter.operator !== "or" && filter.operator !== "and") {
    throw new Error("Invalid filter: only OR is supported");
  }
  const { filter: leftFilter, argsAcc: leftArgsAcc } = buildFilter({
    ...args,
    filter: filter.left,
    argsAcc,
    argPlaceHolder,
    having,
  });
  const { filter: rightFilter, argsAcc: rightArgsAcc } = buildFilter({
    ...args,
    filter: filter.right,
    argsAcc: leftArgsAcc,
    argPlaceHolder,
    having,
  });
  return {
    filter: `(${leftFilter} ${filter.operator} ${rightFilter})`,
    argsAcc: rightArgsAcc,
  };
}

export function buildFilter(args: BuildFilterArgs): {
  filter: string;
  argsAcc: any[];
} {
  const { filter, argPlaceHolder, argsAcc, having } = args;
  if (filter === "all") {
    return {
      filter: "true",
      argsAcc,
    };
  }
  if ("left" in filter) {
    return buildFilterBranch({
      ...args,
      filter,
      argsAcc,
      argPlaceHolder,
      having,
    });
  }

  const res = buildFilterLeaf(
    filter,
    argsAcc,
    having ? havingKeyMappings : whereKeyMappings,
    argPlaceHolder
  );

  if (res.filters.length === 0) {
    return {
      filter: "true",
      argsAcc: res.argsAcc,
    };
  }
  return {
    filter: res.filters.join(" AND "),
    argsAcc: res.argsAcc,
  };
}

export function clickhouseParam(index: number, parameter: any) {
  if (typeof parameter === "number") {
    return `{val_${index} : Int32}`;
  } else if (typeof parameter === "boolean") {
    return `{val_${index} : UInt8}`;
  } else if (parameter instanceof Date) {
    return `{val_${index} : DateTime}`;
  } else {
    return `{val_${index} : String}`;
  }
}

export function buildFilterClickHouse(
  args: ExternalBuildFilterArgs
): ReturnType<typeof buildFilter> {
  return buildFilter({
    ...args,
    argPlaceHolder: clickhouseParam,
  });
}

function buildFilterPostgres(
  args: ExternalBuildFilterArgs
): ReturnType<typeof buildFilter> {
  return buildFilter({
    ...args,
    argPlaceHolder: (index, parameter) => `$${index + 1}`,
  });
}

async function getUserIdHashes(user_id: string): Promise<string[]> {
  const { data: user_api_keys, error } = await supabaseServer
    .from("user_api_keys")
    .select("api_key_hash")
    .eq("user_id", user_id);
  if (error) {
    throw error;
  }
  if (!user_api_keys || user_api_keys.length === 0) {
    throw new Error("No API keys found for user");
  }
  return user_api_keys.map((x) => x.api_key_hash);
}

async function buildUserIdHashesFilter(
  user_id: string,
  hashToFilter: (hash: string) => FilterLeaf
) {
  const userIdHashes = await getUserIdHashes(user_id);
  const filters: FilterLeaf[] = userIdHashes.map(hashToFilter);
  return filterListToTree(filters, "or");
}

export interface BuildFilterArgs {
  filter: FilterNode;
  argsAcc: any[];
  having?: boolean;
  argPlaceHolder: (arg_index: number, arg: any) => string;
}
export type ExternalBuildFilterArgs = Omit<
  BuildFilterArgs,
  "argPlaceHolder" | "user_id"
>;

export async function buildFilterWithAuthClickHouse(
  args: ExternalBuildFilterArgs & { org_id: string }
): Promise<{ filter: string; argsAcc: any[] }> {
  return buildFilterWithAuth(args, "clickhouse", (orgId) => ({
    response_copy_v3: {
      organization_id: {
        equals: orgId,
      },
    },
  }));
}

export async function buildFilterWithAuthClickHousePropResponse(
  args: ExternalBuildFilterArgs & { org_id: string }
): Promise<{ filter: string; argsAcc: any[] }> {
  return buildFilterWithAuth(args, "clickhouse", (orgId) => ({
    property_with_response_v1: {
      organization_id: {
        equals: orgId,
      },
    },
  }));
}

export async function buildFilterWithAuthClickHouseProperties(
  args: ExternalBuildFilterArgs & { org_id: string }
): Promise<{ filter: string; argsAcc: any[] }> {
  return buildFilterWithAuth(args, "clickhouse", (orgId) => ({
    properties_copy_v2: {
      organization_id: {
        equals: orgId,
      },
    },
  }));
}

export async function buildFilterWithAuthRunsTable(
  args: ExternalBuildFilterArgs & { org_id: string }
): Promise<{ filter: string; argsAcc: any[] }> {
  return buildFilterWithAuth(args, "postgres", (orgId) => ({
    run: {
      org_id: {
        equals: orgId,
      },
    },
  }));
}

export async function buildFilterWithAuthTasksTable(
  args: ExternalBuildFilterArgs & { org_id: string }
): Promise<{ filter: string; argsAcc: any[] }> {
  return buildFilterWithAuth(args, "postgres", (orgId) => ({
    task: {
      org_id: {
        equals: orgId,
      },
    },
  }));
}

export async function buildFilterWithAuth(
  args: ExternalBuildFilterArgs & {
    org_id: string;
  },
  database: "postgres" | "clickhouse" = "postgres",
  getOrgIdFilter: (orgId: string) => FilterLeaf = (orgId) => ({
    request: {
      org_id: {
        equals: orgId,
      },
    },
  })
): Promise<{ filter: string; argsAcc: any[] }> {
  const { org_id, filter } = args;

  const filterNode: FilterNode = {
    left: getOrgIdFilter(org_id),
    operator: "and",
    right: filter,
  };

  const filterBuilder =
    database === "clickhouse" ? buildFilterClickHouse : buildFilterPostgres;

  return filterBuilder({
    ...args,
    filter: filterNode,
  });
}
