#!/usr/bin/env node
import { startMcpServer } from "./mcp/server";

// Start only the MCP server (no Express, no console logs to stdout)
startMcpServer().catch((error) => {
  // Write errors to stderr, not stdout
  process.stderr.write(`Failed to start MCP server: ${error}\n`);
  process.exit(1);
});
