#!/bin/bash

# Start Minikube
minikube start

# Enable ingress addon
minikube addons enable ingress

# Apply PostgreSQL deployment and service
kubectl apply -f postgres-deployment.yaml
kubectl apply -f postgres-service.yaml

# Apply Golang backend deployment and service
kubectl apply -f golang-deployment.yaml
kubectl apply -f golang-service.yaml

# Apply Next.js frontend deployment and service
kubectl apply -f nextjs-deployment.yaml
kubectl apply -f nextjs-service.yaml

# Apply ingress
kubectl apply -f ingress.yaml

# Add host entry for Minikube Ingress (only works if you use Ingress)
echo "$(minikube ip) nextjs.local" | sudo tee -a /etc/hosts

# Done
echo "Deployment complete. Visit http://nextjs.local once everything is ready!"
