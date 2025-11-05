import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { ProductsService, UsersService } from "../services";
import z from "zod";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Order, orders, Product, products, users } from "../data/data";

// const APP_BaseURL = 'http://localhost:3000/api';

export function mapRawOrdersToStructured(orders: Order[]): {
  orderId: number;
  products: z.infer<typeof ProductSchema>[];
}[] {
  return orders.map((order) => ({
    orderId: order.id,
    products: order.products.map((product) => {
      const productInfo = products.find((p) => p.id === product.productId);
      return {
        id: productInfo?.id,
        name: productInfo?.name,
        price: productInfo?.price,
        quantity: product.quantity,
        totalPrice: productInfo ? productInfo.price * product.quantity : 0,
      } as z.infer<typeof ProductSchema>;
    }),
  }));
}

export function mapRawProductsToStructured(
  products: Product[],
): z.infer<typeof ProductSchema>[] {
  return products.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 0,
    totalPrice: 0,
  }));
}

const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  totalPrice: z.number(),
});

export const mcpServer = new McpServer({
  name: "ecommerce-mcp-server",
  description: "An e-commerce server integrated with Model Context Protocol",
  version: "1.0.0",
});

mcpServer.registerTool(
  "list_products",
  {
    description: "List all available products",
    title: "List Products",
    outputSchema: {
      products: z.array(ProductSchema),
    },
    annotations: {
      readOnlyHint: true, // Indicates that this tool does not modify any data
      idempotentHint: true, // Indicates that multiple calls yield the same result
      destructiveHint: false, // Indicates that this tool may modify or delete data, false meaning it does not
      openWorldHint: true, // Indicates that this tool can handle a wide range of inputs
    },
  },
  async () => {
    try {
      // const toolName = getDisplayName({ name: 'list_products' });
      // logger.info(`tool ${toolName}::: - Listing all products`);
      const products = await ProductsService.listProducts();
      const structuredProducts = mapRawProductsToStructured(products);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ products }),
          },
        ],
        structuredContent: {
          products: structuredProducts,
        },
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: `Error listing products: ${(error as Error).message}`,
            }),
          },
        ],
        structuredContent: {
          error: (error as Error).message,
        },
      };
    }
  },
);

mcpServer.registerTool(
  "get_user_orders",
  {
    description: "Get orders for a specific user",
    title: "Get User Orders by his ID",
    inputSchema: {
      userId: z.string(),
    },
    outputSchema: {
      orders: z.array(
        z.object({
          orderId: z.number(),
          products: z.array(ProductSchema),
        }),
      ),
    },
  },
  async ({ userId }) => {
    try {
      // const toolName = getDisplayName({ name: 'get_user_orders' });
      // logger.info(`tool ${toolName}::: - Getting orders for user ${userId}`);
      const orders = await UsersService.getUserOrders(userId);
      const structuredOrders = mapRawOrdersToStructured(orders);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ orders }),
          },
        ],
        structuredContent: {
          orders: structuredOrders,
        },
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: `Error getting user orders: ${(error as Error).message}`,
            }),
          },
        ],
        structuredContent: {
          error: (error as Error).message,
        },
      };
    }
  },
);

mcpServer.registerResource(
  "user-profile",
  new ResourceTemplate("users://{userId}/profile", { list: undefined }),
  {
    title: "User Profile",
    description: "User profile information",
  },
  async (uri, { userId }) => {
    const user = users.find((u) => u.id === parseInt(userId as string));
    const userOrders = orders.filter(
      (o) => o.userId === parseInt(userId as string),
    );
    if (!user) {
      return {
        contents: [
          {
            uri: uri.href,
            text: `User with ID ${userId} not found.`,
            mimeType: "text/plain",
          },
        ],
      };
    }
    return {
      contents: [
        {
          uri: uri.href,
          text: `Profile data for user ${userId}: ${JSON.stringify(user)} Orders: ${JSON.stringify(userOrders)}`,
        },
      ],
    };
  },
);

mcpServer.registerPrompt(
  "profile-summary",
  {
    description: "Summarize the user's profile information",
    title: "User Profile Summary",
    argsSchema: { userId: z.string() },
  },
  async ({ userId }) => {
    const user = await UsersService.getUserById(userId);
    if (!user) {
      return {
        messages: [
          {
            role: "assistant",
            content: {
              type: "text",
              text: `You are a helpful assistant that summarizes user profiles.`,
            },
          },
          {
            role: "user",
            content: {
              type: "text",
              text: `User with ID ${userId} not found.`,
            },
          },
        ],
      };
    } else {
      return {
        messages: [
          {
            role: "assistant",
            content: {
              type: "text",
              text: `You are a helpful assistant that summarizes user profiles.`,
            },
          },
          {
            role: "user",
            content: {
              type: "text",
              text: `please summarize the profile for user ID ${userId}`,
            },
          },
        ],
      };
    }
  },
);

export async function startMcpServer() {
  try {
    const transport = new StdioServerTransport();
    await mcpServer.connect(transport);
    // Server is now running - don't log to stdout!
  } catch (error) {
    // Write errors to stderr, not stdout
    process.stderr.write(`Error starting MCP server: ${error}\n`);
    throw error;
  }
}
