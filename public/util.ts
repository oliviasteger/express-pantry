type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type InputTag = "input" | "textarea";
type Field = InputTag | { [key: string]: Field };
type Fields = Record<string, Field>;

type operation = {
  name: string;
  endpoint: string;
  method: HttpMethod;
  fields: Fields;
};

const operations: operation[] = [
  {
    name: "Get Session User (logged in user)",
    endpoint: "/api/session",
    method: "GET",
    fields: {},
  },
  {
    name: "Create User",
    endpoint: "/api/users",
    method: "POST",
    fields: { username: "input", password: "input", information: "input" },
  },
  {
    name: "Login",
    endpoint: "/api/login",
    method: "POST",
    fields: { username: "input", password: "input" },
  },
  {
    name: "Logout",
    endpoint: "/api/logout",
    method: "POST",
    fields: {},
  },
  {
    name: "Update User",
    endpoint: "/api/users",
    method: "PATCH",
    fields: { update: { username: "input", password: "input", information: "input" } },
  },
  {
    name: "Delete User",
    endpoint: "/api/users",
    method: "DELETE",
    fields: {},
  },
  {
    name: "Get Users (empty for all)",
    endpoint: "/api/users/:username",
    method: "GET",
    fields: { username: "input" },
  },
  {
    name: "Create Profile",
    endpoint: "/api/profiles",
    method: "POST",
    fields: { administrator: "input", location: "input", name: "input", openHour: "input", closeHour: "input", pickupWindowLength: "input", ordersPerWindow: "input", rules: "input" },
  },
  {
    name: "Get Profile by id",
    endpoint: "/api/profiles/id/:_id",
    method: "GET",
    fields: { _id: "input" },
  },
  {
    name: "Get Profiles by Query",
    endpoint: "/api/profiles",
    method: "GET",
    fields: { searchQuery: "input" },
  },
  {
    name: "Update Profile",
    endpoint: "/api/profiles",
    method: "PATCH",
    fields: {
      _id: "input",
      update: { administrator: "input", location: "input", name: "input", openHour: "input", closeHour: "input", pickupWindowLength: "input", ordersPerWindow: "input", rules: "input" },
    },
  },
  {
    name: "Delete Profile",
    endpoint: "/api/profiles/:_id",
    method: "DELETE",
    fields: {
      _id: "input",
    },
  },
  {
    name: "Assert eligibility",
    endpoint: "/api/profiles/eligibility/:profileId/:userId",
    method: "GET",
    fields: {
      userId: "input",
    },
  },
  {
    name: "Get current user pantry",
    endpoint: "/api/profiles/currentUser",
    method: "GET",
    fields: {},
  },
  {
    name: "Get Available Times",
    endpoint: "api/profiles/:profileId/availableTimes",
    method: "GET",
    fields: { profileId: "input" },
  },
  {
    name: "Get your items",
    endpoint: "/api/items",
    method: "GET",
    fields: {},
  },
  {
    name: "Add items",
    endpoint: "/api/items",
    method: "POST",
    fields: { barcode: "input", dropDate: "input", expirationDate: "input", status: "input" },
  },
  {
    name: "Get user orders",
    endpoint: "/api/order/user/:userId",
    method: "GET",
    fields: { userId: "input" },
  },
  {
    name: "Get order",
    endpoint: "/api/order/:_id",
    method: "GET",
    fields: { _id: "input" },
  },
  { name: "Place Order", endpoint: "/api/order", method: "POST", fields: { profileId: "input", pickupTime: "input", barcodes: "input" } },
  {
    name: "Update Order Status",
    endpoint: "/api/order/status",
    method: "PATCH",
    fields: { orderId: "input", newStatus: "input" },
  },
  {
    name: "Delete order",
    endpoint: "/api/order",
    method: "DELETE",
    fields: { orderId: "input" },
  },
  {
    name: "Get expiring items by owner",
    endpoint: "/api/users/:id/items",
    method: "GET",
    fields: { id: "input" },
  },
  {
    name: "Get expiring items that you own",
    endpoint: "/api/items",
    method: "GET",
    fields: {},
  },
  {
    name: "Create expiring item",
    endpoint: "/api/items",
    method: "POST",
    fields: { barcode: "input", dropDate: "input", expirationDate: "input", status: "input" },
  },
  {
    name: "Update expiring item",
    endpoint: "/api/items/:id",
    method: "PATCH",
    fields: { id: "input", update: { barcode: "input", dropDate: "input", expirationDate: "input", status: "input" } },
  },
  {
    name: "Delete expiring item",
    endpoint: "/api/items/:id",
    method: "DELETE",
    fields: { id: "input" },
  },
  {
    name: "Get map",
    endpoint: "/api/map",
    method: "GET",
    fields: {},
  },
  {
    name: "Get requests",
    endpoint: "/api/requests",
    method: "GET",
    fields: {},
  },
  {
    name: "Create request",
    endpoint: "/api/requests",
    method: "POST",
    fields: { barcode: "input", requestee: "input" },
  },
  {
    name: "Update request",
    endpoint: "/api/requests/:id",
    method: "PATCH",
    fields: { id: "input", update: { barcode: "input", requestee: "input" } },
  },
  {
    name: "Delete request",
    endpoint: "/api/requests/:id",
    method: "DELETE",
    fields: { id: "input" },
  },
  {
    name: "Organize Inventory",
    endpoint: "/api/inventory",
    method: "PATCH",
    fields: { adminId: "input" },
  },
];

// Do not edit below here.
// If you are interested in how this works, feel free to ask on forum!

function updateResponse(code: string, response: string) {
  document.querySelector("#status-code")!.innerHTML = code;
  document.querySelector("#response-text")!.innerHTML = response;
}

async function request(method: HttpMethod, endpoint: string, params?: unknown) {
  try {
    if (method === "GET" && params) {
      endpoint += "?" + new URLSearchParams(params as Record<string, string>).toString();
      params = undefined;
    }

    const res = fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: params ? JSON.stringify(params) : undefined,
    });

    return {
      $statusCode: (await res).status,
      $response: await (await res).json(),
    };
  } catch (e) {
    console.log(e);
    return {
      $statusCode: "???",
      $response: { error: "Something went wrong, check your console log.", details: e },
    };
  }
}

function fieldsToHtml(fields: Record<string, Field>, indent = 0, prefix = ""): string {
  return Object.entries(fields)
    .map(([name, tag]) => {
      return `
        <div class="field" style="margin-left: ${indent}px">
          <label>${name}:
          ${typeof tag === "string" ? `<${tag} name="${prefix}${name}"></${tag}>` : fieldsToHtml(tag, indent + 10, prefix + name + ".")}
          </label>
        </div>`;
    })
    .join("");
}

function getHtmlOperations() {
  return operations.map((operation) => {
    return `<li class="operation">
      <h3>${operation.name}</h3>
      <form class="operation-form">
        <input type="hidden" name="$endpoint" value="${operation.endpoint}" />
        <input type="hidden" name="$method" value="${operation.method}" />
        ${fieldsToHtml(operation.fields)}
        <button type="submit">Submit</button>
      </form>
    </li>`;
  });
}

function prefixedRecordIntoObject(record: Record<string, string>) {
  const obj: any = {}; // eslint-disable-line
  for (const [key, value] of Object.entries(record)) {
    if (!value) {
      continue;
    }
    const keys = key.split(".");
    const lastKey = keys.pop()!;
    let currentObj = obj;
    for (const key of keys) {
      if (!currentObj[key]) {
        currentObj[key] = {};
      }
      currentObj = currentObj[key];
    }
    currentObj[lastKey] = value;
  }
  return obj;
}

async function submitEventHandler(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const { $method, $endpoint, ...reqData } = Object.fromEntries(new FormData(form));

  // Replace :param with the actual value.
  const endpoint = ($endpoint as string).replace(/:(\w+)/g, (_, key) => {
    const param = reqData[key] as string;
    delete reqData[key];
    return param;
  });

  const data = prefixedRecordIntoObject(reqData as Record<string, string>);

  updateResponse("", "Loading...");
  const response = await request($method as HttpMethod, endpoint as string, Object.keys(data).length > 0 ? data : undefined);
  updateResponse(response.$statusCode.toString(), JSON.stringify(response.$response, null, 2));
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#operations-list")!.innerHTML = getHtmlOperations().join("");
  document.querySelectorAll(".operation-form").forEach((form) => form.addEventListener("submit", submitEventHandler));
});
