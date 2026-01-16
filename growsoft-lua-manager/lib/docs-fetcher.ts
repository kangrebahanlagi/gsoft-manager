interface DocItem {
  id: string;
  title: string;
  description: string;
  category: string;
  path: string;
}

interface DocContent {
  title: string;
  content: string;
  lastUpdated: string;
  category: string;
}

const GITHUB_DOCS_URL = 'https://raw.githubusercontent.com/kangrebahanlagi/docsToDownload/main';

export async function fetchDocsIndex(): Promise<DocItem[]> {
  try {
    // In a real implementation, fetch from GitHub API
    // For now, return mock data
    return getMockDocs();
  } catch (error) {
    console.error('Failed to fetch docs index:', error);
    return getMockDocs();
  }
}

export async function fetchDocByPath(path: string): Promise<DocContent | null> {
  try {
    // In a real implementation, fetch from GitHub
    // For now, return mock content
    return getMockDocContent(path);
  } catch (error) {
    console.error('Failed to fetch doc:', error);
    return getMockDocContent(path);
  }
}

export async function fetchDocsContent(paths: string[]): Promise<string> {
  const docs = await Promise.all(
    paths.map(path => fetchDocByPath(path))
  );
  
  return docs
    .filter((doc): doc is DocContent => doc !== null)
    .map(doc => `## ${doc.title}\n${doc.content.substring(0, 500)}...`)
    .join('\n\n');
}

function getMockDocs(): DocItem[] {
  return [
    {
      id: 'api-reference',
      title: 'Growsoft Lua API Reference',
      description: 'Complete reference of all Lua API functions available in Growsoft',
      category: 'API',
      path: 'api-reference.md',
    },
    {
      id: 'events',
      title: 'Events System',
      description: 'How to use and handle events in Growsoft Lua scripts',
      category: 'Events',
      path: 'events.md',
    },
    {
      id: 'packets',
      title: 'Packet Handling',
      description: 'Working with network packets in Growsoft',
      category: 'Packets',
      path: 'packets.md',
    },
    {
      id: 'hooks',
      title: 'Hooks System',
      description: 'Using hooks to intercept and modify function calls',
      category: 'Hooks',
      path: 'hooks.md',
    },
    {
      id: 'tutorial-getting-started',
      title: 'Getting Started Tutorial',
      description: 'Basic tutorial for creating your first Lua script',
      category: 'Tutorials',
      path: 'tutorial-getting-started.md',
    },
    {
      id: 'best-practices',
      title: 'Best Practices',
      description: 'Recommended practices for Lua scripting in Growsoft',
      category: 'Reference',
      path: 'best-practices.md',
    },
  ];
}

function getMockDocContent(path: string): DocContent {
  const mockContent: Record<string, DocContent> = {
    'api-reference.md': {
      title: 'Growsoft Lua API Reference',
      content: `# Growsoft Lua API Reference

## Core Functions

### gt.sendPacket(packet)
Send a packet to the server.

\`\`\`lua
-- Example: Send a tile update packet
local packet = {
  type = "tile_update",
  x = 100,
  y = 50,
  tile = 8
}
gt.sendPacket(packet)
\`\`\`

### gt.onPacket(callback)
Register a callback for incoming packets.

\`\`\`lua
gt.onPacket(function(packet)
  if packet.type == "player_move" then
    print("Player moved to:", packet.x, packet.y)
  end
end)
\`\`\`

### gt.getLocal()
Get local player information.

\`\`\`lua
local player = gt.getLocal()
print("Player name:", player.name)
print("Level:", player.level)
\`\`\`

## Event System

### gt.on(event, callback)
Register event handlers.

Available events:
- \`player_join\`: When a player joins the world
- \`player_leave\`: When a player leaves
- \`tile_change\`: When a tile is modified
- \`dialog\`: When a dialog appears

\`\`\`lua
gt.on("player_join", function(player)
  print(player.name .. " joined the world!")
end)
\`\`\`

## Hook System

### gt.hook(functionName, callback)
Hook into internal functions.

\`\`\`lua
gt.hook("sendChat", function(original, message)
  -- Modify chat message before sending
  local modified = "[BOT] " .. message
  return original(modified)
end)
\`\`\`

## Utility Functions

### gt.sleep(ms)
Sleep for milliseconds.

### gt.log(message)
Log a message to console.

### gt.getTile(x, y)
Get tile information at coordinates.

### gt.placeTile(x, y, tile)
Place a tile at coordinates.`,
      lastUpdated: '2024-01-15',
      category: 'API',
    },
    'events.md': {
      title: 'Events System',
      content: `# Events System

## Introduction
Growsoft provides an event system that allows scripts to react to game events.

## Available Events

### Player Events
- \`player_join\`: Triggered when a player joins
- \`player_leave\`: Triggered when a player leaves
- \`player_move\`: Triggered when a player moves
- \`player_chat\`: Triggered when a player sends chat

### World Events
- \`tile_change\`: Triggered when a tile is modified
- \`object_place\`: Triggered when an object is placed
- \`object_break\`: Triggered when an object is broken

### UI Events
- \`dialog_open\`: Triggered when a dialog opens
- \`dialog_close\`: Triggered when a dialog closes
- \`inventory_update\`: Triggered when inventory changes

## Event Handler Examples

\`\`\`lua
-- Basic event handler
gt.on("player_join", function(player)
  print("Welcome " .. player.name .. "!")
  
  -- Send welcome message
  gt.sendPacket({
    type = "chat",
    message = "Welcome to the server!",
    target = player.id
  })
end)

-- Multiple events
gt.on({"tile_change", "object_place"}, function(data)
  print("Something changed at:", data.x, data.y)
end)

-- Event with condition
gt.on("player_chat", function(message, player)
  if message:find("hello") then
    print(player.name .. " said hello!")
  end
end)
\`\`\`

## Event Data Structure
Each event provides different data. Check documentation for specific event data formats.`,
      lastUpdated: '2024-01-10',
      category: 'Events',
    },
  };

  return mockContent[path] || {
    title: 'Documentation',
    content: 'Documentation content will be loaded from GitHub repository.',
    lastUpdated: new Date().toISOString().split('T')[0],
    category: 'General',
  };
}