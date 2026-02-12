# MonitorMe Client Agent Documentation

**MonitorMe Client Agent** is a Node.js package for capturing browser events and adding identifying headers to outgoing requests. These events are correlated with backend traces, enabling full-stack visibility into system behavior, both on the frontend and backend, using OpenTelemetry.

## Installtion

To install the MonitorMe Client Agent, run the following npm command:

```bash
npm install monitor-me-agent
```

## Configuration

The client agent can be configured using a YAML file. Import the `Recorder` object into your entry point (e.g., `index.js`), and call the `init()` method to start the agent:

```javascript
import Recorder from "monitorme-client-agent";
Recorder.init();
```

By default, the agent will patch the `fetch` API to automatically add identifying headers (e.g., session, user ID) to outgoing requests, making backend tracing possible.

### Session Handling

- Session IDs expire after 30 minutes or when the tab/window is closed, ensuring session data remains relevant.

### Configuration File

Modify the configuration in the `monitorme-client-agent` YAML file located inside the package folder. The agent requires you to configure the following options:

```yaml
endpoint: "http://your-backend-endpoint.com"
fullSnapshotEndpoint: "http://your-backend-snapshot-endpoint.com"

sampling:
  mousemove: false
  mouseInteraction:
    MouseUp: false
    MouseDown: false
    Click: true
    ContextMenu: false
    DblClick: true
    Focus: true
    Blur: true
    TouchStart: false
    TouchEnd: false
  input: "last"

fullSnapshotEveryNthEvent: 10
```

- `endpoint`: Specifies the URL to which browser events are sent. This should point to the MonitorMe backend, which is responsible for storing event data and correlating it with backend traces.
- `fullSnapshotEndpoint`: URL for sending full DOM snapshot data to the backend. These snapshots allow reconstruction of the user session.
- `sampling`: Defines the specific browser events to be captured, such as mouse interactions and input events. You can customize which events to capture based on your application's needs.
  - `mousemove`: Toggle capturing of mouse movements.
  - `mouseInteraction`: Define which mouse interactions (e.g., clicks, double clicks) are captured.
  - `input`: Controls how frequently input changes are recorded. Set to `"last"` to record the last input state before the session ends.
- `fullSnapshotEveryNthEvent`: Configures how often full snapshots of the DOM are sent to the backend. Setting this to 10 will capture a snapshot every 10 events.

### Example

A sample configuration might look like this:

```yaml
endpoint: "http://myawesomeapp.com/events"
fullSnapshotEndpoint: "http://myawesomeapp.com/snapshots"

sampling:
  mousemove: false
  mouseInteraction:
    MouseUp: false
    MouseDown: false
    Click: true
    ContextMenu: false
    DblClick: true
    Focus: true
    Blur: true
    TouchStart: false
    TouchEnd: false
  input: "last"

fullSnapshotEveryNthEvent: 10
```

### Configuration Steps

1. Update the `endpoint` and `fullSnapshotEndpoint` properties with the appropriate backend URLs.
2. Customize the sampling rules for browser events to meet your application's specific monitoring needs.
3. Deploy the configuration file along with your application.
