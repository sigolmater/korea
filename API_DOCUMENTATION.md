# Z-CORE API Documentation

## Google Gemini API Integration

### Overview
Z-CORE uses Google's Gemini 2.5-pro model for AI-powered conversations.

### Configuration

**API Key Setup:**
```bash
# .env.local
GEMINI_API_KEY=your_gemini_api_key_here
```

### Service: `geminiService.ts`

#### `getZCoreResponse(prompt: string, history: ChatMessage[]): Promise<string>`

Sends a message to the Gemini API with conversation history and system instructions.

**Parameters:**
- `prompt` (string): User's message
- `history` (ChatMessage[]): Previous conversation messages

**Returns:**
- `Promise<string>`: AI response text

**Throws:**
- Error if API call fails

**Example:**
```typescript
import { getZCoreResponse } from './services/geminiService';

const history = [
  { role: MessageRole.USER, content: '안녕하세요' },
  { role: MessageRole.MODEL, content: '안녕하세요! 무엇을 도와드릴까요?' }
];

const response = await getZCoreResponse('오늘 날씨 알려줘', history);
console.log(response); // AI response
```

### System Prompt

The Z-CORE system uses a comprehensive system prompt defined in `constants.ts`:

- **Name:** Z-CORE
- **Version:** S2.0-FULL
- **Personas:** 15 specialized AI personas
- **Ethics:** Omega-Ino governance framework

### Rate Limiting

Google Gemini API has the following limits:
- Requests per minute (RPM): Varies by tier
- Tokens per minute (TPM): Varies by tier

**Recommended practices:**
- Implement exponential backoff for retries
- Cache responses when appropriate
- Monitor API usage

### Error Handling

```typescript
try {
  const response = await getZCoreResponse(prompt, history);
} catch (error) {
  if (error.message.includes('API_KEY')) {
    // Handle API key errors
  } else if (error.message.includes('rate limit')) {
    // Handle rate limiting
  } else {
    // Handle other errors
  }
}
```

### Security Best Practices

1. **Never expose API keys in client-side code**
2. **Use environment variables** for configuration
3. **Implement request validation** on the backend
4. **Monitor API usage** for anomalies

### Data Privacy

- Conversation history is stored locally in browser (localStorage)
- No data is sent to external servers except Gemini API
- Users can clear history at any time via Settings

---

## Local Storage API

### `useLocalStorage` Hook

Custom React hook for persisting state in localStorage.

**Usage:**
```typescript
import { useLocalStorage } from './hooks/useLocalStorage';

const [messages, setMessages] = useLocalStorage<ChatMessage[]>('key', []);
```

**Functions:**
- `clearLocalStorageKey(key: string)`: Clear specific key
- `clearAllLocalStorage()`: Clear all data

---

## Utility Functions

### Markdown Parser

Located in `utils/markdown.ts`:

**Functions:**
- `parseMarkdown(text: string): string` - Convert markdown to HTML
- `stripMarkdown(text: string): string` - Remove markdown formatting
- `hasCodeBlocks(text: string): boolean` - Check for code blocks
- `extractCodeBlocks(text: string)` - Extract code blocks

**Example:**
```typescript
import { parseMarkdown } from './utils/markdown';

const html = parseMarkdown('**Bold** and `code`');
// Returns: <strong>Bold</strong> and <code>code</code>
```

---

## Component API

### `<App />`
Main application container with chat state management.

### `<ErrorBoundary>`
Catches React errors and displays fallback UI.

### `<ChatInput>`
Props:
- `onSendMessage: (input: string) => void`
- `isLoading: boolean`

### `<ChatMessage>`
Props:
- `message?: ChatMessage`
- `isLoading?: boolean`

### `<Settings>`
Props:
- `onClose: () => void`
- `onClearHistory: () => void`

### `<ChatExport>`
Props:
- `messages: ChatMessage[]`

Exports chat in TXT, MD, or JSON format.

---

## Keyboard Shortcuts

- **Ctrl/Cmd + N**: New chat
- **Ctrl/Cmd + ,**: Open settings
- **Escape**: Close modals
- **Enter**: Send message

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `NODE_ENV` | Environment (development/production) | No |

---

## Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Docker
```bash
docker-compose up -d
```

### Testing
```bash
npm test
npm run test:coverage
```

---

For more information, see [CLAUDE.md](./CLAUDE.md) for AI assistant guidelines.
