# MonitorMe App

**MonitorMe App** is a sleek and powerful user interface designed for interacting with **MonitorMe**, providing a comprehensive view of system traces, browser events, and more. The MonitorMe UI enables easy access to insights, error monitoring, and session tracking, ensuring a clear understanding of your application's behavior.

## Features

- Client-Side and Server-Side Error Tracking
- Comprehensive Event and Span Search
- Session and Segment Monitoring
- Trigger Route Insights for Tracing Requests

## Installation

### Manual Installation:

1. Clone the repository:

```bash
git clone https://github.com/randomicon00/MonitorMe-UI.git
cd MonitorMe-UI
```

2. Install dependencies:

```bash
npm install
```

3. Update API Endpoint:

Modify the API endpoint in `client/src/api.js` to point to your MonitorMe API Service:

```javascript
const url = "https://your-api-domain.com"; // Update this to your API service URL
```

4. Start the Development Server:

```bash
npm run dev
```

The UI will be accessible at (http://localhost:3200)[http://localhost:3200].

## Kubernetes Deployment

MonitorMe UI can be deployed easily to your Kubernetes cluster. Follow the steps below:

1. Modify the Kubernetes YAML configuration in the kubernetes/ directory to suit your environment.
2. Apply the configuration:

```bash
kubectl apply -f kubernetes/ui-deployment.yaml
```

The UI will be available via your Kubernetes service at the specified domain or IP.

## Usage

Home Page
The Home Page provides an overview of system performance, showing counts of **Client-Side**, **Server-Side**, and **Frontend Errors**.

- Client-Side errors are HTTP requests resulting in 4xx responses.
- Server-Side errors are HTTP requests resulting in 5xx responses.
- Frontend Errors are captured from `console.error` browser events.

The page also displays a list of errors, where clicking on a row will take you to the associated segment for more details.

### Event Search

The Event Search Page allows you to filter and sort browser events, providing detailed insight into user actions and client-side activity. Clicking on an event displays more specific details.

### Span Search

The Span Search Page enables you to view, sort, and filter backend spans. Clicking on any span provides deeper insights into backend performance, errors, and the related traces.

### Trigger Routes

The Trigger Routes Page shows a list of initial requests that kicked off a trace in your system. Clicking on a trigger route lets you explore all spans associated with that route, giving you full visibility into the requests and their downstream effects.

### Sessions

The Sessions Page displays a list of recorded sessions, each representing a unique user session within your application. Clicking on a session brings you to the Session Page, which includes detailed session data, such as browser events and system traces.

### Segment View

The Segment Page provides a deep dive into specific service traces, showing the lifecycle of a request and its associated events, including any browser interactions that occurred around the time of the trace.

### Session Replay

The Session Replay Page shows a visual replay of a user’s interactions within your application, along with corresponding service traces and browser events. This gives you a complete view of the user's session and helps identify any issues or anomalies.

## Testing

The MonitorMe UI includes comprehensive end-to-end tests to ensure reliability. To run the tests, simply execute the following command:

```bash
npm test
```

Tests will cover key areas such as error tracking, session replay, and event handling, ensuring that all features work as expected.

## Contributing

We encourage contributions to MonitorMe! If you have any ideas, improvements, or bug fixes, feel free to submit a pull request. For more information, check out our contribution guidelines on GitHub: randomicon00.
