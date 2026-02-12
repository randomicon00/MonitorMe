# Deploying Applications on Minikube (Ubuntu Server)

This guide will help you set up Minikube on a fresh Ubuntu server and deploy your applications. Ensure you have sudo privileges on the server.

---

## Prerequisites

### 1. Update and Install Required Packages

Run the following commands to update your server and install necessary tools:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget apt-transport-https ca-certificates gnupg lsb-release
```

### 2. Install Docker

Install Docker to manage containerized applications:

```bash
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

Logout and log back in to apply the group changes.

### 3. Install Kubectl

Download and install the Kubernetes CLI tool:

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

### 4. Install Minikube

Download and install Minikube:

```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

### 5. Verify Installations

Ensure Docker, kubectl, and Minikube are installed correctly:

```bash
docker --version
kubectl version --client
minikube version
```

---

## Steps to Deploy Applications

### 1. Start Minikube

Initialize Minikube with the following command:

```bash
minikube start --driver=docker
```

### 2. Enable Ingress Addon

Enable the Ingress addon to expose your services:

```bash
minikube addons enable ingress
```

### 3. Prepare Domain Configuration

Ensure your domain (`monitorme.xyz`) is configured to point to the Minikube IP. Update your domain's DNS settings to include the following A records:

- `www.monitorme.xyz` -> `<Minikube IP>`
- `app.monitorme.xyz` -> `<Minikube IP>`

Replace `<Minikube IP>` with the output of:

```bash
minikube ip
```

### 4. Upload Application Files to Server

Upload your website, Next.js app, and Golang service files to the server using one of the following methods:

#### a. Using `scp`:

```bash
scp -r /path/to/local/files username@your_server_ip:/path/to/remote/directory
```

#### b. Using `rsync`:

```bash
rsync -avz /path/to/local/files username@your_server_ip:/path/to/remote/directory
```

#### c. Using Git (recommanded):

Push your files to a Git repository and clone them on the server:

```bash
git clone https://github.com/your-repo.git /path/to/remote/directory
```

#### d. Using SFTP:

Use tools like FileZilla or WinSCP to upload the files through a graphical interface.

---

### 5. Apply Kubernetes Manifests

Use `kubectl` to deploy your applications. Ensure you have the following YAML files ready in the same directory:

- `postgres-deployment.yaml`
- `postgres-service.yaml`
- `golang-deployment.yaml`
- `golang-service.yaml`
- `nextjs-deployment.yaml`
- `nextjs-service.yaml`
- `ingress.yaml`
- `html-deployment.yaml`
- `html-service.yaml`

Run the commands:

```bash
kubectl apply -f postgres-deployment.yaml
kubectl apply -f postgres-service.yaml
kubectl apply -f golang-deployment.yaml
kubectl apply -f golang-service.yaml
kubectl apply -f nextjs-deployment.yaml
kubectl apply -f nextjs-service.yaml
kubectl apply -f html-deployment.yaml
kubectl apply -f html-service.yaml
kubectl apply -f ingress.yaml
```

### 6. Update Hosts File

Add entries to your `/etc/hosts` file to access your applications via their domain names:

```bash
echo "$(minikube ip) www.monitorme.xyz" | sudo tee -a /etc/hosts
echo "$(minikube ip) app.monitorme.xyz" | sudo tee -a /etc/hosts
```

---

## Configure Ingress

Your `ingress.yaml` should route traffic as follows:

- `www.monitorme.xyz` -> Static HTML site (served by `html-service`)
- `app.monitorme.xyz` -> Next.js Dashboard (served by `nextjs-service`)
- Ensure the Golang app (`golang-service`) is internal and not exposed on port 80.

Example `ingress.yaml`:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: monitorme-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: www.monitorme.xyz
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: html-service
                port:
                  number: 80
    - host: app.monitorme.xyz
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: nextjs-service
                port:
                  number: 80
```

---

## Verify Deployment

### 1. Check Minikube Status

Ensure Minikube is running:

```bash
minikube status
```

### 2. Check Kubernetes Resources

Verify that all deployments and services are running:

```bash
kubectl get all
```

### 3. Access the Applications

- Static HTML site: `http://www.monitorme.xyz`
- Next.js Dashboard: `http://app.monitorme.xyz`

Wait for the services to be fully initialized if the pages don't load immediately.

---

## Troubleshooting

### Check Pod Logs

If a pod is not running, inspect its logs:

```bash
kubectl logs <pod-name>
```

### Restart Minikube

If Minikube fails to start correctly, you can delete and restart it:

```bash
minikube delete
minikube start
```

### Debug Ingress

If the Ingress is not routing traffic correctly, verify the Ingress configuration:

```bash
kubectl describe ingress
```

---

## Additional Notes

- Ensure that your YAML manifests are correctly configured.
- For production use, consider using a cloud provider like GKE, AKS, or EKS instead of Minikube.
