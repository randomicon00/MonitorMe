export const FAQ_DATA = [
  {
    question: "What is MonitorMe?",
    answer: `MonitorMe is an open-source observability tool designed for distributed applications. It helps developers gather, connect, and filter events from both front-end and back-end traces, streamlining debugging and monitoring.`,
  },
  {
    question: "How do I install MonitorMe?",
    answer: `You can install MonitorMe by:
    1. Installing the client and server agents using npm.
    2. Configuring the agents with your application's settings.
    3. Setting up the visualization dashboard using Kubernetes deployment files.`,
  },
  {
    question: "What features does MonitorMe offer?",
    answer: `MonitorMe provides distributed tracing, session replay, and real-time monitoring capabilities. It allows developers to detect performance bottlenecks, identify errors, and understand user interactions effectively.`,
  },
  {
    question: "Can I use MonitorMe with my existing stack?",
    answer: `Yes, MonitorMe integrates seamlessly with existing microservices and uses OpenTelemetry for back-end observability and rrweb for front-end session recording. It supports Node.js, Python, Java, Go, and .NET.`,
  },
  {
    question: "How does MonitorMe handle security?",
    answer: `MonitorMe incorporates user authentication and is designed to ensure data security. Planned updates include user authorization protocols for more granular access control.`,
  },
  {
    question: "What is distributed tracing in MonitorMe?",
    answer: `Distributed tracing in MonitorMe tracks requests as they traverse through multiple services in your application, providing insights into where errors occur and helping to identify performance bottlenecks.`,
  },
  {
    question: "Does MonitorMe support real-time analytics?",
    answer: `Yes, MonitorMe features a Real-Time Processing Engine that manages data transformation and analytics, ensuring developers can monitor and troubleshoot issues dynamically.`,
  },
  {
    question: "What databases does MonitorMe use?",
    answer: `MonitorMe uses PostgreSQL as its primary datastore for robust and flexible data handling. It also supports scaling options for high-write scenarios using Cassandra.`,
  },
  {
    question: "How can I contribute to MonitorMe?",
    answer: `MonitorMe is open-source, and contributions are welcome on GitHub. You can fork the repository, work on features or fixes, and submit pull requests for review.`,
  },
  {
    question: "Where can I get support for MonitorMe?",
    answer: `You can visit our GitHub repository for documentation, issue tracking, and community discussions. For further assistance, feel free to reach out to the MonitorMe team.`,
  },
];
