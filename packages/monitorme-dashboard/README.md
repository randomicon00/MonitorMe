# MonitorMe Dashboard

A feature-rich and user-friendly interface for MonitorMe, designed to enhance observability and debugging in distributed applications.

## Installation

### Using Kubernetes

Deploy the MonitorMe UI effortlessly using Kubernetes:

1. Clone the MonitorMe Kubernetes deployment repository:
   ```bash
   git clone https://github.com/randomicon00/kubernetes-deploy
   ```

2. Navigate to the repository directory:
   ```bash
   cd kubernetes-deploy
   ```

3. Deploy the application using `kubectl`:
   ```bash
   kubectl apply -f deployment.yml -f service.yml
   ```

4. Access the MonitorMe UI at the domain or IP configured in your Kubernetes cluster. For localhost, the UI is available on port `3333`.

### Manual Installation

Follow these steps to set up the MonitorMe UI manually:

1. Clone this repository and navigate into it:
   ```bash
   git clone https://github.com/randomicon00/dashboard
   cd ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Navigate to the `client` directory and install client dependencies:
   ```bash
   cd client
   npm install
   ```

4. Return to the main directory and navigate to the `server` directory:
   ```bash
   cd ..
   cd server
   npm install
   ```

5. Configure the API server by updating the `api.js` file in the `routes` directory:
   ```javascript
   const url = 'https://api.monitorme.xyz'; // Replace with your API server domain
   ```

6. Run the application in development mode:
   ```bash
   npm run dev
   ```

   By default, the MonitorMe UI will be running on `http://localhost:3333`.

## Usage

### Home Page
Gain an overview of errors and issues detected by MonitorMe:
- **HTTP Errors**: HTTP status codes in the 4xx/5xx range.
- **Frontend Errors**: Console errors captured in the browser.
- **Collected Spans & Events**: Collected Spans & Events: Aggregated spans and browser events providing a holistic view of system and user interactions, enabling streamlined troubleshooting and performance monitoring. 

View detailed error lists and navigate to specific segments for in-depth analysis by clicking on an error.

### Event Search
Explore browser events with sortable and filterable columns. Select a row to view detailed event information.

### Span Search
View back-end spans recorded by MonitorMe. Filter, sort, and click on any span to access additional details.

### Trigger Routes
Trigger routes represent the initial route in a trace (e.g., `/shopping_cart` in an e-commerce application). Clicking a trigger route reveals all associated spans.

### Sessions
Review recorded sessions, sorted and filtered as needed. Selecting a session provides access to session replay and associated details.

### Segment
Focus on a single service trace and the browser events leading up to it for detailed insights.

### Session
Analyze a session comprehensively with:
- Browser activity replay.
- Service traces from the session.
- Browser events from the session.

## Screenshots

### Dashboard Home Page
![Dashboard Home Page](https://github.com/user-attachments/assets/5d6b6996-9d33-449c-b768-dbdd46a02c97)

### Settings View
![Settings View](https://github.com/user-attachments/assets/eb99f4bd-0c6e-451a-ba9a-63992d7d716e)

### Event Issues and Errors
![Event Issues and Errors](https://github.com/user-attachments/assets/fc26e956-62d2-48a9-b50c-243da9450fb4)

### Shopping Cart Flow
![Shopping Cart Flow](https://github.com/user-attachments/assets/2abd4589-92ab-456e-8c50-19725cf8dfda)

### 404 Span Issues
![404 Span Issues](https://github.com/user-attachments/assets/05d7ce8d-7089-4eca-872b-bfd1f3440963)

### Spans Explorer
![Spans Explorer](https://github.com/user-attachments/assets/60bfd070-1182-4fb2-8914-2f2c9bddd79f)

### Trigger Routes View
![Trigger Routes View](https://github.com/user-attachments/assets/3f154a35-4168-4027-b209-aba114de6f3c)

## Contributing

MonitorMe is open-source, and contributions are welcome! Submit pull requests or report issues on our [GitHub repository](https://github.com/randomicon00/dashboard).

## License

MonitorMe is released under the [MIT License](LICENSE).
